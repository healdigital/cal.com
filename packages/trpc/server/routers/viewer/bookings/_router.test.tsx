import type { PrismaClient } from "@calcom/prisma";
import { BookingReportReason } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

type BookingsRouterMocks = {
  mockAddGuestsHandler: Mock;
  mockConfirmHandler: Mock;
  mockEditLocationHandler: Mock;
  mockFindBookingHandler: Mock;
  mockGetBookingAttendeesHandler: Mock;
  mockGetBookingDetailsHandler: Mock;
  mockGetBookingHandler: Mock;
  mockGetBookingHistoryHandler: Mock;
  mockGetInstantBookingLocationHandler: Mock;
  mockGetRoutingTraceHandler: Mock;
  mockMakeUserActor: Mock;
  mockPrismaBookingFindFirst: Mock;
  mockReportBookingHandler: Mock;
  mockReportWrongAssignmentHandler: Mock;
  mockRequestRescheduleHandler: Mock;
};

const {
  mockAddGuestsHandler,
  mockConfirmHandler,
  mockEditLocationHandler,
  mockFindBookingHandler,
  mockGetBookingAttendeesHandler,
  mockGetBookingDetailsHandler,
  mockGetBookingHandler,
  mockGetBookingHistoryHandler,
  mockGetInstantBookingLocationHandler,
  mockGetRoutingTraceHandler,
  mockMakeUserActor,
  mockPrismaBookingFindFirst,
  mockReportBookingHandler,
  mockReportWrongAssignmentHandler,
  mockRequestRescheduleHandler,
}: BookingsRouterMocks = vi.hoisted(
  (): BookingsRouterMocks => ({
    mockAddGuestsHandler: vi.fn(),
    mockConfirmHandler: vi.fn(),
    mockEditLocationHandler: vi.fn(),
    mockFindBookingHandler: vi.fn(),
    mockGetBookingAttendeesHandler: vi.fn(),
    mockGetBookingDetailsHandler: vi.fn(),
    mockGetBookingHandler: vi.fn(),
    mockGetBookingHistoryHandler: vi.fn(),
    mockGetInstantBookingLocationHandler: vi.fn(),
    mockGetRoutingTraceHandler: vi.fn(),
    mockMakeUserActor: vi.fn(),
    mockPrismaBookingFindFirst: vi.fn(),
    mockReportBookingHandler: vi.fn(),
    mockReportWrongAssignmentHandler: vi.fn(),
    mockRequestRescheduleHandler: vi.fn(),
  })
);

vi.mock("../../../middlewares/sessionMiddleware", () => {
  const passthroughMiddleware = ({
    ctx,
    next,
  }: {
    ctx: { session?: unknown; user?: unknown };
    next: (options?: { ctx?: { session?: unknown; user?: unknown } }) => Promise<unknown>;
  }): Promise<unknown> =>
    next({
      ctx: {
        session: ctx.session,
        user: ctx.user,
      },
    });

  return {
    isAdminMiddleware: passthroughMiddleware,
    isAuthed: passthroughMiddleware,
    isOrgAdminMiddleware: passthroughMiddleware,
  };
});

vi.mock("@calcom/features/booking-audit/lib/makeActor", () => ({
  makeUserActor: mockMakeUserActor,
}));

vi.mock("@calcom/prisma", () => ({
  prisma: {
    booking: {
      findFirst: mockPrismaBookingFindFirst,
    },
  },
}));

vi.mock("./get.handler", () => ({
  getHandler: mockGetBookingHandler,
}));

vi.mock("./requestReschedule.handler", () => ({
  requestRescheduleHandler: mockRequestRescheduleHandler,
}));

vi.mock("./editLocation.handler", () => ({
  editLocationHandler: mockEditLocationHandler,
}));

vi.mock("./addGuests.handler", () => ({
  addGuestsHandler: mockAddGuestsHandler,
}));

vi.mock("./confirm.handler", () => ({
  confirmHandler: mockConfirmHandler,
}));

vi.mock("./getBookingAttendees.handler", () => ({
  getBookingAttendeesHandler: mockGetBookingAttendeesHandler,
}));

vi.mock("./getBookingDetails.handler", () => ({
  getBookingDetailsHandler: mockGetBookingDetailsHandler,
}));

vi.mock("./find.handler", () => ({
  getHandler: mockFindBookingHandler,
}));

vi.mock("./getInstantBookingLocation.handler", () => ({
  getHandler: mockGetInstantBookingLocationHandler,
}));

vi.mock("./reportBooking.handler", () => ({
  reportBookingHandler: mockReportBookingHandler,
}));

vi.mock("./reportWrongAssignment.handler", () => ({
  reportWrongAssignmentHandler: mockReportWrongAssignmentHandler,
}));

