import { ErrorCode } from "@calcom/lib/errorCodes";
import type { ErrorWithCode } from "@calcom/lib/errors";
import type { PrismaClient } from "@calcom/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RedisService } from "../../redis/RedisService";
import type { AnalyticsService } from "./AnalyticsService";
import { ThotisBookingService } from "./ThotisBookingService";
import type { ThotisEmailService } from "./ThotisEmailService";
import type { ThotisGuestService } from "./ThotisGuestService";

const mockAvailableSlotsService = {
  getAvailableSlots: vi.fn(),
};

const thotisWebhooksMock = {
  onBookingCancelled: vi.fn(),
  onBookingCompleted: vi.fn(),
  onBookingCreated: vi.fn(),
  onBookingRescheduled: vi.fn(),
};

vi.mock("@calcom/features/di/containers/AvailableSlots", () => ({
  getAvailableSlotsService: vi.fn(() => mockAvailableSlotsService),
}));

vi.mock("./ThotisWebhookClient", () => ({
  thotisWebhooks: thotisWebhooksMock,
}));

type BookingPrismaMock = Pick<
  PrismaClient,
  "booking" | "credential" | "eventType" | "mentorQualityIncident" | "studentProfile" | "user"
>;

const createPrismaMock = (): BookingPrismaMock =>
  ({
    studentProfile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    booking: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    eventType: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    credential: {
      findMany: vi.fn(),
    },
    mentorQualityIncident: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  }) as unknown as BookingPrismaMock;

const createAnalyticsMock = () =>
  ({
    trackBookingCancelled: vi.fn(),
    trackBookingCompleted: vi.fn(),
    trackBookingCreated: vi.fn(),
    trackBookingRescheduled: vi.fn(),
  }) as unknown as AnalyticsService;

const createRedisMock = () =>
  ({
    del: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  }) as unknown as RedisService;

const createGuestServiceMock = () =>
  ({
    requestInboxLink: vi.fn().mockResolvedValue({ token: "guest-token" }),
    verifyToken: vi.fn(),
  }) as unknown as ThotisGuestService;

const createEmailServiceMock = () =>
  ({
    sendCancellation: vi.fn(),
    sendConfirmation: vi.fn(),
    sendRescheduled: vi.fn(),
  }) as unknown as ThotisEmailService;

