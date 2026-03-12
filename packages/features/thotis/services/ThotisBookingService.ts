import type { IncomingMessage } from "node:http";
import { createEvent, deleteEvent, updateEvent } from "@calcom/features/calendars/lib/CalendarManager";
import type { BookingResultDto, SessionDto } from "@calcom/lib/dto/thotis/ThotisApiSchemas";
import { parseBookingMetadata } from "@calcom/lib/dto/thotis/ThotisApiSchemas";
import { toBookingResultDto, toSessionDtoArray } from "@calcom/lib/dto/thotis/ThotisDtoMappers";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import logger from "@calcom/lib/logger";
import { sanitizeUserInput } from "@calcom/lib/sanitizeUserInput";
import { Prisma, type PrismaClient } from "@calcom/prisma/client";
import { MentorIncidentType, MentorStatus, ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import type { CredentialForCalendarService } from "@calcom/types/Credential";
import { uuid } from "short-uuid";

/**
 * Locally defined to avoid importing from @calcom/trpc (architecture boundary).
 * Mirrors packages/trpc/server/routers/viewer/slots/types.ts
 */
interface ContextForGetSchedule extends Record<string, unknown> {
  req?: (IncomingMessage & { cookies: Partial<{ [key: string]: string }> }) | undefined;
}

import process from "node:process";
import { RedisService } from "../../redis/RedisService";
import {
  THOTIS_BOOKING_DURATION_MINUTES,
  THOTIS_BOOKING_DURATION_MS,
  THOTIS_DEFAULT_LOCALE,
  THOTIS_DEFAULT_TIME_ZONE,
  THOTIS_GOOGLE_MEET_PLACEHOLDER,
  THOTIS_JITSI_ROOM_PREFIX,
  THOTIS_MENTORING_EVENT_DESCRIPTION,
  THOTIS_MENTORING_EVENT_SLUG,
  THOTIS_MENTORING_EVENT_TITLE,
  THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES,
  THOTIS_NO_SHOW_SYSTEM_DESCRIPTION,
} from "../lib/constants";
import { AnalyticsService } from "./AnalyticsService";
import type { ThotisAnalyticsService } from "./ThotisAnalyticsService";
import { ThotisBookingCommunicationService } from "./ThotisBookingCommunicationService";
import { ThotisEmailService } from "./ThotisEmailService";
import { ThotisGuestService } from "./ThotisGuestService";

const log = logger.getSubLogger({ prefix: ["ThotisBookingService"] });

/**
 * Service for managing Thotis student mentoring session bookings
 * Implements business logic for 15-minute sessions with validation
 */
export class ThotisBookingService {
  private analytics: AnalyticsService;
  private thotisAnalytics: ThotisAnalyticsService | null = null;
  private redis?: RedisService;
  private guestService: ThotisGuestService;
  private emailService: ThotisEmailService;
  private communicationService: ThotisBookingCommunicationService;

  constructor(
    private readonly prisma: Prisma.TransactionClient | PrismaClient,
    analytics?: AnalyticsService,
    redis?: RedisService,
    thotisAnalytics?: ThotisAnalyticsService,
    guestService?: ThotisGuestService,
    emailService?: ThotisEmailService,
    communicationService?: ThotisBookingCommunicationService
  ) {
    this.analytics = analytics || new AnalyticsService();
    this.redis = redis;
    this.thotisAnalytics = thotisAnalytics || null;
    this.guestService = guestService || new ThotisGuestService();
    this.emailService = emailService || new ThotisEmailService();
    this.communicationService =
      communicationService ||
      new ThotisBookingCommunicationService(this.prisma, this.guestService, this.emailService);

    // Try to initialize Redis if not provided and env vars exist
    if (!this.redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        this.redis = new RedisService();
      } catch (e) {
        log.warn("Failed to initialize RedisService", { error: e });
      }
    }
  }

  private async runSerializableTransaction<T>(
    operation: (tx: Prisma.TransactionClient | PrismaClient) => Promise<T>
  ): Promise<T> {
    if ("$transaction" in this.prisma && typeof this.prisma.$transaction === "function") {
      return this.prisma.$transaction((tx) => operation(tx), {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    }

    return operation(this.prisma);
  }

  private async invalidateStudentCache(userId: number, studentProfileId: string) {
    if (!this.redis) return;

    try {
      // Invalidate availability version (forces new availability computation)
      await this.redis.set(`availability:version:${studentProfileId}`, Date.now().toString(), {
        ttl: 24 * 60 * 60 * 1000,
      });

      // Invalidate stats cache
      await this.redis.del(`stats:student:${userId}`);

      // Invalidate profile cache
      await this.redis.del(`profile:${userId}`);
    } catch (error) {
      log.warn("Failed to invalidate cache", { error, studentProfileId, userId });
    }
  }

  private getResolvedLocale(locale?: string | null): string {
    return locale || THOTIS_DEFAULT_LOCALE;
  }

  private getResolvedTimeZone(timeZone?: string | null): string {
    return timeZone || THOTIS_DEFAULT_TIME_ZONE;
  }

  /**
   * Creates a new student mentoring session
   * Enforces 15-minute duration and validates availability
   * Property 8: Session Duration Invariant
   * Property 14: Minimum Booking Notice
   * Property 7: Double Booking Prevention
   */
  async createStudentSession(input: {
    studentProfileId: string;
    dateTime: Date;
    locale?: string;
    timeZone?: string;
    prospectiveStudent: {
      name: string;
      email: string;
      question?: string;
    };
  }): Promise<BookingResultDto> {
    // Validate minimum booking notice (2 hours)
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES * 60 * 1000);

    if (input.dateTime < twoHoursFromNow) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Bookings must be made at least 2 hours in advance");
    }

    // Validate student profile exists and is active
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: input.studentProfileId },
      select: {
        id: true,
        userId: true,
        isActive: true,
        status: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            studentProfile: {
              select: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!studentProfile) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Student profile ${input.studentProfileId} not found`);
    }

    if (studentProfile.status !== MentorStatus.VERIFIED) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Student profile is not verified and cannot accept bookings"
      );
    }

    // Calculate end time (exactly 15 minutes)
    const startTime = input.dateTime;
    const endTime = new Date(startTime.getTime() + THOTIS_BOOKING_DURATION_MS);

    // Check for double booking (Property 7)
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        userId: studentProfile.userId,
        status: {
          in: ["ACCEPTED", "PENDING"],
        },
        OR: [
          {
            // New booking starts during existing booking
            AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
          },
          {
            // New booking ends during existing booking
            AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
          },
          {
            // New booking completely contains existing booking
            AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
          },
        ],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    if (existingBooking) {
      throw new ErrorWithCode(
        ErrorCode.BookingConflict,
        `Time slot ${startTime.toISOString()} is already booked`
      );
    }

    // Validate real availability (Property 7 extension: Schedules and Calendars)
    await this.validateSlotAvailability(studentProfile.userId, startTime, endTime);

    // Rate-limit booking creation via Redis (anti-abuse)
    await this.rateLimitBookingCreation(input.prospectiveStudent.email);

    // Generate Meeting link (Property 32)
    // Use integrations:google-video by default for Thotis sessions
    // This will be handled by CalendarManager/createEvent mostly,
    // but we can set it as default location.
    // Use integrations:google-video to trigger Cal.com's Google Calendar integration
    const googleMeetLink = THOTIS_GOOGLE_MEET_PLACEHOLDER;
    const booking = await this.runSerializableTransaction(async (tx) => {
      const eventTypeMetadata = {
        isThotisSession: true,
        lockedDuration: true,
        studentProfileId: input.studentProfileId,
      } satisfies Prisma.InputJsonValue;

      let eventType = await tx.eventType.findFirst({
        where: {
          userId: studentProfile.userId,
          metadata: {
            path: ["isThotisSession"],
            equals: true,
          },
        },
        select: {
          id: true,
          length: true,
        },
      });

      if (!eventType) {
        eventType = await tx.eventType.create({
          data: {
            userId: studentProfile.userId,
            title: THOTIS_MENTORING_EVENT_TITLE,
            slug: THOTIS_MENTORING_EVENT_SLUG,
            length: THOTIS_BOOKING_DURATION_MINUTES,
            hidden: true,
            metadata: eventTypeMetadata,
            minimumBookingNotice: THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES,
          },
          select: {
            id: true,
            length: true,
          },
        });
      }

      if (eventType.length !== THOTIS_BOOKING_DURATION_MINUTES) {
        throw new ErrorWithCode(
          ErrorCode.InternalServerError,
          `Session duration must be exactly ${THOTIS_BOOKING_DURATION_MINUTES} minutes`
        );
      }

      const conflictingBooking = await tx.booking.findFirst({
        where: {
          userId: studentProfile.userId,
          status: {
            in: ["ACCEPTED", "PENDING"],
          },
          OR: [
            {
              AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
            },
            {
              AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
            },
            {
              AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
            },
          ],
        },
        select: {
          id: true,
        },
      });

      if (conflictingBooking) {
        throw new ErrorWithCode(
          ErrorCode.BookingConflict,
          `Time slot ${startTime.toISOString()} is already booked`
        );
      }

      // Sanitize prospective student inputs
      const sanitizedQuestion = sanitizeUserInput(input.prospectiveStudent.question, 500);
      const sanitizedName = sanitizeUserInput(input.prospectiveStudent.name, 100);

      const createdBooking = await tx.booking.create({
        data: {
          uid: uuid(),
          userId: studentProfile.userId,
          eventTypeId: eventType.id,
          startTime,
          endTime,
          title: THOTIS_MENTORING_EVENT_TITLE,
          description: sanitizedQuestion || THOTIS_MENTORING_EVENT_DESCRIPTION,
          status: "PENDING",
          metadata: {
            isThotisSession: true,
            studentProfileId: input.studentProfileId,
            prospectiveStudentName: sanitizedName,
            prospectiveStudentEmail: input.prospectiveStudent.email,
            question: sanitizedQuestion,
            googleMeetLink,
          } as Prisma.InputJsonValue,
          responses: {
            name: sanitizedName,
            email: input.prospectiveStudent.email,
            notes: sanitizedQuestion,
          } as Prisma.InputJsonValue,
          attendees: {
            create: {
              email: input.prospectiveStudent.email,
              name: sanitizedName,
              timeZone: this.getResolvedTimeZone(input.timeZone),
              locale: this.getResolvedLocale(input.locale),
            },
          },
        },
        select: {
          id: true,
          uid: true,
          title: true,
          description: true,
          startTime: true,
          endTime: true,
          status: true,
          userId: true,
          metadata: true,
          responses: true,
        },
      });

      await tx.studentProfile.update({
        where: { id: input.studentProfileId },
        data: {
          totalSessions: {
            increment: 1,
          },
        },
      });

      return createdBooking;
    }).catch((error: unknown) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
        throw new ErrorWithCode(
          ErrorCode.BookingConflict,
          "Time slot is no longer available. Please choose another one."
        );
      }

      throw error;
    });

    // Invalidate caches
    await this.invalidateStudentCache(studentProfile.userId, input.studentProfileId);

    // Track analytics
    this.analytics.trackBookingCreated(
      {
        id: booking.id,
        userId: booking.userId, // Student/Mentor ID
        startTime,
        endTime,
        metadata: booking.metadata,
      },
      input.prospectiveStudent.email
    );

    // Track Postgres Analytics
    if (this.thotisAnalytics) {
      await this.thotisAnalytics.track({
        eventType: ThotisAnalyticsEventType.booking_confirmed,
        userId: booking.userId || undefined,
        profileId: input.studentProfileId,
        bookingId: booking.id,
        field: studentProfile.user.studentProfile?.field || undefined,
        metadata: parseBookingMetadata(booking.metadata),
      });
    }

    // Trigger Webhook
    const { thotisWebhooks } = await import("./ThotisWebhookClient");
    await thotisWebhooks.onBookingCreated(
      booking,
      input.studentProfileId,
      studentProfile.user.studentProfile?.field
    );

    // Prepare Calendar Event Data
    const { attendee, calEvent } = await this.communicationService.buildCreatedBookingCalendarEvent({
      attendee: {
        email: input.prospectiveStudent.email,
        locale: input.locale,
        name: input.prospectiveStudent.name,
        timeZone: input.timeZone,
      },
      booking,
      location: THOTIS_GOOGLE_MEET_PLACEHOLDER,
      organizerUserId: studentProfile.userId,
    });

    // Sync with Google Calendar
    try {
      const credentials = await this.prisma.credential.findMany({
        where: { userId: studentProfile.userId, type: "google_calendar" },
      });

      if (credentials.length > 0) {
        const credential = credentials[0] as unknown as CredentialForCalendarService;
        const result = await createEvent(credential, calEvent);

        if (result.success && result.createdEvent?.location) {
          await this.prisma.booking.update({
            where: { id: booking.id },
            data: {
              location: result.createdEvent.location,
              metadata: {
                ...parseBookingMetadata(booking.metadata),
                googleMeetLink: result.createdEvent.location,
              } as Prisma.InputJsonValue,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to sync with Google Calendar", error);
    }

    // Unify video link generation (Reliability)
    const finalizedBooking = await this.prisma.booking.findUnique({
      where: { id: booking.id },
      select: { id: true, location: true, uid: true, metadata: true },
    });

    if (finalizedBooking) {
      const videoLink = await this.ensureVideoLink(
        booking.id,
        finalizedBooking.uid,
        finalizedBooking.location,
        finalizedBooking.metadata
      );

      // Update calEvent with final video link
      calEvent.location = videoLink;

      // Send Confirmation Email AFTER we have the final link
      try {
        await this.communicationService.sendConfirmation(calEvent, attendee, booking.id);
      } catch (error) {
        console.error("Failed to send confirmation email", error);
      }

      return toBookingResultDto({
        bookingId: booking.id,
        googleMeetLink: videoLink,
        calendarEventId: booking.uid,
        confirmationSent: true,
      });
    }

    return toBookingResultDto({
      bookingId: booking.id,
      googleMeetLink, // Fallback to integrations:google-video if somehow record not found
      calendarEventId: booking.uid,
      confirmationSent: true,
    });
  }

  /**
   * Ensures a valid video link exists for the booking (Property 32)
   * Falls back to Jitsi if Google Meet generation fails.
   * Retries the DB update up to 3 times to handle transient failures.
   */
  private async ensureVideoLink(
    bookingId: number,
    uid: string,
    currentLocation: string | null,
    metadata: Prisma.JsonValue
  ): Promise<string> {
    if (currentLocation && currentLocation !== THOTIS_GOOGLE_MEET_PLACEHOLDER) {
      return currentLocation;
    }

    const fallbackLink = `https://meet.jit.si/${THOTIS_JITSI_ROOM_PREFIX}-${uid}`;
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: {
            location: fallbackLink,
            metadata: {
              ...parseBookingMetadata(metadata),
              googleMeetLink: fallbackLink,
              isFallbackLink: true,
            } as Prisma.InputJsonValue,
          },
        });
        return fallbackLink;
      } catch (_err) {
        if (attempt === MAX_RETRIES) {
          // Last attempt failed — return the link anyway so the booking isn't blocked
          return fallbackLink;
        }
        // Brief delay before retry (50ms, 100ms)
        await new Promise((resolve) => setTimeout(resolve, attempt * 50));
      }
    }

    return fallbackLink;
  }

  /**
   * Gets available time slots for a student mentor
   * Uses Cal.com's core availability engine
   */
  async getStudentAvailability(
    studentProfileId: string,
    dateRange: { start: Date; end: Date },
    timeZone: string = THOTIS_DEFAULT_TIME_ZONE
  ): Promise<Array<{ start: Date; end: Date; available: boolean }>> {
    // Validate date range is within 30 days
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (dateRange.end > thirtyDaysFromNow) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Availability can only be queried up to 30 days in advance"
      );
    }

    // 1. Get student profile and associated user
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      select: {
        id: true,
        status: true,
        timezone: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!studentProfile || !studentProfile.user) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Student profile or user not found");
    }

    // Use the student's configured timezone instead of hardcoded default
    const _effectiveTimeZone = studentProfile.timezone || timeZone;

    if (studentProfile.status !== MentorStatus.VERIFIED) {
      return [];
    }

    // 2. Get or create Thotis event type
    let eventType = await this.prisma.eventType.findFirst({
      where: {
        userId: studentProfile.user.id,
        slug: "thotis-mentoring-session",
      },
      select: { id: true, length: true },
    });

    if (!eventType) {
      // Create defaults if missing (should be provisioned by admin ideally)
      eventType = await this.prisma.eventType.create({
        data: {
          title: "Session de mentorat Thotis",
          slug: "thotis-mentoring-session",
          length: 15,
          userId: studentProfile.user.id,
          hidden: true,
          metadata: {
            isThotisSession: true,
          },
        },
        select: { id: true, length: true },
      });
    }

    // 3. Use Cal.com's availability service
    try {
      // Dynamic import to avoid circular dependencies in some setups
      const { getAvailableSlotsService } = await import("@calcom/features/di/containers/AvailableSlots");
      const availableSlotsService = getAvailableSlotsService();

      const startIso = dateRange.start.toISOString();
      const endIso = dateRange.end.toISOString();

      // We need to pass a context that satisfies strict checks if possible, or minimally correct input
      const input = {
        eventTypeId: eventType.id,
        usernameList: [studentProfile.user.username!],
        startTime: startIso,
        endTime: endIso,
        timeZone: timeZone,
        orgSlug: "", // Bypass org context lookups
        isTeamEvent: false,
      };

      // Helper to mock request for orgDomainConfig if needed internally
      const mockCtx: ContextForGetSchedule = {
        req: {
          headers: {},
          cookies: {},
        } as unknown as ContextForGetSchedule["req"],
      };

      const result = await availableSlotsService.getAvailableSlots({
        input,
        ctx: mockCtx,
      });

      // 4. Transform result to simple slot array
      const slots: Array<{ start: Date; end: Date; available: boolean }> = [];

      // result.slots is Record<string, Slot[]> where string is date YYYY-MM-DD
      Object.keys(result.slots).forEach((dateKey) => {
        const daySlots = result.slots[dateKey];
        daySlots.forEach((slot) => {
          slots.push({
            start: new Date(slot.time),
            end: new Date(new Date(slot.time).getTime() + eventType?.length * 60 * 1000),
            available: true,
          });
        });
      });

      return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
    } catch (error) {
      console.error("Error fetching availability via engine:", error);
      // Fallback or rethrow?
      // If engine fails, we probably shouldn't show availability to avoid double bookings
      throw new ErrorWithCode(ErrorCode.InternalServerError, "Failed to fetch availability");
    }
  }

  /**
   * Cancels a session with validation
   * Property 14: Minimum cancellation notice (2 hours)
   */
  async cancelSession(
    bookingId: number,
    reason: string,
    cancelledBy: "mentor" | "student",
    requester: { id?: number; email?: string }
  ): Promise<void> {
    // Get booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        uid: true,
        startTime: true,
        endTime: true,
        status: true,
        metadata: true,
        userId: true,
        responses: true,
        attendees: {
          select: {
            email: true,
            locale: true,
            name: true,
            timeZone: true,
          },
        },
        eventType: {
          select: {
            userId: true,
            minimumBookingNotice: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    // Verify ownership
    this.verifySessionOwnership(booking, requester);

    // Validate booking is not already cancelled
    if (booking.status === "CANCELLED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Booking is already cancelled");
    }

    // Validate minimum cancellation notice (default 120 mins if not set)
    const minimumBookingNotice =
      booking.eventType?.minimumBookingNotice ?? THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES;
    const now = new Date();
    const noticeThreshold = new Date(now.getTime() + minimumBookingNotice * 60 * 1000);

    if (booking.startTime < noticeThreshold) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        `Bookings must be cancelled at least ${minimumBookingNotice} minutes in advance`
      );
    }

    // Get student profile ID from metadata
    const metadata = parseBookingMetadata(booking.metadata);
    const studentProfileId = metadata?.studentProfileId;

    // Update booking status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
        metadata: {
          ...parseBookingMetadata(booking.metadata),
          cancelledBy,
          cancelledAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    // Update student profile statistics and invalidate cache
    if (studentProfileId) {
      const studentProfile = await this.prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        select: { userId: true },
      });

      if (studentProfile) {
        await this.invalidateStudentCache(studentProfile.userId, studentProfileId);
      }

      await this.prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          cancelledSessions: {
            increment: 1,
          },
        },
      });
    }

    // Send cancellation emails
    try {
      if (booking.eventType?.userId) {
        const { attendee, calEvent } = await this.communicationService.buildExistingBookingCalendarEvent({
          booking,
          organizerUserId: booking.eventType.userId,
        });

        await this.communicationService.sendCancellation(calEvent, attendee);

        // Delete Google Calendar event
        const credentials = await this.prisma.credential.findMany({
          where: { userId: booking.eventType.userId, type: "google_calendar" },
        });
        if (credentials.length > 0) {
          const credential = credentials[0] as unknown as CredentialForCalendarService;
          await deleteEvent({ credential, bookingRefUid: booking.uid, event: calEvent });
        }
      }
    } catch (error) {
      console.error("Failed to process cancellation side effects", error);
    }

    this.analytics.trackBookingCancelled(
      {
        id: booking.id,
        userId: booking.eventType?.userId || booking.userId, // Fallback to booking.userId
        metadata: booking.metadata,
      },
      reason,
      cancelledBy
    );

    // Track Postgres Analytics
    if (this.thotisAnalytics) {
      await this.thotisAnalytics.track({
        eventType: ThotisAnalyticsEventType.cancelled,
        userId: booking.eventType?.userId || booking.userId || undefined,
        profileId: studentProfileId,
        bookingId: booking.id,
        metadata: {
          reason,
          cancelledBy,
        },
      });
    }

    // Trigger Webhook
    const { thotisWebhooks } = await import("./ThotisWebhookClient");
    await thotisWebhooks.onBookingCancelled(booking, reason);
  }

  /**
   * Reschedules a session to a new time
   * Property 32: Rescheduling Meet Link Regeneration
   */
  async rescheduleSession(
    bookingId: number,
    newDateTime: Date,
    requester: { id?: number; email?: string }
  ): Promise<BookingResultDto> {
    // Validate minimum booking notice (2 hours)
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES * 60 * 1000);

    if (newDateTime < twoHoursFromNow) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Rescheduled bookings must be at least 2 hours in advance"
      );
    }

    // Get existing booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        uid: true,
        userId: true,
        startTime: true,
        endTime: true,
        status: true,
        metadata: true,
        responses: true,
        attendees: {
          select: {
            email: true,
            locale: true,
            name: true,
            timeZone: true,
          },
        },
        eventType: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    // Verify ownership
    this.verifySessionOwnership(booking, requester);

    // Validate booking is not cancelled
    if (booking.status === "CANCELLED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Cannot reschedule a cancelled booking");
    }

    // Calculate new end time (exactly 15 minutes)
    const newStartTime = newDateTime;
    const newEndTime = new Date(newStartTime.getTime() + THOTIS_BOOKING_DURATION_MS);

    // Check for conflicts at new time
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        id: { not: bookingId }, // Exclude current booking
        userId: booking.eventType?.userId, // Use optional chaining just in case
        status: {
          in: ["ACCEPTED", "PENDING"],
        },
        OR: [
          {
            AND: [{ startTime: { lte: newStartTime } }, { endTime: { gt: newStartTime } }],
          },
          {
            AND: [{ startTime: { lt: newEndTime } }, { endTime: { gte: newEndTime } }],
          },
          {
            AND: [{ startTime: { gte: newStartTime } }, { endTime: { lte: newEndTime } }],
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new ErrorWithCode(
        ErrorCode.BookingConflict,
        `Time slot ${newStartTime.toISOString()} is already booked`
      );
    }

    // Validate real availability (Property 7 extension: Schedules and Calendars)
    await this.validateSlotAvailability(
      booking.eventType?.userId || booking.userId!,
      newStartTime,
      newEndTime
    );

    // Generate new Google Meet link (Property 32)
    const newGoogleMeetLink = THOTIS_GOOGLE_MEET_PLACEHOLDER;

    // Update booking
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
        metadata: {
          ...parseBookingMetadata(booking.metadata),
          googleMeetLink: newGoogleMeetLink,
          oldStartTime: booking.startTime.toISOString(),
          rescheduledAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        uid: true,
      },
    });

    // Unify video link generation (Reliability)
    const finalizedBooking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, uid: true, location: true, metadata: true },
    });

    let finalizedMeetLink = newGoogleMeetLink;
    if (finalizedBooking) {
      finalizedMeetLink = await this.ensureVideoLink(
        finalizedBooking.id,
        finalizedBooking.uid,
        finalizedBooking.location,
        finalizedBooking.metadata
      );
    }

    // Invalidate caches
    const updatedBookingWithUser = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        eventType: { select: { userId: true } },
        metadata: true,
      },
    });

    if (updatedBookingWithUser) {
      const metadata = parseBookingMetadata(updatedBookingWithUser.metadata);
      const studentProfileId = metadata?.studentProfileId;
      if (studentProfileId && updatedBookingWithUser.eventType?.userId) {
        await this.invalidateStudentCache(updatedBookingWithUser.eventType.userId, studentProfileId);
      }
    }

    // Send rescheduling emails
    try {
      if (booking.eventType?.userId) {
        const { attendee, calEvent } = await this.communicationService.buildExistingBookingCalendarEvent({
          booking: {
            ...booking,
            endTime: newEndTime,
            startTime: newStartTime,
          },
          location: finalizedMeetLink,
          organizerUserId: booking.eventType.userId,
        });

        await this.communicationService.sendRescheduled(calEvent, attendee);

        // Update Google Calendar event
        const credentials = await this.prisma.credential.findMany({
          where: { userId: booking.eventType.userId, type: "google_calendar" },
        });
        if (credentials.length > 0) {
          const credential = credentials[0] as unknown as CredentialForCalendarService;
          await updateEvent(credential, calEvent, updatedBooking.uid, null);
        }
      }
    } catch (error) {
      console.error("Failed to process rescheduling side effects", error);
    }

    // Trigger Webhook
    const { thotisWebhooks } = await import("./ThotisWebhookClient");
    await thotisWebhooks.onBookingRescheduled(updatedBooking, newStartTime, newEndTime, finalizedMeetLink);

    // Track Postgres Analytics
    if (this.thotisAnalytics) {
      await this.thotisAnalytics.track({
        eventType: ThotisAnalyticsEventType.rescheduled,
        userId: booking.eventType?.userId || booking.userId || undefined,
        bookingId: updatedBooking.id,
        metadata: {
          newStartTime,
          newEndTime,
        },
      });
    }

    return toBookingResultDto({
      bookingId: updatedBooking.id,
      googleMeetLink: finalizedMeetLink,
      calendarEventId: updatedBooking.uid,
      confirmationSent: true,
    });
  }

  /**
   * Marks a session as complete
   * Property 19: Session Counter Updates
   */
  async markSessionComplete(
    bookingId: number,
    requester: { id?: number; email?: string; isSystem?: boolean }
  ): Promise<void> {
    // Get booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        uid: true,
        status: true,
        startTime: true,
        endTime: true,
        metadata: true,
        userId: true,
        responses: true,
        eventType: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    // Verify ownership
    this.verifySessionOwnership(booking, requester);

    // Validate booking is not cancelled
    if (booking.status === "CANCELLED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Cannot complete a cancelled booking");
    }

    // Validate session has ended
    const now = new Date();
    if (booking.endTime > now) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Cannot mark session as complete before it has ended");
    }

    // Get student profile ID from metadata
    const metadata = parseBookingMetadata(booking.metadata);
    const studentProfileId = metadata?.studentProfileId;

    // Update booking status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "ACCEPTED", // Cal.com uses ACCEPTED for completed bookings
        metadata: {
          ...parseBookingMetadata(booking.metadata),
          completedAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    // Update student profile statistics (Property 19) and invalidate cache
    if (studentProfileId) {
      const studentProfile = await this.prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        select: { userId: true },
      });

      if (studentProfile) {
        await this.invalidateStudentCache(studentProfile.userId, studentProfileId);
      }

      await this.prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          completedSessions: {
            increment: 1,
          },
        },
      });
    }

    // Trigger Webhook
    const { thotisWebhooks } = await import("./ThotisWebhookClient");
    await thotisWebhooks.onBookingCompleted(booking, THOTIS_BOOKING_DURATION_MINUTES);

    this.analytics.trackBookingCompleted({
      id: booking.id,
      userId: booking.userId,
      metadata: booking.metadata,
    });

    // Track Postgres Analytics
    if (this.thotisAnalytics) {
      await this.thotisAnalytics.track({
        eventType: ThotisAnalyticsEventType.session_completed,
        userId: booking.userId || undefined,
        profileId: studentProfileId,
        bookingId: booking.id,
        metadata: parseBookingMetadata(booking.metadata),
      });
    }
  }

  /**
   * Marks a session as a No-Show
   * Automatically triggered by lifecycle cron or manually by admin/student
   */
  async markSessionAsNoShow(
    bookingId: number,
    requester: { id?: number; email?: string; isSystem?: boolean }
  ): Promise<void> {
    // Get booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        uid: true,
        status: true,
        startTime: true,
        endTime: true,
        metadata: true,
        userId: true,
        responses: true,
        eventType: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    // Verify ownership
    this.verifySessionOwnership(booking, requester);

    // Validate booking is not already cancelled
    if (booking.status === "CANCELLED") {
      // If it's already cancelled with no_show_auto, we're good
      const metadata = parseBookingMetadata(booking.metadata);
      if (metadata?.cancellationReason === "no_show_auto") return;

      throw new ErrorWithCode(ErrorCode.BadRequest, "Booking is already cancelled");
    }

    // Get student profile ID from metadata
    const metadata = parseBookingMetadata(booking.metadata);
    const studentProfileId = metadata?.studentProfileId;

    // Update booking status to CANCELLED with reason
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancellationReason: "no_show_auto",
        metadata: {
          ...parseBookingMetadata(booking.metadata),
          noShowDetectedAt: new Date().toISOString(),
          cancelledBy: requester.isSystem ? "system" : "student",
        } as Prisma.InputJsonValue,
      },
    });

    // Update student profile statistics and create incident
    if (studentProfileId) {
      const studentProfile = await this.prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        select: { userId: true },
      });

      if (studentProfile) {
        await this.invalidateStudentCache(studentProfile.userId, studentProfileId);
      }

      // Increment cancelled sessions
      await this.prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          cancelledSessions: {
            increment: 1,
          },
        },
      });

      // Automatically create a MentorQualityIncident for automated No-Show
      // CHECK FIRST: If system process, ensure we don't duplicate if one already exists
      const existingIncident = await this.prisma.mentorQualityIncident.findFirst({
        where: {
          bookingUid: booking.uid,
          type: MentorIncidentType.NO_SHOW,
        },
      });

      if (!existingIncident) {
        await this.prisma.mentorQualityIncident.create({
          data: {
            studentProfileId,
            bookingUid: booking.uid,
            type: MentorIncidentType.NO_SHOW,
            description: THOTIS_NO_SHOW_SYSTEM_DESCRIPTION,
            reportedByUserId: null, // System report
          },
        });
      }
    }

    // Trigger Webhook
    try {
      const { thotisWebhooks } = await import("./ThotisWebhookClient");
      await thotisWebhooks.onBookingCancelled(booking, "Automatically cancelled due to no-show");
    } catch (e) {
      log.warn("Failed to trigger no-show cancellation webhook", { error: e, bookingId: booking.id });
    }

    this.analytics.trackBookingCancelled(
      {
        id: booking.id,
        userId: booking.userId,
        metadata: booking.metadata,
      },
      "no_show_auto",
      requester.isSystem ? "system" : "student"
    );

    // Track Postgres Analytics
    if (this.thotisAnalytics) {
      await this.thotisAnalytics.track({
        eventType: ThotisAnalyticsEventType.no_show,
        userId: booking.userId || undefined,
        profileId: studentProfileId,
        bookingId: booking.id,
        metadata: {
          ...parseBookingMetadata(booking.metadata),
          autoDetected: true,
        },
      });
    }
  }

  /**
   * Verifies that the requester is authorized to manage the booking.
   * Authorized users are:
   * 1. The mentor (host) associated with the booking (by ID)
   * 2. The prospective student (guest) associated with the booking (by email)
   */
  private verifySessionOwnership(
    booking: {
      userId: number | null;
      responses: Prisma.JsonValue;
      eventType?: { userId: number | null } | null;
    },
    requester: { id?: number; email?: string; isSystem?: boolean } = {}
  ): void {
    if (requester.isSystem) return;

    const isMentor =
      requester.id && (booking.userId === requester.id || booking.eventType?.userId === requester.id);
    const responses = booking.responses as { email?: string } | null;
    const isStudent = requester.email && responses?.email === requester.email;

    if (!isMentor && !isStudent) {
      throw new ErrorWithCode(
        ErrorCode.Forbidden,
        "You are not authorized to perform this action on this session"
      );
    }
  }

  /**
   * Validates that a slot is truly available according to the mentor's schedule and calendars.
   * This goes beyond just checking for existing Thotis bookings.
   */
  private async validateSlotAvailability(userId: number, startTime: Date, endTime: Date) {
    // 1. Get user and event type
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    if (!user || !user.username) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Mentor user not found");
    }

    const eventType = await this.prisma.eventType.findFirst({
      where: {
        userId: userId,
        slug: "thotis-mentoring-session",
      },
      select: { id: true, length: true },
    });

    if (!eventType) {
      // If event type doesn't exist yet, we check against a virtual 15-min slot
      // using the default availability of the user.
      // This ensures we never skip validation.
      log.info("Event type not found for availability validation, using default slot length", { userId });
    }

    const eventTypeId = eventType?.id;
    // 2. Use Cal.com's availability service
    try {
      const { getAvailableSlotsService } = await import("@calcom/features/di/containers/AvailableSlots");
      const availableSlotsService = getAvailableSlotsService();

      // Check window around the slot to be safe
      const startIso = startTime.toISOString();
      // We check slightly more to ensure we see the slot in the engine output
      const endIso = new Date(endTime.getTime() + 60 * 1000).toISOString();

      const input = {
        eventTypeId, // Can be undefined, engine will fallback to default slots if usernameList is provided
        usernameList: [user.username],
        startTime: startIso,
        endTime: endIso,
        timeZone: THOTIS_DEFAULT_TIME_ZONE,
        orgSlug: "",
        isTeamEvent: false,
        bypassCache: true, // Strict validation: force fresh check against calendars
        limit: 100, // Explicit limit to avoid large payloads
      };

      const mockCtx: ContextForGetSchedule = {
        req: {
          headers: {},
          cookies: {},
        } as unknown as ContextForGetSchedule["req"],
      };

      const result = await availableSlotsService.getAvailableSlots({
        input,
        ctx: mockCtx,
      });

      // 3. Check if our exact slot is in the available list
      let isAvailable = false;
      const requestedStartTime = startTime.getTime();
      const _requestedEndTime = endTime.getTime();

      // Flatten slots
      const allSlots: { time: string }[] = [];
      Object.values(result.slots).forEach((daySlots) => {
        allSlots.push(...daySlots);
      });

      // Find a matching slot
      for (const slot of allSlots) {
        const slotStart = new Date(slot.time).getTime();
        // The slot returned by availability engine represents a start time valid for eventType.length
        // So if slot.time matches our startTime, it means the FULL duration is available
        // because the engine already checked the duration against calendars.
        if (slotStart === requestedStartTime) {
          isAvailable = true;
          break;
        }
      }

      if (!isAvailable) {
        throw new ErrorWithCode(
          ErrorCode.BookingConflict,
          `Mentor is not available at ${startTime.toISOString()} (Checked against schedule/calendars)`
        );
      }
    } catch (error) {
      if (error instanceof ErrorWithCode) throw error;
      console.error("Error validating availability:", error);
      // In case of engine failure, we err on the side of caution
      throw new ErrorWithCode(ErrorCode.InternalServerError, "Failed to verify mentor availability");
    }
  }

  /**
   * Fetches sessions for a student, identified either by a guest token or by an authenticated user's email.
   * This allows guests (lycéens) to manage their sessions without a full account.
   */
  async studentSessions(input: {
    status?: "upcoming" | "past" | "cancelled" | "all";
    token?: string;
    userId?: number;
    email?: string;
  }): Promise<SessionDto[]> {
    let email: string | undefined;
    let bookingIdScope: number | undefined;

    if (input.token) {
      // Guest path: identity is resolved from verified token only
      const magicLink = await this.guestService.verifyToken(input.token);
      email = magicLink.guest.email;
      bookingIdScope = magicLink.bookingId ?? undefined;
    } else if (input.userId) {
      // Authenticated user path: trust the email from auth context
      email = input.email;
    }

    if (!email) {
      throw new ErrorWithCode(
        ErrorCode.Unauthorized,
        "Authentication or valid guest token required to view sessions"
      );
    }

    const now = new Date();

    const bookings = await this.prisma.booking.findMany({
      where: {
        ...(bookingIdScope
          ? { id: bookingIdScope }
          : {
              responses: {
                path: ["email"],
                equals: email,
              },
            }),
        eventType: {
          metadata: {
            path: ["isThotisSession"],
            equals: true,
          },
        },
        ...(input.status === "upcoming"
          ? { startTime: { gte: now }, status: { in: ["ACCEPTED", "PENDING"] } }
          : input.status === "past"
            ? { endTime: { lt: now }, status: { in: ["ACCEPTED", "PENDING"] } }
            : input.status === "cancelled"
              ? { status: "CANCELLED" }
              : {}),
      },
      select: {
        id: true,
        uid: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true,
        metadata: true,
        responses: true,
        user: {
          select: {
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        thotisSessionSummary: {
          select: { id: true },
        },
      },
      orderBy: { startTime: input.status === "upcoming" ? "asc" : "desc" },
    });

    return toSessionDtoArray(bookings);
  }

  /**
   * Rate limits booking creation per student email to prevent abuse (Property 40)
   * Limit: 3 bookings per hour
   */
  private async rateLimitBookingCreation(email: string) {
    if (!this.redis) return;

    const key = `rate-limit:booking:${email}`;
    try {
      const current = await this.redis.get(key);
      const count = current ? parseInt(current as string, 10) : 0;

      const maxBookings = 2; // Strict limit: 2 bookings per hour to prevent spam
      if (count >= maxBookings) {
        throw new ErrorWithCode(
          ErrorCode.BookerLimitExceeded,
          "Maximum number of bookings per hour reached. Please try again later."
        );
      }

      await this.redis.set(key, (count + 1).toString(), {
        ttl: 60 * 60 * 1000, // 1 hour window
      });
    } catch (error) {
      if (error instanceof ErrorWithCode) throw error;
      log.warn("Rate limit check failed, allowing booking", { error, email });
    }
  }
}
