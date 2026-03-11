import process from "node:process";
import dayjs from "@calcom/dayjs";
import { sendPasswordResetEmail } from "@calcom/emails/auth-email-service";
import { PASSWORD_RESET_EXPIRY_HOURS } from "@calcom/features/auth/lib/passwordResetRequest";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import { getTranslation } from "@calcom/lib/server/i18n";
import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import {
  type AcademicField,
  type BookingStatus,
  type MentorIncidentType,
  type MentorModerationActionType,
  MentorStatus,
} from "@calcom/prisma/enums";
import { MentorQualityRepository } from "../repositories/MentorQualityRepository";
import { ProfileRepository } from "../repositories/ProfileRepository";
import { ProfileService } from "./ProfileService";

export interface ProvisionAmbassadorInput {
  name: string;
  email: string;
  fieldOfStudy: AcademicField;
  university: string;
  degree: string;
  yearOfStudy: number;
  bio: string;
}

export class ThotisAdminService {
  private profileRepository: ProfileRepository;
  private mentorQualityRepository: MentorQualityRepository;
  private profileService: ProfileService;

  constructor(
    profileService?: ProfileService,
    profileRepository?: ProfileRepository,
    mentorQualityRepository?: MentorQualityRepository
  ) {
    this.profileRepository = profileRepository || new ProfileRepository();
    this.profileService = profileService || new ProfileService(this.profileRepository);
    this.mentorQualityRepository = mentorQualityRepository || new MentorQualityRepository();
  }

  /**
   * Generate a unique username from an email, appending a suffix if needed.
   */
  private async generateUniqueUsername(email: string): Promise<string> {
    const base = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Try the base username first
    const existing = await prisma.user.findFirst({
      where: { username: base, organizationId: null },
      select: { id: true },
    });

    if (!existing) return base;

    // Append random suffix to avoid collision
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${base}-${suffix}`;
  }

  /**
   * Provision a new ambassador account and profile.
   * If user doesn't exist, creates one. Then creates the student profile.
   * Idempotent: if profile already exists, returns it.
   */
  async provisionAmbassador(input: ProvisionAmbassadorInput) {
    // 1. Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true, name: true, locale: true, timeZone: true },
    });

    if (!user) {
      const username = await this.generateUniqueUsername(input.email);
      user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          username,
          emailVerified: new Date(),
          completedOnboarding: true,
          locale: "fr",
          timeZone: "Europe/Paris",
        },
        select: { id: true, email: true, name: true, locale: true, timeZone: true },
      });
    }

    // 2. Check if profile already exists (idempotency for retries)
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    let profile;
    if (existingProfile) {
      // Profile exists (e.g., from a previous attempt where email failed) — update it
      profile = await this.profileRepository.updateProfile(existingProfile.id, {
        field: input.fieldOfStudy,
        currentYear: input.yearOfStudy,
        bio: input.bio,
        university: input.university,
        degree: input.degree,
        status: MentorStatus.VERIFIED,
        isActive: true,
      });
    } else {
      profile = await this.profileService.createProfile({
        userId: user.id,
        fieldOfStudy: input.fieldOfStudy,
        yearOfStudy: input.yearOfStudy,
        bio: input.bio,
        university: input.university,
        degree: input.degree,
      });
    }

    // 3. Ensure user has a default schedule (Mon-Fri, 9:00-17:00)
    const userWithSchedule = await prisma.user.findUnique({
      where: { id: user.id },
      select: { defaultScheduleId: true },
    });

    if (!userWithSchedule?.defaultScheduleId) {
      const defaultSchedule = await prisma.schedule.create({
        data: {
          userId: user.id,
          name: "Default Schedule",
          timeZone: user.timeZone || "Europe/Paris",
          availability: {
            createMany: {
              data: [
                {
                  days: [1, 2, 3, 4, 5],
                  startTime: new Date("1970-01-01T09:00:00Z"),
                  endTime: new Date("1970-01-01T17:00:00Z"),
                },
              ],
            },
          },
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { defaultScheduleId: defaultSchedule.id },
      });
    }

    // 4. Send password reset email (non-blocking: don't fail provisioning if email fails)
    try {
      await this.sendInitialPasswordSetup(user.id);
    } catch (emailError) {
      console.warn(`[ThotisAdmin] Failed to send password setup email for user ${user.id}:`, emailError);
      // Don't throw — the account is provisioned, admin can resend later
    }

    return profile;
  }

  /**
   * Send a password reset email for initial setup or admin-triggered reset.
   */
  async sendInitialPasswordSetup(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, locale: true },
    });

    if (!user) throw new ErrorWithCode(ErrorCode.NotFound, "User not found");

    const t = await getTranslation(user.locale ?? "en", "common");
    const expiry = dayjs().add(PASSWORD_RESET_EXPIRY_HOURS, "hours").toDate();

    const passwordResetToken = await prisma.resetPasswordRequest.create({
      data: {
        email: user.email,
        expires: expiry,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/auth/forgot-password/${passwordResetToken.id}`;

    await sendPasswordResetEmail({
      language: t,
      user: {
        name: user.name,
        email: user.email,
      },
      resetLink,
    });

    return { success: true };
  }