vi.mock("./getBookingHistory.handler", () => ({
  getBookingHistoryHandler: mockGetBookingHistoryHandler,
}));

vi.mock("./getRoutingTrace.handler", () => ({
  getRoutingTraceHandler: mockGetRoutingTraceHandler,
}));

import { bookingsRouter } from "./_router";

type BookingsCaller = ReturnType<typeof bookingsRouter.createCaller>;
type BookingsCallerContext = Parameters<typeof bookingsRouter.createCaller>[0];

const createMockContext = (): BookingsCallerContext =>
  ({
    locale: "en",
    prisma: {} as PrismaClient,
    session: {
      expires: "2099-01-01T00:00:00.000Z",
      upId: "usr-1",
      user: {
        id: 1,
      },
    },
    user: {
      destinationCalendar: null,
      email: "owner@example.com",
      id: 1,
      locale: "en",
      organization: null,
      profile: {
        organizationId: null,
      },
      role: "USER",
      username: "owner",
      uuid: "user-uuid",
    },
  }) as unknown as BookingsCallerContext;

const createBookingAccessContext = (): {
  attendees: never[];
  destinationCalendar: null;
  eventType: null;
  id: number;
  references: never[];
  user: {
    credentials: never[];
    destinationCalendar: null;
    profiles: never[];
  };
} => ({
  attendees: [],
  destinationCalendar: null,
  eventType: null,
  id: 99,
  references: [],
  user: {
    credentials: [],
    destinationCalendar: null,
    profiles: [],
  },
});

