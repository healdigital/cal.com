import dayjs from "@calcom/dayjs";
import type { PrismaClient } from "@calcom/prisma";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

type AvailabilityRouterMocks = {
  mockBulkUpdateToDefaultAvailabilityHandler: Mock;
  mockCalendarOverlayHandler: Mock;
  mockCreateScheduleHandler: Mock;
  mockDeleteScheduleHandler: Mock;
  mockDuplicateScheduleHandler: Mock;
  mockGetAllSchedulesByUserIdHandler: Mock;
  mockGetScheduleByEventSlugHandler: Mock;
  mockGetScheduleByUserIdHandler: Mock;
  mockGetScheduleHandler: Mock;
  mockListHandler: Mock;
  mockListTeamAvailabilityHandler: Mock;
  mockUpdateScheduleHandler: Mock;
  mockUserHandler: Mock;
};

const {
  mockBulkUpdateToDefaultAvailabilityHandler,
  mockCalendarOverlayHandler,
  mockCreateScheduleHandler,
  mockDeleteScheduleHandler,
  mockDuplicateScheduleHandler,
  mockGetAllSchedulesByUserIdHandler,
  mockGetScheduleByEventSlugHandler,
  mockGetScheduleByUserIdHandler,
  mockGetScheduleHandler,
  mockListHandler,
  mockListTeamAvailabilityHandler,
  mockUpdateScheduleHandler,
  mockUserHandler,
}: AvailabilityRouterMocks = vi.hoisted(
  (): AvailabilityRouterMocks => ({
    mockBulkUpdateToDefaultAvailabilityHandler: vi.fn(),
    mockCalendarOverlayHandler: vi.fn(),
    mockCreateScheduleHandler: vi.fn(),
    mockDeleteScheduleHandler: vi.fn(),
    mockDuplicateScheduleHandler: vi.fn(),
    mockGetAllSchedulesByUserIdHandler: vi.fn(),
    mockGetScheduleByEventSlugHandler: vi.fn(),
    mockGetScheduleByUserIdHandler: vi.fn(),
    mockGetScheduleHandler: vi.fn(),
    mockListHandler: vi.fn(),
    mockListTeamAvailabilityHandler: vi.fn(),
    mockUpdateScheduleHandler: vi.fn(),
    mockUserHandler: vi.fn(),
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

vi.mock("./list.handler", () => ({
  listHandler: mockListHandler,
}));

vi.mock("./user.handler", () => ({
  userHandler: mockUserHandler,
}));

vi.mock("./team/listTeamAvailability.handler", () => ({
  listTeamAvailabilityHandler: mockListTeamAvailabilityHandler,
}));

vi.mock("./calendarOverlay.handler", () => ({
  calendarOverlayHandler: mockCalendarOverlayHandler,
}));

vi.mock("./schedule/get.handler", () => ({
  getHandler: mockGetScheduleHandler,
}));

vi.mock("./schedule/create.handler", () => ({
  createHandler: mockCreateScheduleHandler,
}));

vi.mock("./schedule/delete.handler", () => ({
  deleteHandler: mockDeleteScheduleHandler,
}));

vi.mock("./schedule/update.handler", () => ({
  updateHandler: mockUpdateScheduleHandler,
}));

vi.mock("./schedule/duplicate.handler", () => ({
  duplicateHandler: mockDuplicateScheduleHandler,
}));

vi.mock("./schedule/getScheduleByUserId.handler", () => ({
  getScheduleByUserIdHandler: mockGetScheduleByUserIdHandler,
}));

vi.mock("./schedule/getAllSchedulesByUserId.handler", () => ({
  getAllSchedulesByUserIdHandler: mockGetAllSchedulesByUserIdHandler,
}));

vi.mock("./schedule/getScheduleByEventTypeSlug.handler", () => ({
  getScheduleByEventSlugHandler: mockGetScheduleByEventSlugHandler,
}));

vi.mock("./schedule/bulkUpdateDefaultAvailability.handler", () => ({
  bulkUpdateToDefaultAvailabilityHandler: mockBulkUpdateToDefaultAvailabilityHandler,
}));

import { availabilityRouter } from "./_router";

type AvailabilityCaller = ReturnType<typeof availabilityRouter.createCaller>;
type AvailabilityCallerContext = Parameters<typeof availabilityRouter.createCaller>[0];

const createMockContext = (): AvailabilityCallerContext =>
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
      email: "owner@example.com",
      id: 1,
      locale: "en",
      username: "owner",
    },
  }) as unknown as AvailabilityCallerContext;