  /**
   * List all ambassadors with pagination and filters
   */
  async listAllAmbassadors(filters: {
    page?: number;
    pageSize?: number;
    fieldOfStudy?: AcademicField;
    isActive?: boolean;
    search?: string;
  }) {
    // We can reuse searchProfiles but we might want to include INACTIVE ones here by default if admin
    // So we'll add a specific method to ProfileRepository or use prisma directly here if needed.
    // Let's use prisma for more flexibility in Admin listing.
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.StudentProfileWhereInput = {};
    if (filters.fieldOfStudy) where.field = filters.fieldOfStudy;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.search) {
      where.OR = [
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
        { university: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [profiles, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        select: {
          id: true,
          userId: true,
          field: true,
          university: true,
          degree: true,
          currentYear: true,
          bio: true,
          expertise: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          user: {
            select: {
              name: true,
              email: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    return {
      profiles,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Set ambassador status
   */
  async setAmbassadorStatus(profileId: string, status: MentorStatus) {
    return await this.profileRepository.updateProfile(profileId, {
      status,
      isActive: status === MentorStatus.VERIFIED,
    });
  }

  /**
   * List quality incidents
   */
  async listIncidents(filters: {
    page?: number;
    pageSize?: number;
    studentProfileId?: string;
    type?: MentorIncidentType;
    resolved?: boolean;
  }) {
    return await this.mentorQualityRepository.listIncidents(filters);
  }

  /**
   * Resolve an incident
   */
  async resolveIncident(incidentId: string) {
    return await this.mentorQualityRepository.updateIncident(incidentId, {
      resolved: true,
      resolvedAt: new Date(),
    });
  }

  /**
   * Take a moderation action
   */
  async takeModerationAction(input: {
    studentProfileId: string;
    actionByUserId: number;
    actionType: MentorModerationActionType;
    reason?: string;
    updateStatusTo?: MentorStatus;
  }) {
    const action = await this.mentorQualityRepository.createModerationAction({
      studentProfileId: input.studentProfileId,
      actionByUserId: input.actionByUserId,
      actionType: input.actionType,
      reason: input.reason,
    });

    if (input.updateStatusTo) {
      await this.setAmbassadorStatus(input.studentProfileId, input.updateStatusTo);
    }

    return action;
  }

  /**
   * List all Thotis bookings with pagination and filters
   */
  async listBookings(filters: {
    page?: number;
    pageSize?: number;
    mentorUserId?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.BookingWhereInput = {
      eventType: {
        metadata: {
          path: ["isThotisSession"],
          equals: true,
        },
      },
    };

    if (filters.mentorUserId) {
      where.userId = filters.mentorUserId;
    }
    if (filters.status) {
      where.status = filters.status as BookingStatus;
    }
    if (filters.dateFrom || filters.dateTo) {
      where.startTime = {};
      if (filters.dateFrom) (where.startTime as Record<string, Date>).gte = filters.dateFrom;
      if (filters.dateTo) (where.startTime as Record<string, Date>).lte = filters.dateTo;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        select: {
          id: true,
          uid: true,
          title: true,
          startTime: true,
          endTime: true,
          status: true,
          metadata: true,
          responses: true,
          cancellationReason: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          attendees: {
            select: {
              name: true,
              email: true,
            },
          },
          sessionRating: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: { startTime: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total, page, pageSize };
  }

  /**
   * Get detailed booking information for admin view
   */
  async getBookingDetails(bookingId: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        uid: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true,
        metadata: true,
        responses: true,
        cancellationReason: true,
        location: true,
        userId: true,
        user: {
          select: { id: true, name: true, email: true, username: true },
        },
        attendees: {
          select: { id: true, name: true, email: true },
        },
        sessionRating: {
          select: { id: true, rating: true, feedback: true, createdAt: true },
        },
        thotisSessionSummary: {
          select: { id: true, content: true, nextSteps: true, createdAt: true },
        },
        mentorQualityIncidents: {
          select: {
            id: true,
            type: true,
            description: true,
            resolved: true,
            createdAt: true,
            studentProfileId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    return booking;
  }

  /**
   * Admin-initiated booking cancellation with audit trail
   */
  async adminCancelBooking(bookingId: number, reason: string, adminUserId: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        metadata: true,
        userId: true,
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    if (booking.status === "CANCELLED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Booking is already cancelled");
    }

    const metadata = (booking.metadata as Record<string, unknown>) || {};
    const studentProfileId = (metadata.studentProfileId as string) || undefined;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
        metadata: {
          ...metadata,
          cancelledBy: "admin",
          cancelledByAdminId: adminUserId,
          cancelledAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    if (studentProfileId) {
      await prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: { cancelledSessions: { increment: 1 } },
      });
    }

    return { success: true };
  }

  /**
   * Update a mentor profile (admin override)
   */
  async updateMentorProfile(
    profileId: string,
    data: {
      bio?: string;
      university?: string;
      degree?: string;
      field?: AcademicField;
      expertise?: string[];
      currentYear?: number;
    }
  ) {
    const profile = await this.profileRepository.getProfile(profileId);
    if (!profile) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Profile ${profileId} not found`);
    }

    return this.profileRepository.updateProfile(profileId, data);
  }

  /**
   * Get a mentor's schedule and availability configuration
   */
  async getMentorSchedule(mentorUserId: number) {
    const user = await prisma.user.findUnique({
      where: { id: mentorUserId },
      select: { defaultScheduleId: true, timeZone: true },
    });

    if (!user) {
      throw new ErrorWithCode(ErrorCode.NotFound, `User ${mentorUserId} not found`);
    }

    if (!user.defaultScheduleId) {
      return {
        id: null,
        name: "No Schedule",
        timeZone: user.timeZone || "Europe/Paris",
        availability: [] as Array<{
          id: number;
          days: number[];
          startTime: Date;
          endTime: Date;
          date: Date | null;
        }>,
        hasSchedule: false,
      };
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: user.defaultScheduleId },
      select: {
        id: true,
        name: true,
        timeZone: true,
        availability: {
          select: {
            id: true,
            days: true,
            startTime: true,
            endTime: true,
            date: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Schedule not found");
    }

    return { ...schedule, hasSchedule: true };
  }

  /**
   * Update a mentor's schedule availability (admin override)
   */
  async updateMentorSchedule(
    mentorUserId: number,
    scheduleData: {
      timeZone?: string;
      availability: Array<{
        days: number[];
        startTime: string;
        endTime: string;
      }>;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: mentorUserId },
      select: { defaultScheduleId: true },
    });

    if (!user) {
      throw new ErrorWithCode(ErrorCode.NotFound, `User ${mentorUserId} not found`);
    }

    if (!user.defaultScheduleId) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "User has no default schedule");
    }

    const scheduleId = user.defaultScheduleId;

    await prisma.$transaction([
      prisma.availability.deleteMany({
        where: { scheduleId },
      }),
      prisma.availability.createMany({
        data: scheduleData.availability.map((slot) => ({
          scheduleId,
          days: slot.days,
          startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00Z`),
        })),
      }),
    ]);

    if (scheduleData.timeZone) {
      await prisma.schedule.update({
        where: { id: scheduleId },
        data: { timeZone: scheduleData.timeZone },
      });
    }

    return { success: true };
  }
}
