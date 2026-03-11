import type { PostSessionDataDto, SessionRatingDto } from "@calcom/lib/dto/thotis/ThotisApiSchemas";
import {
  parseThotisMetadata,
  toPaginatedSessionsDto,
  toPostSessionDataDto,
  toSuccessResponseDto,
} from "@calcom/lib/dto/thotis/ThotisDtoMappers";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import { sanitizeUserInput } from "@calcom/lib/sanitizeUserInput";
import type { Prisma, PrismaClient } from "@calcom/prisma/client";
import { MentorIncidentType, ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import type { SessionRatingService } from "./SessionRatingService";
import type { StatisticsService } from "./StatisticsService";
import type { ThotisAnalyticsService } from "./ThotisAnalyticsService";

type BookingViewer = {
  userId?: number;
  email?: string;
};

type RatingValidationBooking = {
  id: number;
  status: string;
  startTime: Date;
  endTime: Date;
  metadata: Prisma.JsonValue;
  responses: Prisma.JsonValue;
  userId: number | null;
};

export class ThotisSessionOperationsService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly statisticsService: StatisticsService,
    private readonly ratingService: SessionRatingService,
    private readonly analyticsService: ThotisAnalyticsService
  ) {}

  private getResponsesEmail(responses: Prisma.JsonValue): string | null {
    if (!responses || typeof responses !== "object" || Array.isArray(responses)) {
      return null;
    }

    const parsed = parseThotisMetadata(responses);
    const email = parsed.email;
    return typeof email === "string" ? email : null;
  }

  private getStudentProfileId(metadata: Prisma.JsonValue): string | null {
    const parsed = parseThotisMetadata(metadata);
    const studentProfileId = parsed.studentProfileId;
    return typeof studentProfileId === "string" ? studentProfileId : null;
  }

  private hasCompletionMarker(metadata: Prisma.JsonValue): boolean {
    const parsed = parseThotisMetadata(metadata);
    return typeof parsed.completedAt === "string";
  }

  private assertBookingViewerAccess(
    booking: { userId: number | null; responses: Prisma.JsonValue },
    viewer: BookingViewer,
    errorMessage: string = "Not authorized to access this session"
  ) {
    const isMentor = !!viewer.userId && booking.userId === viewer.userId;
    const isStudent = !!viewer.email && this.getResponsesEmail(booking.responses) === viewer.email;

    if (!isMentor && !isStudent) {
      throw new ErrorWithCode(ErrorCode.Forbidden, errorMessage);
    }
  }

  private async getBookingForRating(bookingId: number): Promise<RatingValidationBooking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        startTime: true,
        endTime: true,
        metadata: true,
        responses: true,
        userId: true,
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Booking not found");
    }

    return booking;
  }

  async submitRating(input: {
    bookingId: number;
    rating: number;
    feedback?: string;
    email: string;
    requireCompletedAt?: boolean;
    guestId?: string;
  }): Promise<SessionRatingDto> {
    const booking = await this.getBookingForRating(input.bookingId);

    if (this.getResponsesEmail(booking.responses) !== input.email) {
      throw new ErrorWithCode(ErrorCode.Forbidden, "Email does not match booking");
    }

    const now = new Date();
    if (booking.endTime > now) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Cannot rate a session that hasn't ended yet");
    }

    if (booking.status !== "ACCEPTED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Only completed sessions can be rated");
    }

    const existingRating = await this.prisma.sessionRating.findUnique({
      where: { bookingId: input.bookingId },
      select: { id: true },
    });

    if (existingRating) {
      throw new ErrorWithCode(ErrorCode.BookingConflict, "Session has already been rated");
    }

    const studentProfileId = this.getStudentProfileId(booking.metadata);
    if (!studentProfileId) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Invalid Thotis booking");
    }

    if (input.requireCompletedAt && !this.hasCompletionMarker(booking.metadata)) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Only completed Thotis sessions can be rated");
    }

    if (!booking.userId) {
      throw new ErrorWithCode(ErrorCode.InternalServerError, "Booking has no mentor assigned");
    }

    await this.statisticsService.addRating(
      input.bookingId,
      booking.userId,
      input.rating,
      input.feedback ?? null,
      input.email
    );

    await this.analyticsService.track({
      eventType: ThotisAnalyticsEventType.rating_submitted,
      userId: booking.userId,
      guestId: input.guestId,
      profileId: studentProfileId,
      bookingId: input.bookingId,
      metadata: {
        rating: input.rating,
        hasFeedback: !!input.feedback,
      },
    });

    const rating = await this.ratingService.getRatingByBookingId(input.bookingId);

    if (!rating) {
      throw new ErrorWithCode(ErrorCode.InternalServerError, "Failed to fetch the submitted rating");
    }

    return rating;
  }

  async getRating(input: BookingViewer & { bookingId: number }): Promise<SessionRatingDto | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        userId: true,
        responses: true,
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Booking not found");
    }

    this.assertBookingViewerAccess(booking, input, "Not authorized to view this rating");

    return await this.ratingService.getRatingByBookingId(input.bookingId);
  }

  async reportIncident(input: {
    bookingId: number;
    type: MentorIncidentType;
    description?: string;
    reporterUserId?: number;
    reporterEmail?: string;
    severity?: number;
  }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        uid: true,
        metadata: true,
        responses: true,
        userId: true,
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Booking not found");
    }

    this.assertBookingViewerAccess(booking, {
      userId: input.reporterUserId,
      email: input.reporterEmail,
    });

    const studentProfileId = this.getStudentProfileId(booking.metadata);
    if (!studentProfileId) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Not a valid mentor session");
    }

    // Sanitize description input
    const sanitizedDescription = sanitizeUserInput(input.description, 1000);

    await this.prisma.mentorQualityIncident.create({
      data: {
        studentProfileId,
        bookingUid: booking.uid,
        reportedByUserId: input.reporterUserId ?? null,
        type: input.type,
        description: sanitizedDescription,
        ...(input.severity !== undefined ? { severity: input.severity } : {}),
      },
    });

    if (input.type === MentorIncidentType.NO_SHOW) {
      await this.analyticsService.track({
        eventType: ThotisAnalyticsEventType.no_show,
        userId: input.reporterUserId,
        profileId: studentProfileId,
        bookingId: input.bookingId,
        metadata: {
          incidentType: input.type,
          isGuestReport: !input.reporterUserId,
          description: sanitizedDescription,
        },
      });
    }

    return toSuccessResponseDto();
  }

  async getPostSessionData(input: BookingViewer & { bookingId: number }): Promise<PostSessionDataDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        userId: true,
        responses: true,
        thotisSessionSummary: {
          select: {
            id: true,
            content: true,
            nextSteps: true,
            createdAt: true,
          },
        },
        thotisSessionResources: {
          select: {
            id: true,
            type: true,
            title: true,
            url: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Booking not found");
    }

    this.assertBookingViewerAccess(booking, input);

    return toPostSessionDataDto({
      summary: booking.thotisSessionSummary,
      resources: booking.thotisSessionResources,
    });
  }

  async savePostSessionData(input: {
    bookingId: number;
    requesterUserId: number;
    content: string;
    nextSteps?: string;
    resources: Array<{
      type: string;
      title: string;
      url: string;
    }>;
  }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        userId: true,
        status: true,
        endTime: true,
        metadata: true,
      },
    });

    if (!booking || booking.userId !== input.requesterUserId) {
      throw new ErrorWithCode(ErrorCode.Forbidden, "Not authorized to edit this session");
    }

    if (booking.endTime > new Date()) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Cannot submit post-session data for a session that hasn't ended yet"
      );
    }

    if (booking.status !== "ACCEPTED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Only completed sessions can have post-session data");
    }

    if (!this.hasCompletionMarker(booking.metadata)) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Session must be marked as complete before adding a summary"
      );
    }

    await this.prisma.thotisSessionSummary.upsert({
      where: { bookingId: input.bookingId },
      create: {
        bookingId: input.bookingId,
        content: input.content,
        nextSteps: input.nextSteps,
      },
      update: {
        content: input.content,
        nextSteps: input.nextSteps,
      },
    });

    await this.prisma.$transaction([
      this.prisma.thotisSessionResource.deleteMany({
        where: { bookingId: input.bookingId },
      }),
      this.prisma.thotisSessionResource.createMany({
        data: input.resources.map((resource) => ({
          bookingId: input.bookingId,
          type: resource.type,
          title: resource.title,
          url: resource.url,
        })),
      }),
    ]);

    return toSuccessResponseDto();
  }

  async listMentorSessions(input: {
    mentorUserId: number;
    status?: "upcoming" | "past" | "cancelled";
    page?: number;
    pageSize?: number;
  }) {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const now = new Date();

    const baseWhere = {
      userId: input.mentorUserId,
      eventType: {
        metadata: {
          path: ["isThotisSession"],
          equals: true,
        },
      },
    } satisfies Prisma.BookingWhereInput;

    let statusFilter: Prisma.BookingWhereInput = {};
    if (input.status === "upcoming") {
      statusFilter = {
        startTime: { gte: now },
        status: { in: ["ACCEPTED", "PENDING"] },
      };
    } else if (input.status === "past") {
      statusFilter = {
        endTime: { lt: now },
        status: { in: ["ACCEPTED", "PENDING"] },
      };
    } else if (input.status === "cancelled") {
      statusFilter = { status: "CANCELLED" };
    }

    const where = { ...baseWhere, ...statusFilter };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
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
          thotisSessionSummary: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { startTime: input.status === "upcoming" ? "asc" : "desc" },
        skip,
        take: pageSize,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return toPaginatedSessionsDto({
      bookings,
      total,
      page,
      pageSize,
    });
  }
}