describe("bookingsRouter", () => {
  let caller: BookingsCaller;
  let ctx: BookingsCallerContext;

  beforeEach(() => {
    vi.clearAllMocks();

    ctx = createMockContext();
    caller = bookingsRouter.createCaller(ctx);

    mockMakeUserActor.mockReturnValue({
      id: "user-uuid",
      type: "user",
    });
  });

  it("routes standard procedures to their handlers", async () => {
    mockGetBookingHandler.mockResolvedValue({ bookings: [], totalCount: 0 });
    mockRequestRescheduleHandler.mockResolvedValue({ ok: true });
    mockAddGuestsHandler.mockResolvedValue({ addedGuests: 1 });
    mockGetBookingAttendeesHandler.mockResolvedValue({ attendees: [] });
    mockGetBookingDetailsHandler.mockResolvedValue({ uid: "booking-uid" });
    mockFindBookingHandler.mockResolvedValue({ uid: "booking-uid" });
    mockGetInstantBookingLocationHandler.mockResolvedValue({ location: "https://meet.example.com/demo" });
    mockReportBookingHandler.mockResolvedValue({ success: true });
    mockReportWrongAssignmentHandler.mockResolvedValue({ success: true });
    mockGetBookingHistoryHandler.mockResolvedValue({ bookings: [] });
    mockGetRoutingTraceHandler.mockResolvedValue({ trace: [] });

    await expect(caller.get({ filters: {}, limit: 10, offset: 0 })).resolves.toEqual({
      bookings: [],
      totalCount: 0,
    });
    await expect(
      caller.requestReschedule({ bookingUid: "booking-uid", rescheduleReason: "Conflict" })
    ).resolves.toEqual({ ok: true });
    await expect(
      caller.addGuests({
        bookingId: 99,
        guests: [{ email: "guest@example.com", name: "Guest" }],
      })
    ).resolves.toEqual({ addedGuests: 1 });
    await expect(
      caller.getBookingAttendees({ seatReferenceUid: "123e4567-e89b-12d3-a456-426614174000" })
    ).resolves.toEqual({ attendees: [] });
    await expect(caller.getBookingDetails({ uid: "booking-uid" })).resolves.toEqual({
      uid: "booking-uid",
    });
    await expect(caller.find({ bookingUid: "booking-uid" })).resolves.toEqual({
      uid: "booking-uid",
    });
    await expect(caller.getInstantBookingLocation({ bookingUid: "booking-uid" })).resolves.toEqual({
      location: "https://meet.example.com/demo",
    });
    await expect(
      caller.reportBooking({
        bookingUid: "booking-uid",
        description: "Incorrect host",
        reason: BookingReportReason.OTHER,
      })
    ).resolves.toEqual({ success: true });
    await expect(
      caller.reportWrongAssignment({
        additionalNotes: "Should be assigned to Alice",
        bookingUid: "booking-uid",
        correctAssignee: "alice@example.com",
      })
    ).resolves.toEqual({ success: true });
    await expect(caller.getBookingHistory({ bookingUid: "booking-uid" })).resolves.toEqual({
      bookings: [],
    });
    await expect(caller.getRoutingTrace({ bookingUid: "booking-uid" })).resolves.toEqual({
      trace: [],
    });

    expect(mockGetBookingHandler).toHaveBeenCalledWith({
      ctx,
      input: { filters: {}, limit: 10, offset: 0 },
    });
    expect(mockRequestRescheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: { bookingUid: "booking-uid", rescheduleReason: "Conflict" },
      source: "WEBAPP",
    });
    expect(mockAddGuestsHandler).toHaveBeenCalledWith({
      actionSource: "WEBAPP",
      ctx,
      input: {
        bookingId: 99,
        guests: [{ email: "guest@example.com", name: "Guest" }],
      },
    });
    expect(mockGetBookingAttendeesHandler).toHaveBeenCalledWith({
      ctx,
      input: { seatReferenceUid: "123e4567-e89b-12d3-a456-426614174000" },
    });
    expect(mockGetBookingDetailsHandler).toHaveBeenCalledWith({
      ctx,
      input: { uid: "booking-uid" },
    });
    expect(mockFindBookingHandler).toHaveBeenCalledWith({
      ctx,
      input: { bookingUid: "booking-uid" },
    });
    expect(mockGetInstantBookingLocationHandler).toHaveBeenCalledWith({
      ctx,
      input: { bookingUid: "booking-uid" },
    });
    expect(mockReportBookingHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        bookingUid: "booking-uid",
        description: "Incorrect host",
        reason: BookingReportReason.OTHER,
      },
    });
    expect(mockReportWrongAssignmentHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        additionalNotes: "Should be assigned to Alice",
        bookingUid: "booking-uid",
        correctAssignee: "alice@example.com",
      },
    });
    expect(mockGetBookingHistoryHandler).toHaveBeenCalledWith({
      ctx,
      input: { bookingUid: "booking-uid" },
    });
    expect(mockGetRoutingTraceHandler).toHaveBeenCalledWith({
      ctx,
      input: { bookingUid: "booking-uid" },
    });
  });

  it("injects the booking actor and action source when confirming a booking", async () => {
    mockConfirmHandler.mockResolvedValue({ success: true });

    await expect(
      caller.confirm({
        bookingId: 42,
        confirmed: true,
      })
    ).resolves.toEqual({ success: true });

    expect(mockMakeUserActor).toHaveBeenCalledWith("user-uuid");
    expect(mockConfirmHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        actionSource: "WEBAPP",
        actor: {
          id: "user-uuid",
          type: "user",
        },
        bookingId: 42,
        confirmed: true,
        emailsEnabled: true,
      },
    });
  });

  it("authorizes editLocation via team admin access and forwards the enriched booking context", async () => {
    const accessibleBooking = createBookingAccessContext();
    mockPrismaBookingFindFirst.mockResolvedValueOnce(accessibleBooking);
    mockEditLocationHandler.mockResolvedValue({ success: true });

    await expect(
      caller.editLocation({
        bookingId: 99,
        credentialId: null,
        newLocation: "integrations:daily",
      })
    ).resolves.toEqual({ success: true });

    expect(mockPrismaBookingFindFirst).toHaveBeenCalledTimes(1);
    expect(mockEditLocationHandler).toHaveBeenCalledWith({
      actionSource: "WEBAPP",
      ctx: expect.objectContaining({
        booking: accessibleBooking,
      }),
      input: {
        bookingId: 99,
        credentialId: null,
        newLocation: "integrations:daily",
      },
    });
  });

  it("falls back to organizer or collective-member booking access when admin access is absent", async () => {
    const accessibleBooking = createBookingAccessContext();
    mockPrismaBookingFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(accessibleBooking);
    mockEditLocationHandler.mockResolvedValue({ success: true });

    await expect(
      caller.editLocation({
        bookingId: 99,
        credentialId: null,
        newLocation: "integrations:daily",
      })
    ).resolves.toEqual({ success: true });

    expect(mockPrismaBookingFindFirst).toHaveBeenCalledTimes(2);
    expect(mockEditLocationHandler).toHaveBeenCalledWith({
      actionSource: "WEBAPP",
      ctx: expect.objectContaining({
        booking: accessibleBooking,
      }),
      input: {
        bookingId: 99,
        credentialId: null,
        newLocation: "integrations:daily",
      },
    });
  });

  it("rejects editLocation when the user cannot access the booking", async () => {
    mockPrismaBookingFindFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const rejection = caller.editLocation({
      bookingId: 99,
      credentialId: null,
      newLocation: "integrations:daily",
    });

    await expect(rejection).rejects.toBeInstanceOf(TRPCError);
    await expect(rejection).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });

    expect(mockEditLocationHandler).not.toHaveBeenCalled();
  });
});
