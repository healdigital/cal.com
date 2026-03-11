import type { PrismaClient } from "@calcom/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { thotisRouter } from "./thotis";

// Mock dependencies
vi.mock("@calcom/features/thotis/services/ProfileService");
vi.mock("@calcom/features/thotis/services/ThotisBookingService");
vi.mock("@calcom/features/thotis/services/ThotisGuestService");
vi.mock("@calcom/features/thotis/services/StatisticsService");
vi.mock("@calcom/features/thotis/repositories/ProfileRepository");
vi.mock("@calcom/features/thotis/repositories/SessionRatingRepository");
vi.mock("@calcom/prisma", () => {
  const mockPrisma = {
    booking: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    studentProfile: {
      findMany: vi.fn(),
    },
    sessionRating: {
      findUnique: vi.fn(),
    },
  };
  return {
    default: mockPrisma,
    prisma: mockPrisma,
  };
});

// Import mocked classes to set up return values
import { ThotisBookingService } from "@calcom/features/thotis/services/ThotisBookingService";
import { ThotisGuestService } from "@calcom/features/thotis/services/ThotisGuestService";

describe("thotisRouter - Public Sessions", () => {
  let mockCtx: any;
  let caller: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // PUBLIC context (no user)
    mockCtx = {
      user: undefined,
      session: undefined,
      prisma: {} as PrismaClient,
    };

    // Create caller
    // @ts-expect-error - casting context
    caller = thotisRouter.createCaller(mockCtx);
  });

  describe("guestRouter", () => {
    describe("getSessionsByToken", () => {
      it("should allow getting sessions via token as a guest", async () => {
        const token = "mock-token";
        const mockBookings = [{ id: 1, title: "Test Session" }];
        vi.mocked(ThotisBookingService.prototype.studentSessions).mockResolvedValue(mockBookings as never);

        const result = await caller.guest.getSessionsByToken({ token, status: "upcoming" });

        expect(ThotisBookingService.prototype.studentSessions).toHaveBeenCalledWith({
          token,
          status: "upcoming",
        });
        expect(result).toEqual(mockBookings);
      });

      it("should filter by bookingId if the token is scoped", async () => {
        const token = "scoped-token";
        const mockBookings = [{ id: 123, title: "Scoped Session" }];
        vi.mocked(ThotisBookingService.prototype.studentSessions).mockResolvedValue(mockBookings as never);

        const result = await caller.guest.getSessionsByToken({ token });

        expect(ThotisBookingService.prototype.studentSessions).toHaveBeenCalledWith({ token });
        expect(result).toEqual(mockBookings);
      });
    });

    describe("cancelByToken", () => {
      it("should allow guest to cancel session with valid token", async () => {
        const token = "mock-token";
        const email = "guest@example.com";
        const input = {
          bookingId: 123,
          reason: "Can't make it",
          token,
        };

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockResolvedValue({ guest: { email } } as any);
        vi.mocked(ThotisBookingService.prototype.cancelSession).mockResolvedValue({ success: true } as any);

        const result = await caller.guest.cancelByToken(input);

        expect(ThotisGuestService.prototype.verifyToken).toHaveBeenCalledWith(token, input.bookingId);
        expect(ThotisBookingService.prototype.cancelSession).toHaveBeenCalledWith(
          input.bookingId,
          input.reason,
          "student",
          expect.objectContaining({ email })
        );
        expect(result).toEqual({ success: true });
      });

      it("should deny access if token is scoped to a different booking", async () => {
        const token = "wrong-scoped-token";
        const email = "guest@example.com";
        const input = {
          bookingId: 123,
          reason: "Can't make it",
          token,
        };

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockRejectedValue(
          new Error("This link is restricted to another session")
        );

        await expect(caller.guest.cancelByToken(input)).rejects.toThrow(
          "This link is restricted to another session"
        );
      });
    });

    describe("rescheduleByToken", () => {
      it("should allow guest to reschedule session with valid token", async () => {
        const token = "mock-token";
        const email = "guest@example.com";
        const input = {
          bookingId: 123,
          newDateTime: new Date(),
          token,
        };

        const mockResponse = {
          bookingId: 123,
          googleMeetLink: "link",
          calendarEventId: "evt",
          confirmationSent: true,
        };
        vi.mocked(ThotisGuestService.prototype.verifyToken).mockResolvedValue({ guest: { email } } as any);
        vi.mocked(ThotisBookingService.prototype.rescheduleSession).mockResolvedValue(mockResponse);

        const result = await caller.guest.rescheduleByToken(input);

        expect(ThotisGuestService.prototype.verifyToken).toHaveBeenCalledWith(token, input.bookingId);
        expect(ThotisBookingService.prototype.rescheduleSession).toHaveBeenCalledWith(
          input.bookingId,
          input.newDateTime,
          expect.objectContaining({ email })
        );
        expect(result).toEqual(mockResponse);
      });

      it("should deny access if token is scoped to a different booking", async () => {
        const token = "wrong-scoped-token";
        const email = "guest@example.com";
        const input = {
          bookingId: 123,
          newDateTime: new Date(),
          token,
        };

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockRejectedValue(
          new Error("This link is restricted to another session")
        );

        await expect(caller.guest.rescheduleByToken(input)).rejects.toThrow(
          "This link is restricted to another session"
        );
      });
    });

    describe("getPostSessionDataByToken", () => {
      it("should allow getting post-session data with valid token", async () => {
        const token = "mock-token";
        const bookingId = 123;
        const email = "guest@example.com";
        const createdAt = new Date("2024-01-01T10:00:00.000Z");
        const mockSummary = {
          id: "summary-1",
          content: "Summary",
          nextSteps: null,
          createdAt,
        };
        const mockResources = [
          { id: "resource-1", type: "link", title: "Resource", url: "https://example.com" },
        ];

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockResolvedValue({ guest: { email } } as any);

        const prisma = (await import("@calcom/prisma")).default;
        vi.mocked(prisma.booking.findUnique).mockResolvedValue({
          userId: 999,
          responses: { email },
          thotisSessionSummary: mockSummary,
          thotisSessionResources: mockResources,
        } as any);

        const result = await caller.guest.getPostSessionDataByToken({ token, bookingId });

        expect(ThotisGuestService.prototype.verifyToken).toHaveBeenCalledWith(token, bookingId);
        expect(result).toEqual({
          summary: { ...mockSummary, createdAt: createdAt.toISOString() },
          resources: mockResources,
        });
      });

      it("should deny access if token is scoped to a different booking", async () => {
        const token = "wrong-scoped-token";
        const bookingId = 123;
        const email = "guest@example.com";

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockRejectedValue(
          new Error("This link is restricted to another session")
        );

        await expect(caller.guest.getPostSessionDataByToken({ token, bookingId })).rejects.toThrow(
          "This link is restricted to another session"
        );
      });

      it("should deny access if email doesn't match booking", async () => {
        const token = "mock-token";
        const bookingId = 123;
        const email = "guest@example.com";

        vi.mocked(ThotisGuestService.prototype.verifyToken).mockResolvedValue({ guest: { email } } as any);

        const prisma = (await import("@calcom/prisma")).default;
        vi.mocked(prisma.booking.findUnique).mockResolvedValue({
          responses: { email: "other@test.com" },
        } as any);

        await expect(caller.guest.getPostSessionDataByToken({ token, bookingId })).rejects.toThrow(
          "Not authorized"
        );
      });
    });
  });
});
