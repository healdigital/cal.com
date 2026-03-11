import type { PrismaClient } from "@calcom/prisma";
import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

type EventTypesRouterMocks = {
  mockBulkEventFetchHandler: Mock;
  mockBulkUpdateToDefaultLocationHandler: Mock;
  mockCheckPermission: Mock;
  mockDeleteHandler: Mock;
  mockEventTypeFindUnique: Mock;
  mockGetActiveOnOptionsHandler: Mock;
  mockGetByViewerHandler: Mock;
  mockGetEventTypesFromGroupHandler: Mock;
  mockGetHandler: Mock;
  mockGetHashedLinkHandler: Mock;
  mockGetHashedLinksHandler: Mock;
  mockGetHostsWithLocationOptionsHandler: Mock;
  mockGetUserEventGroupsHandler: Mock;
  mockListHandler: Mock;
  mockListWithTeamHandler: Mock;
  mockLogP: Mock;
  mockMassApplyHostLocationHandler: Mock;
  mockStopTimer: Mock;
};

const {
  mockBulkEventFetchHandler,
  mockBulkUpdateToDefaultLocationHandler,
  mockCheckPermission,
  mockDeleteHandler,
  mockEventTypeFindUnique,
  mockGetActiveOnOptionsHandler,
  mockGetByViewerHandler,
  mockGetEventTypesFromGroupHandler,
  mockGetHandler,
  mockGetHashedLinkHandler,
  mockGetHashedLinksHandler,
  mockGetHostsWithLocationOptionsHandler,
  mockGetUserEventGroupsHandler,
  mockListHandler,
  mockListWithTeamHandler,
  mockLogP,
  mockMassApplyHostLocationHandler,
  mockStopTimer,
}: EventTypesRouterMocks = vi.hoisted(
  (): EventTypesRouterMocks => ({
    mockBulkEventFetchHandler: vi.fn(),
    mockBulkUpdateToDefaultLocationHandler: vi.fn(),
    mockCheckPermission: vi.fn(),
    mockDeleteHandler: vi.fn(),
    mockEventTypeFindUnique: vi.fn(),
    mockGetActiveOnOptionsHandler: vi.fn(),
    mockGetByViewerHandler: vi.fn(),
    mockGetEventTypesFromGroupHandler: vi.fn(),
    mockGetHandler: vi.fn(),
    mockGetHashedLinkHandler: vi.fn(),
    mockGetHashedLinksHandler: vi.fn(),
    mockGetHostsWithLocationOptionsHandler: vi.fn(),
    mockGetUserEventGroupsHandler: vi.fn(),
    mockListHandler: vi.fn(),
    mockListWithTeamHandler: vi.fn(),
    mockLogP: vi.fn(),
    mockMassApplyHostLocationHandler: vi.fn(),
    mockStopTimer: vi.fn(),
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

vi.mock("@calcom/lib/perf", () => ({
  logP: mockLogP,
}));

vi.mock("@calcom/features/pbac/services/permission-check.service", () => ({
  PermissionCheckService: class PermissionCheckService {
    checkPermission = mockCheckPermission;
  },
}));

vi.mock("./getByViewer.handler", () => ({
  getByViewerHandler: mockGetByViewerHandler,
}));

vi.mock("./getUserEventGroups.handler", () => ({
  getUserEventGroups: mockGetUserEventGroupsHandler,
}));

vi.mock("./getEventTypesFromGroup.handler", () => ({
  getEventTypesFromGroup: mockGetEventTypesFromGroupHandler,
}));

vi.mock("./getActiveOnOptions.handler", () => ({
  getActiveOnOptions: mockGetActiveOnOptionsHandler,
}));

vi.mock("./list.handler", () => ({
  listHandler: mockListHandler,
}));

vi.mock("./listWithTeam.handler", () => ({
  listWithTeamHandler: mockListWithTeamHandler,
}));

vi.mock("./delete.handler", () => ({
  deleteHandler: mockDeleteHandler,
}));

vi.mock("./bulkEventFetch.handler", () => ({
  bulkEventFetchHandler: mockBulkEventFetchHandler,
}));

vi.mock("./bulkUpdateToDefaultLocation.handler", () => ({
  bulkUpdateToDefaultLocationHandler: mockBulkUpdateToDefaultLocationHandler,
}));

vi.mock("./getHashedLink.handler", () => ({
  getHashedLinkHandler: mockGetHashedLinkHandler,
}));

vi.mock("./getHashedLinks.handler", () => ({
  getHashedLinksHandler: mockGetHashedLinksHandler,
}));

vi.mock("./getHostsWithLocationOptions.handler", () => ({
  getHostsWithLocationOptionsHandler: mockGetHostsWithLocationOptionsHandler,
}));

vi.mock("./massApplyHostLocation.handler", () => ({
  massApplyHostLocationHandler: mockMassApplyHostLocationHandler,
}));

vi.mock("./get.handler", () => ({
  getHandler: mockGetHandler,
}));

import { eventTypesRouter } from "./_router";

type EventTypesCaller = ReturnType<typeof eventTypesRouter.createCaller>;
type EventTypesCallerContext = Parameters<typeof eventTypesRouter.createCaller>[0];

const createMockContext = (): EventTypesCallerContext =>
  ({
    locale: "en",
    prisma: {
      eventType: {
        findUnique: mockEventTypeFindUnique,
      },
    } as unknown as PrismaClient,
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
      organization: {
        isOrgAdmin: false,
      },
      profile: {
        organizationId: null,
      },
      username: "owner",
    },
  }) as unknown as EventTypesCallerContext;

describe("eventTypesRouter", () => {
  let caller: EventTypesCaller;
  let ctx: EventTypesCallerContext;

  beforeEach(() => {
    vi.clearAllMocks();

    ctx = createMockContext();
    caller = eventTypesRouter.createCaller(ctx);

    mockLogP.mockReturnValue(mockStopTimer);
    mockEventTypeFindUnique.mockImplementation(async ({ where }: { where: { id: number } }) => {
      if (where.id === 11) {
        return {
          id: 11,
          team: null,
          teamId: null,
          userId: 1,
          users: [],
        };
      }

      return {
        id: 22,
        team: {
          members: [{ userId: 1 }],
        },
        teamId: 8,
        userId: 99,
        users: [],
      };
    });
  });

  it("routes non-PBAC procedures to their handlers and closes perf timers", async () => {
    mockGetByViewerHandler.mockResolvedValue({ eventTypeGroups: [] });
    mockGetUserEventGroupsHandler.mockResolvedValue({ eventTypeGroups: [], profiles: [] });
    mockGetEventTypesFromGroupHandler.mockResolvedValue({ eventTypes: [], nextCursor: null });
    mockGetActiveOnOptionsHandler.mockResolvedValue({ options: [] });
    mockListHandler.mockResolvedValue({ eventTypes: [] });
    mockListWithTeamHandler.mockResolvedValue({ eventTypes: [] });
    mockBulkEventFetchHandler.mockResolvedValue({ eventTypes: [] });
    mockBulkUpdateToDefaultLocationHandler.mockResolvedValue({ updated: 2 });
    mockGetHashedLinkHandler.mockResolvedValue({ link: "hash-1" });
    mockGetHashedLinksHandler.mockResolvedValue({ links: [] });

    await expect(
      caller.getByViewer({
        filters: { teamIds: [8] },
        forRoutingForms: true,
      })
    ).resolves.toEqual({ eventTypeGroups: [] });
    await expect(
      caller.getUserEventGroups({
        filters: { teamIds: [8] },
      })
    ).resolves.toEqual({ eventTypeGroups: [], profiles: [] });
    await expect(
      caller.getEventTypesFromGroup({
        group: { parentId: null, teamId: 8 },
        searchQuery: "demo",
      })
    ).resolves.toEqual({ eventTypes: [], nextCursor: null });
    await expect(caller.getActiveOnOptions({ teamId: 8 })).resolves.toEqual({ options: [] });
    await expect(caller.list()).resolves.toEqual({ eventTypes: [] });
    await expect(caller.listWithTeam()).resolves.toEqual({ eventTypes: [] });
    await expect(caller.bulkEventFetch()).resolves.toEqual({ eventTypes: [] });
    await expect(caller.bulkUpdateToDefaultLocation({ eventTypeIds: [1, 2] })).resolves.toEqual({
      updated: 2,
    });
    await expect(caller.getHashedLink({ linkId: "link-1" })).resolves.toEqual({ link: "hash-1" });
    await expect(caller.getHashedLinks({ linkIds: ["link-1", "link-2"] })).resolves.toEqual({
      links: [],
    });

    expect(mockGetByViewerHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        filters: { teamIds: [8] },
        forRoutingForms: true,
      },
    });
    expect(mockGetUserEventGroupsHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        filters: { teamIds: [8] },
      },
    });
    expect(mockGetEventTypesFromGroupHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        group: { parentId: null, teamId: 8 },
        limit: 10,
        searchQuery: "demo",
      },
    });
    expect(mockGetActiveOnOptionsHandler).toHaveBeenCalledWith({
      ctx,
      input: { isOrg: false, teamId: 8 },
    });
    expect(mockListHandler).toHaveBeenCalledWith({ ctx });
    expect(mockListWithTeamHandler).toHaveBeenCalledWith({ ctx });
    expect(mockBulkEventFetchHandler).toHaveBeenCalledWith({ ctx });
    expect(mockBulkUpdateToDefaultLocationHandler).toHaveBeenCalledWith({
      ctx,
      input: { eventTypeIds: [1, 2] },
    });
    expect(mockGetHashedLinkHandler).toHaveBeenCalledWith({
      ctx,
      input: { linkId: "link-1" },
    });
    expect(mockGetHashedLinksHandler).toHaveBeenCalledWith({
      ctx,
      input: { linkIds: ["link-1", "link-2"] },
    });

    expect(mockLogP).toHaveBeenCalledWith("getByViewer(1)");
    expect(mockLogP).toHaveBeenCalledWith("getUserEventGroups(1)");
    expect(mockLogP).toHaveBeenCalledWith("getEventTypesFromGroup(1)");
    expect(mockLogP).toHaveBeenCalledWith("getActiveOnOptions(1)");
    expect(mockStopTimer).toHaveBeenCalledTimes(4);
  });

  it("allows personal-event reads without PBAC and forwards the handler call", async () => {
    mockGetHandler.mockResolvedValue({ id: 11 });

    await expect(caller.get({ id: 11 })).resolves.toEqual({ id: 11 });

    expect(mockEventTypeFindUnique).toHaveBeenCalledWith({
      select: {
        id: true,
        team: {
          select: {
            members: {
              select: {
                userId: true,
              },
            },
          },
        },
        teamId: true,
        userId: true,
        users: {
          select: {
            id: true,
          },
        },
      },
      where: { id: 11 },
    });
    expect(mockCheckPermission).not.toHaveBeenCalled();
    expect(mockGetHandler).toHaveBeenCalledWith({
      ctx,
      input: { id: 11 },
    });
  });

  it("checks PBAC permissions for team-event mutations before calling the handler", async () => {
    mockCheckPermission.mockResolvedValue(true);
    mockDeleteHandler.mockResolvedValue({ success: true });
    mockMassApplyHostLocationHandler.mockResolvedValue({ updated: 5 });

    await expect(caller.delete({ id: 22 })).resolves.toEqual({ success: true });
    await expect(
      caller.massApplyHostLocation({
        eventTypeId: 22,
        link: "https://meet.example.com/demo",
        locationType: "integrations:daily",
      })
    ).resolves.toEqual({ updated: 5 });

    expect(mockCheckPermission).toHaveBeenCalledWith({
      fallbackRoles: ["ADMIN", "OWNER"],
      permission: "eventType.delete",
      teamId: 8,
      userId: 1,
    });
    expect(mockCheckPermission).toHaveBeenCalledWith({
      fallbackRoles: ["ADMIN", "OWNER"],
      permission: "eventType.update",
      teamId: 8,
      userId: 1,
    });
    expect(mockDeleteHandler).toHaveBeenCalledWith({
      ctx,
      input: { id: 22 },
    });
    expect(mockMassApplyHostLocationHandler).toHaveBeenCalledWith({
      ctx,
      input: {
        eventTypeId: 22,
        link: "https://meet.example.com/demo",
        locationType: "integrations:daily",
      },
    });
  });

  it("rejects team-event queries when PBAC denies access", async () => {
    mockCheckPermission.mockResolvedValue(false);

    const rejection = caller.getHostsWithLocationOptions({
      eventTypeId: 22,
    });

    await expect(rejection).rejects.toBeInstanceOf(TRPCError);
    await expect(rejection).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Permission required: eventType.update",
    });

    expect(mockGetHostsWithLocationOptionsHandler).not.toHaveBeenCalled();
  });
});