describe("availabilityRouter", () => {
  let caller: AvailabilityCaller;
  let ctx: AvailabilityCallerContext;

  beforeEach(() => {
    vi.clearAllMocks();

    ctx = createMockContext();
    caller = availabilityRouter.createCaller(ctx);
  });

  it("routes top-level availability procedures to their handlers", async () => {
    mockListHandler.mockResolvedValue({ schedules: [] });
    mockUserHandler.mockResolvedValue({ slots: [] });
    mockListTeamAvailabilityHandler.mockResolvedValue({ items: [], nextCursor: null });
    mockCalendarOverlayHandler.mockResolvedValue({ busy: [] });

    await expect(caller.list()).resolves.toEqual({ schedules: [] });
    await expect(
      caller.user({
        dateFrom: "2026-01-01T00:00:00.000Z",
        dateTo: "2026-01-02T00:00:00.000Z",
        eventTypeId: 10,
        username: "owner",
        withSource: true,
      })
    ).resolves.toEqual({ slots: [] });
    await expect(
      caller.listTeam({
        cursor: null,
        endDate: "2026-01-31",
        limit: 20,
        loggedInUsersTz: "Europe/Paris",
        searchString: "owner",
        startDate: "2026-01-01",
        teamId: 12,
      })
    ).resolves.toEqual({ items: [], nextCursor: null });
    await expect(
      caller.calendarOverlay({
        calendarsToLoad: [{ credentialId: 1, externalId: "ext-1" }],
        dateFrom: "2026-01-01T00:00:00.000Z",
        dateTo: "2026-01-02T00:00:00.000Z",
        loggedInUsersTz: "Europe/Paris",
      })
    ).resolves.toEqual({ busy: [] });

    expect(mockListHandler).toHaveBeenCalledWith({ ctx });
    expect(mockUserHandler).toHaveBeenCalledWith({
      ctx,
      input: expect.objectContaining({
        eventTypeId: 10,
        username: "owner",
        withSource: true,
      }),
    });
    expect(dayjs.isDayjs(mockUserHandler.mock.calls[0][0].input.dateFrom)).toBe(true);
    expect(dayjs.isDayjs(mockUserHandler.mock.calls[0][0].input.dateTo)).toBe(true);
    expect(mockListTeamAvailabilityHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        cursor: null,
        endDate: "2026-01-31",
        limit: 20,
        loggedInUsersTz: "Europe/Paris",
        searchString: "owner",
        startDate: "2026-01-01",
        teamId: 12,
      },
    });
    expect(mockCalendarOverlayHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        calendarsToLoad: [{ credentialId: 1, externalId: "ext-1" }],
        dateFrom: "2026-01-01T00:00:00.000Z",
        dateTo: "2026-01-02T00:00:00.000Z",
        loggedInUsersTz: "Europe/Paris",
      },
    });
  });

  it("routes nested schedule procedures to their handlers", async () => {
    const baseSchedule = { id: 1, name: "Working Hours" };
    mockGetScheduleHandler.mockResolvedValue(baseSchedule);
    mockCreateScheduleHandler.mockResolvedValue({ id: 2 });
    mockDeleteScheduleHandler.mockResolvedValue({ success: true });
    mockUpdateScheduleHandler.mockResolvedValue({ id: 1, updated: true });
    mockDuplicateScheduleHandler.mockResolvedValue({ id: 3 });
    mockGetScheduleByUserIdHandler.mockResolvedValue({ schedule: baseSchedule });
    mockGetAllSchedulesByUserIdHandler.mockResolvedValue({ schedules: [baseSchedule] });
    mockGetScheduleByEventSlugHandler.mockResolvedValue({ schedule: baseSchedule });
    mockBulkUpdateToDefaultAvailabilityHandler.mockResolvedValue({ updated: 2 });

    await expect(caller.schedule.get({ scheduleId: 1 })).resolves.toEqual(baseSchedule);
    await expect(
      caller.schedule.create({
        name: "Morning",
        schedule: [
          [{ end: new Date("2026-01-01T10:00:00.000Z"), start: new Date("2026-01-01T09:00:00.000Z") }],
        ],
      })
    ).resolves.toEqual({ id: 2 });
    await expect(caller.schedule.delete({ scheduleId: 1 })).resolves.toEqual({ success: true });
    await expect(
      caller.schedule.update({
        isDefault: true,
        name: "Updated",
        scheduleId: 1,
        timeZone: "Europe/Paris",
      })
    ).resolves.toEqual({ id: 1, updated: true });
    await expect(caller.schedule.duplicate({ scheduleId: 1 })).resolves.toEqual({ id: 3 });
    await expect(caller.schedule.getScheduleByUserId({ userId: 1 })).resolves.toEqual({
      schedule: baseSchedule,
    });
    await expect(caller.schedule.getAllSchedulesByUserId({ userId: 1 })).resolves.toEqual({
      schedules: [baseSchedule],
    });
    await expect(caller.schedule.getScheduleByEventSlug({ eventSlug: "demo-event" })).resolves.toEqual({
      schedule: baseSchedule,
    });
    await expect(
      caller.schedule.bulkUpdateToDefaultAvailability({
        eventTypeIds: [1, 2],
        selectedDefaultScheduleId: 4,
      })
    ).resolves.toEqual({ updated: 2 });

    expect(mockGetScheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: { scheduleId: 1 },
    });
    expect(mockCreateScheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        name: "Morning",
        schedule: [
          [{ end: new Date("2026-01-01T10:00:00.000Z"), start: new Date("2026-01-01T09:00:00.000Z") }],
        ],
      },
    });
    expect(mockDeleteScheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: { scheduleId: 1 },
    });
    expect(mockUpdateScheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        isDefault: true,
        name: "Updated",
        scheduleId: 1,
        timeZone: "Europe/Paris",
      },
    });
    expect(mockDuplicateScheduleHandler).toHaveBeenCalledWith({
      ctx,
      input: { scheduleId: 1 },
    });
    expect(mockGetScheduleByUserIdHandler).toHaveBeenCalledWith({
      ctx,
      input: { userId: 1 },
    });
    expect(mockGetAllSchedulesByUserIdHandler).toHaveBeenCalledWith({
      ctx,
      input: { userId: 1 },
    });
    expect(mockGetScheduleByEventSlugHandler).toHaveBeenCalledWith({
      ctx,
      input: { eventSlug: "demo-event" },
    });
    expect(mockBulkUpdateToDefaultAvailabilityHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        eventTypeIds: [1, 2],
        selectedDefaultScheduleId: 4,
      },
    });
  });
});
