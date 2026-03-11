import { ErrorCode } from "@calcom/lib/errorCodes";
import type { ErrorWithCode } from "@calcom/lib/errors";
import type { PrismaClient } from "@prisma/client";
import fc from "fast-check";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThotisBookingService } from "./ThotisBookingService";
import type { ThotisEmailService } from "./ThotisEmailService";
import type { ThotisGuestService } from "./ThotisGuestService";

const mockAvailableSlotsService = {
  getAvailableSlots: vi.fn(),
};

vi.mock("@calcom/features/di/containers/AvailableSlots", () => ({
  getAvailableSlotsService: vi.fn(() => mockAvailableSlotsService),
}));

vi.mock("./ThotisWebhookClient", () => ({
  thotisWebhooks: {
    onBookingCancelled: vi.fn(),
    onBookingCompleted: vi.fn(),
    onBookingCreated: vi.fn(),
    onBookingRescheduled: vi.fn(),
  },
}));

const prismaMock = {
  booking: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  credential: {
    findMany: vi.fn(),
  },
  eventType: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  mentorQualityIncident: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  studentProfile: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
} as unknown as PrismaClient;

describe("ThotisBookingService Properties", () => {
  const emailServiceMock = {
    sendCancellation: vi.fn(),
    sendConfirmation: vi.fn(),
    sendRescheduled: vi.fn(),
  } as unknown as ThotisEmailService;
  const guestServiceMock = {
    requestInboxLink: vi.fn().mockResolvedValue({ token: "guest-token" }),
    verifyToken: vi.fn(),
  } as unknown as ThotisGuestService;
  let service: ThotisBookingService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ThotisBookingService(
      prismaMock,
      undefined,
      undefined,
      undefined,
      guestServiceMock,
      emailServiceMock
    );
  });

  it("always creates sessions exactly 15 minutes long", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .date({
            max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            min: new Date(Date.now() + 3 * 60 * 60 * 1000),
          })
          .filter((date) => !Number.isNaN(date.getTime())),
        async (dateTime) => {
          const endTime = new Date(dateTime.getTime() + 15 * 60 * 1000);

          vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({
            id: "student-1",
            isActive: true,
            status: "VERIFIED",
            user: {
              email: "mentor@example.com",
              id: 1,
              name: "Mentor",
              studentProfile: { field: "COMPUTER_SCIENCE" },
            },
            userId: 1,
          });
          vi.mocked(prismaMock.booking.findFirst).mockResolvedValue(null);
          vi.mocked(prismaMock.eventType.findFirst).mockResolvedValue({
            id: 1,
            length: 15,
          });
          vi.mocked(prismaMock.booking.create).mockImplementation(async ({ data }) => ({
            description: "Student mentoring session",
            endTime: data.endTime,
            id: 1,
            metadata: data.metadata,
            responses: data.responses,
            startTime: data.startTime,
            status: "PENDING",
            title: "Thotis Student Mentoring Session",
            uid: "booking-uid",
            userId: 1,
          }));
          vi.mocked(prismaMock.studentProfile.update).mockResolvedValue({ id: "student-1" });
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
            id: 1,
            location: null,
            metadata: { studentProfileId: "student-1" },
            uid: "booking-uid",
          });
          vi.mocked(mockAvailableSlotsService.getAvailableSlots).mockResolvedValue({
            slots: {
              [dateTime.toISOString().split("T")[0]]: [{ time: dateTime.toISOString() }],
            },
          });

          await service.createStudentSession({
            dateTime,
            prospectiveStudent: {
              email: "test@example.com",
              name: "Test User",
            },
            studentProfileId: "student-1",
          });

          const latestCreateCall = vi.mocked(prismaMock.booking.create).mock.calls.at(-1)?.[0];
          const createdStartTime = latestCreateCall?.data.startTime as Date;
          const createdEndTime = latestCreateCall?.data.endTime as Date;

          expect(createdStartTime).toBeInstanceOf(Date);
          expect(createdEndTime).toBeInstanceOf(Date);
          expect(createdEndTime.getTime() - createdStartTime.getTime()).toBe(15 * 60 * 1000);
          expect(endTime.getTime() - dateTime.getTime()).toBe(15 * 60 * 1000);
        }
      )
    );
  });

  it("rejects bookings that are less than two hours away", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .date({
            max: new Date(Date.now() + 2 * 60 * 60 * 1000 - 1_000),
            min: new Date(),
          })
          .filter((date) => !Number.isNaN(date.getTime())),
        async (dateTime) => {
          await expect(
            service.createStudentSession({
              dateTime,
              prospectiveStudent: {
                email: "test@example.com",
                name: "Test User",
              },
              studentProfileId: "student-1",
            })
          ).rejects.toMatchObject({
            code: ErrorCode.BadRequest,
          } satisfies Partial<ErrorWithCode>);
        }
      )
    );
  });

  it("rejects overlapping bookings when an existing booking already occupies the slot", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .date({ min: new Date(Date.now() + 3 * 60 * 60 * 1000) })
          .filter((date) => !Number.isNaN(date.getTime())),
        async (dateTime) => {
          vi.mocked(prismaMock.studentProfile.findUnique).mockResolvedValue({
            id: "student-1",
            isActive: true,
            status: "VERIFIED",
            user: {
              studentProfile: { field: "COMPUTER_SCIENCE" },
            },
            userId: 1,
          });
          vi.mocked(prismaMock.booking.findFirst).mockResolvedValue({
            endTime: new Date(dateTime.getTime() + 15 * 60 * 1000),
            id: 2,
            startTime: dateTime,
          });

          await expect(
            service.createStudentSession({
              dateTime,
              prospectiveStudent: {
                email: "test@example.com",
                name: "Test User",
              },
              studentProfileId: "student-1",
            })
          ).rejects.toMatchObject({
            code: ErrorCode.BookingConflict,
          } satisfies Partial<ErrorWithCode>);
        }
      )
    );
  });

  it("rejects availability queries beyond 30 days", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.date({ min: new Date() }),
        fc.integer({ max: 100, min: 31 }),
        async (startDate, days) => {
          const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000 + 1_000);

          await expect(
            service.getStudentAvailability("student-1", {
              end: endDate,
              start: startDate,
            })
          ).rejects.toMatchObject({
            code: ErrorCode.BadRequest,
          } satisfies Partial<ErrorWithCode>);
        }
      )
    );
  });
});
