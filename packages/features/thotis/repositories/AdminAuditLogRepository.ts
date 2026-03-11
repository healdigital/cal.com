import prisma from "@calcom/prisma";
import type { Prisma, PrismaClient } from "@calcom/prisma/client";
import type { ThotisAdminAuditAction } from "@calcom/prisma/enums";

const adminAuditLogSelect: Prisma.ThotisAdminAuditLogSelect = {
  id: true,
  adminUserId: true,
  adminUserName: true,
  adminUserEmail: true,
  action: true,
  resourceType: true,
  resourceId: true,
  resourceDisplayName: true,
  metadata: true,
  createdAt: true,
};

type AdminAuditLogRecord = Prisma.ThotisAdminAuditLogGetPayload<{
  select: typeof adminAuditLogSelect;
}>;

type CreateAdminAuditLogInput = {
  adminUserId: number;
  adminUserName?: string | null;
  adminUserEmail?: string | null;
  action: ThotisAdminAuditAction;
  resourceType: Prisma.ThotisAdminAuditLogCreateInput["resourceType"];
  resourceId: string;
  resourceDisplayName?: string | null;
  metadata?: Prisma.InputJsonValue;
};

type ListAdminAuditLogsInput = {
  action?: ThotisAdminAuditAction;
  page?: number;
  pageSize?: number;
};

interface ListAdminAuditLogsResult {
  logs: AdminAuditLogRecord[];
  page: number;
  pageSize: number;
  total: number;
}

class AdminAuditLogRepository {
  private prismaClient: PrismaClient;

  constructor(deps?: { prismaClient?: PrismaClient }) {
    this.prismaClient = deps?.prismaClient || prisma;
  }

  async createLog(data: CreateAdminAuditLogInput): Promise<AdminAuditLogRecord> {
    return this.prismaClient.thotisAdminAuditLog.create({
      data: {
        adminUserId: data.adminUserId,
        adminUserName: data.adminUserName,
        adminUserEmail: data.adminUserEmail,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        resourceDisplayName: data.resourceDisplayName,
        metadata: data.metadata,
      },
      select: adminAuditLogSelect,
    });
  }

  async listLogs(filters: ListAdminAuditLogsInput): Promise<ListAdminAuditLogsResult> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ThotisAdminAuditLogWhereInput = {};

    if (filters.action) {
      where.action = filters.action;
    }

    const [logs, total] = await Promise.all([
      this.prismaClient.thotisAdminAuditLog.findMany({
        where,
        select: adminAuditLogSelect,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      this.prismaClient.thotisAdminAuditLog.count({ where }),
    ]);

    return {
      logs,
      total,
      page,
      pageSize,
    };
  }
}

export { AdminAuditLogRepository };
export type { AdminAuditLogRecord, ListAdminAuditLogsInput, ListAdminAuditLogsResult };