describe("ThotisBookingService Unit Tests", () => {
  let analyticsMock: AnalyticsService;
  let emailServiceMock: ThotisEmailService;
  let guestServiceMock: ThotisGuestService;
  let prismaMock: BookingPrismaMock;
  let redisMock: RedisService;
  let service: ThotisBookingService;

  beforeEach(() => {
    vi.clearAllMocks();

    prismaMock = createPrismaMock();
    analyticsMock = createAnalyticsMock();
    redisMock = createRedisMock();
    guestServiceMock = createGuestServiceMock();
    emailServiceMock = createEmailServiceMock();

    service = new ThotisBookingService(
      prismaMock,
      analyticsMock,
      redisMock,
      undefined,
      guestServiceMock,
      emailServiceMock
    );
  });

  describe("ensureVideoLink", () => {
    it("returns an existing link when one is already present", async () => {
      // @ts-expect-error Testing a private helper directly keeps this unit test focused.
      const link = await service.ensureVideoLink(1, "uid", "https://meet.google.com/abc", {});

      expect(link).toBe("https://meet.google.com/abc");
      expect(prismaMock.booking.update).not.toHaveBeenCalled();
    });

    it("generates a Jitsi fallback when the placeholder link is still present", async () => {
      // @ts-expect-error Testing a private helper directly keeps this unit test focused.
      const link = await service.ensureVideoLink(1, "test-uid", "integrations:google-video", {});

      expect(link).toBe("https://meet.jit.si/thotis-test-uid");
      expect(prismaMock.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            location: "https://meet.jit.si/thotis-test-uid",
          }),
          where: { id: 1 },
        })
      );
    });
  });

  describe("createStudentSession", () => {
    it("creates a booking, invalidates cache, and sends the confirmation email through the injected service", async () => {
      const dateTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
      const endTime = new Date(dateTime.getTime() + 15 * 60 * 1000);

      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({
        id: "sp1",
        isActive: true,
        status: "VERIFIED",
        user: {
          email: "mentor@example.com",
          id: 1,
          name: "Mentor",
          studentProfile: {
            field: "COMPUTER_SCIENCE",
          },
        },
        userId: 1,
      });
      vi.mocked(prismaMock.booking.findFirst).mockResolvedValue(null);
      vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({ id: 101, length: 15 });
      vi.mocked(prismaMock.booking.create).mockResolvedValue({
        description: "Student mentoring session",
        endTime,
        id: 99,
        metadata: { studentProfileId: "sp1" },
        responses: {
          email: "student@example.com",
          name: "Student",
        },
        startTime: dateTime,
        status: "PENDING",
        title: "Thotis Student Mentoring Session",
        uid: "booking-uid",
        userId: 1,
      });
      vi.mocked(prismaMock.studentProfile.update).mockResolvedValue({
        id: "sp1",
      });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({
        email: "mentor@example.com",
        locale: "fr",
        name: "Mentor",
        timeFormat: 24,
        timeZone: "Europe/Paris",
        username: "mentor",
      });
      vi.mocked(prismaMock.credential.findMany).mockResolvedValue([]);
      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        id: 99,
        location: null,
        metadata: { studentProfileId: "sp1" },
        uid: "booking-uid",
      });
      vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({
        slots: {
          [dateTime.toISOString().split("T")[0]]: [{ time: dateTime.toISOString() }],
        },
      });

      const result = await service.createStudentSession({
        dateTime,
        prospectiveStudent: {
          email: "student@example.com",
          name: "Student",
        },
        studentProfileId: "sp1",
      });

      expect(result).toEqual({
        bookingId: 99,
        calendarEventId: "booking-uid",
        confirmationSent: true,
        googleMeetLink: "https://meet.jit.si/thotis-booking-uid",
      });
      expect(analyticsMock.trackBookingCreated).toHaveBeenCalled();
      expect(redisMock.set).toHaveBeenCalledWith(
        "availability:version:sp1",
        expect.any(String),
        expect.objectContaining({ ttl: 24 * 60 * 60 * 1000 })
      );
      expect(guestServiceMock.requestInboxLink).toHaveBeenCalledWith("student@example.com", 99, 1440);
      expect(emailServiceMock.sendConfirmation).toHaveBeenCalledWith(
        expect.objectContaining({
          location: "https://meet.jit.si/thotis-booking-uid",
          uid: "booking-uid",
        }),
        expect.objectContaining({ email: "student@example.com" }),
        "http://app.cal.local:3000/thotis/my-sessions?token=guest-token"
      );
      expect(thotisWebhooksMock.onBookingCreated).toHaveBeenCalledWith(
        expect.objectContaining({ id: 99 }),
        "sp1",
        "COMPUTER_SCIENCE"
      );
    });

    it("throws a booking conflict when the availability engine does not return the requested slot", async () => {
      const dateTime = new Date(Date.now() + 4 * 60 * 60 * 1000);

      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({
        id: "sp1",
        isActive: true,
        status: "VERIFIED",
        user: {
          studentProfile: { field: "COMPUTER_SCIENCE" },
        },
        userId: 1,
      });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({ id: 1, username: "mentor" });
      vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({ id: 101, length: 15 });
      vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({ slots: {} });

      await expect(
        service.createStudentSession({
          dateTime,
          prospectiveStudent: { email: "student@example.com", name: "Student" },
          studentProfileId: "sp1",
        })
      ).rejects.toThrow(/Mentor is not available/);
    });

    it("enforces the Redis rate limit before creating a booking", async () => {
      const dateTime = new Date(Date.now() + 4 * 60 * 60 * 1000);

      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({
        id: "sp1",
        isActive: true,
        status: "VERIFIED",
        user: {
          studentProfile: { field: "COMPUTER_SCIENCE" },
        },
        userId: 1,
      });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({ id: 1, username: "mentor" });
      vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({ id: 101, length: 15 });
      vi.mocked(prismaMock.booking.findFirst).mockResolvedValue(null);
      vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({
        slots: {
          [dateTime.toISOString().split("T")[0]]: [{ time: dateTime.toISOString() }],
        },
      });
      vi.mocked(redisMock.get).mockResolvedValue("2");

      await expect(
        service.createStudentSession({
          dateTime,
          prospectiveStudent: { email: "student@example.com", name: "Student" },
          studentProfileId: "sp1",
        })
      ).rejects.toMatchObject({
        code: ErrorCode.BookerLimitExceeded,
      } satisfies Partial<ErrorWithCode>);
    });
  });

  describe("cancelSession", () => {
    it("prevents cancellation if notice is less than 2 hours", async () => {
      const now = new Date();

      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        eventType: { minimumBookingNotice: 120, userId: 1 },
        id: 1,
        metadata: { studentProfileId: "sp1" },
        startTime: new Date(now.getTime() + 30 * 60 * 1000),
        status: "PENDING",
      });

      await expect(service.cancelSession(1, "reason", "student", { id: 1 })).rejects.toThrow(
        "Bookings must be cancelled at least 120 minutes in advance"
      );
    });

    it("cancels a session, updates stats, and uses the injected email service", async () => {
      const startTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 15 * 60 * 1000);

      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        endTime,
        eventType: { minimumBookingNotice: 120, userId: 1 },
        id: 1,
        metadata: { studentProfileId: "sp1" },
        responses: {
          email: "student@example.com",
          name: "Student",
        },
        startTime,
        status: "PENDING",
        uid: "booking-uid",
        userId: 1,
      });
      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({ userId: 1 });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({
        email: "mentor@example.com",
        locale: "fr",
        name: "Mentor",
        timeFormat: 24,
        timeZone: "Europe/Paris",
      });
      vi.mocked(prismaMock.credential.findMany).mockResolvedValue([]);

      await service.cancelSession(1, "Change of plans", "student", {
        email: "student@example.com",
      });

      expect(prismaMock.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cancellationReason: "Change of plans",
            status: "CANCELLED",
          }),
          where: { id: 1 },
        })
      );
      expect(prismaMock.studentProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cancelledSessions: { increment: 1 },
          }),
          where: { id: "sp1" },
        })
      );
      expect(emailServiceMock.sendCancellation).toHaveBeenCalledWith(
        expect.objectContaining({ uid: "booking-uid" }),
        expect.objectContaining({ email: "student@example.com" })
      );
      expect(analyticsMock.trackBookingCancelled).toHaveBeenCalled();
      expect(thotisWebhooksMock.onBookingCancelled).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        "Change of plans"
      );
    });
  });

  describe("rescheduleSession", () => {
    it("throws a conflict when the new slot is unavailable", async () => {
      const now = new Date();
      const newDateTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);

      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        eventType: { userId: 1 },
        id: 1,
        startTime: now,
        status: "PENDING",
        userId: 1,
      });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({ id: 1, username: "mentor" });
      vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({ id: 101, length: 15 });
      vi.mocked(prismaMock.booking.findFirst).mockResolvedValue(null);
      vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({ slots: {} });

      await expect(service.rescheduleSession(1, newDateTime, { id: 1 })).rejects.toThrow(
        /Mentor is not available/
      );
    });

    it("reschedules a session and sends the reschedule email through the injected service", async () => {
      const originalStartTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
      const originalEndTime = new Date(originalStartTime.getTime() + 15 * 60 * 1000);
      const newDateTime = new Date(Date.now() + 6 * 60 * 60 * 1000);

      vi.mocked(prismaMock.booking.findUnique)
        .mockResolvedValueOnce({
          eventType: { userId: 1 },
          id: 1,
          metadata: { studentProfileId: "sp1" },
          responses: {
            email: "student@example.com",
            name: "Student",
          },
          startTime: originalStartTime,
          status: "PENDING",
          uid: "booking-uid",
          userId: 1,
        })
        .mockResolvedValueOnce({
          id: 1,
          location: null,
          metadata: { studentProfileId: "sp1" },
          uid: "booking-uid",
        })
        .mockResolvedValueOnce({
          eventType: { userId: 1 },
          id: 1,
          metadata: { studentProfileId: "sp1" },
        });
      vi.mocked(prismaMock.booking.findFirst).mockResolvedValue(null);
      vi.mocked(prismaMock.booking.update).mockResolvedValue({
        id: 1,
        uid: "booking-uid",
      });
      vi.mocked(prismaMock.user.findUnique).mockResolvedValue({
        email: "mentor@example.com",
        locale: "fr",
        name: "Mentor",
        timeFormat: 24,
        timeZone: "Europe/Paris",
        username: "mentor",
      });
      vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({ id: 101, length: 15 });
      vi.mocked(prismaMock.credential.findMany).mockResolvedValue([]);
      vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({
        slots: {
          [newDateTime.toISOString().split("T")[0]]: [{ time: newDateTime.toISOString() }],
        },
      });

      const result = await service.rescheduleSession(1, newDateTime, { id: 1 });

      expect(result).toEqual({
        bookingId: 1,
        calendarEventId: "booking-uid",
        confirmationSent: true,
        googleMeetLink: "https://meet.jit.si/thotis-booking-uid",
      });
      expect(emailServiceMock.sendRescheduled).toHaveBeenCalledWith(
        expect.objectContaining({
          endTime: new Date(newDateTime.getTime() + 15 * 60 * 1000).toISOString(),
          location: "https://meet.jit.si/thotis-booking-uid",
          startTime: newDateTime.toISOString(),
        }),
        expect.objectContaining({ email: "student@example.com" })
      );
      expect(thotisWebhooksMock.onBookingRescheduled).toHaveBeenCalled();
      expect(redisMock.set).toHaveBeenCalledWith(
        "availability:version:sp1",
        expect.any(String),
        expect.objectContaining({ ttl: 24 * 60 * 60 * 1000 })
      );
      expect(prismaMock.booking.update).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({
            endTime: new Date(newDateTime.getTime() + 15 * 60 * 1000),
            startTime: newDateTime,
          }),
          where: { id: 1 },
        })
      );
      expect(originalEndTime).toBeInstanceOf(Date);
    });
  });

  describe("markSessionComplete", () => {
    it("marks the session as complete and updates mentor stats", async () => {
      const endedAt = new Date(Date.now() - 15 * 60 * 1000);

      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        endTime: endedAt,
        eventType: { userId: 1 },
        id: 1,
        metadata: { studentProfileId: "sp1" },
        responses: { email: "student@example.com" },
        startTime: new Date(endedAt.getTime() - 15 * 60 * 1000),
        status: "PENDING",
        uid: "booking-uid",
        userId: 1,
      });
      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({ userId: 1 });

      await service.markSessionComplete(1, { id: 1 });

      expect(prismaMock.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "ACCEPTED" }),
          where: { id: 1 },
        })
      );
      expect(prismaMock.studentProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            completedSessions: { increment: 1 },
          }),
          where: { id: "sp1" },
        })
      );
      expect(analyticsMock.trackBookingCompleted).toHaveBeenCalled();
      expect(thotisWebhooksMock.onBookingCompleted).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        15
      );
    });
  });

  describe("markSessionAsNoShow", () => {
    it("marks the session as cancelled and creates a no-show incident when none exists", async () => {
      const now = new Date();

      vi.mocked(prismaMock.booking.findUnique).mockResolvedValue({
        endTime: new Date(now.getTime() - 15 * 60 * 1000),
        eventType: { userId: 1 },
        id: 1,
        metadata: { studentProfileId: "sp1" },
        responses: { email: "student@example.com" },
        startTime: new Date(now.getTime() - 30 * 60 * 1000),
        status: "PENDING",
        uid: "booking-uid",
        userId: 1,
      });
      vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({ userId: 1 });
      vi.mocked(prismaMock.mentorQualityIncident.findFirst).mockResolvedValue(null);

      await service.markSessionAsNoShow(1, { isSystem: true });

      expect(prismaMock.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cancellationReason: "no_show_auto",
            status: "CANCELLED",
          }),
          where: { id: 1 },
        })
      );
      expect(prismaMock.mentorQualityIncident.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bookingUid: "booking-uid",
            studentProfileId: "sp1",
            type: "NO_SHOW",
          }),
        })
      );
      expect(thotisWebhooksMock.onBookingCancelled).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        "Automatically cancelled due to no-show"
      );
    });
  });

  describe("studentSessions", () => {
    it("uses the guest token to resolve the student email before listing sessions", async () => {
      vi.mocked(guestServiceMock.verifyToken).mockResolvedValue({
        bookingId: 5,
        guest: { email: "guest@example.com" },
      });
      vi.mocked(prismaMock.booking.findMany).mockResolvedValue([
        {
          endTime: new Date(),
          id: 5,
          metadata: { studentProfileId: "sp1" },
          responses: { email: "guest@example.com" },
          startTime: new Date(),
          status: "PENDING",
          thotisSessionSummary: null,
          title: "Session",
          uid: "booking-uid",
          user: {
            avatarUrl: null,
            name: "Mentor",
            username: "mentor",
          },
        },
      ]);

      const sessions = await service.studentSessions({ status: "all", token: "guest-token" });

      expect(guestServiceMock.verifyToken).toHaveBeenCalledWith("guest-token");
      expect(prismaMock.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: 5,
          }),
        })
      );
      expect(sessions).toHaveLength(1);
    });

    it("requires an email or token to list sessions", async () => {
      await expect(service.studentSessions({ status: "all" })).rejects.toMatchObject({
        code: ErrorCode.Unauthorized,
      } satisfies Partial<ErrorWithCode>);
    });
  });
});
