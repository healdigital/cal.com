import {
  clampThotisPageSize,
  THOTIS_ADMIN_PAGE_SIZE_MAX,
} from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import prisma from "@calcom/prisma";
import type { Prisma, PrismaClient } from "@calcom/prisma/client";
import type { MentorIncidentType, MentorModerationActionType } from "@calcom/prisma/enums";

export class MentorQualityRepository {
  private prismaClient: PrismaClient;

  constructor(deps?: { prismaClient?: PrismaClient }) {
    this.prismaClient = deps?.prismaClient || prisma;
  }

  /**
   * List quality incidents with pagination and filters
   */
  async listIncidents(filters: {
    page?: number;
    pageSize?: number;
    studentProfileId?: string;
    type?: MentorIncidentType;
    resolved?: boolean;
  }) {
    const page = filters.page || 1;
    const pageSize = clampThotisPageSize(filters.pageSize, {
      fallback: 10,
      max: THOTIS_ADMIN_PAGE_SIZE_MAX,
    });
    const skip = (page - 1) * pageSize;

    const where: Prisma.MentorQualityIncidentWhereInput = {};
    if (filters.studentProfileId) where.studentProfileId = filters.studentProfileId;
    if (filters.type) where.type = filters.type;
    if (filters.resolved !== undefined) where.resolved = filters.resolved;

    const [incidents, total] = await Promise.all([
      this.prismaClient.mentorQualityIncident.findMany({
        where,
        select: {
          id: true,
          studentProfileId: true,
          reportedByUserId: true,
          bookingUid: true,
          type: true,
          description: true,
          severity: true,
          resolved: true,
          resolvedAt: true,
          createdAt: true,
          updatedAt: true,
          studentProfile: {
            select: {
              id: true,
              university: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          reportedByUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.prismaClient.mentorQualityIncident.count({ where }),
    ]);

    return { incidents, total, page, pageSize };
  }

  /**
   * Get an incident by ID
   */
  async getIncidentById(id: string) {
    return this.prismaClient.mentorQualityIncident.findUnique({
      where: { id },
      select: {
        id: true,
        studentProfileId: true,
        reportedByUserId: true,
        bookingUid: true,
        type: true,
        description: true,
        severity: true,
        resolved: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: {
          select: {
            id: true,
            userId: true,
            university: true,
            degree: true,
            field: true,
            isActive: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Update an incident (e.g., mark as resolved)
   */
  async updateIncident(id: string, data: Prisma.MentorQualityIncidentUpdateInput) {
    return this.prismaClient.mentorQualityIncident.update({
      where: { id },
      data,
    });
  }

  /**
   * Create a moderation action
   */
  async createModerationAction(data: {
    studentProfileId: string;
    actionByUserId: number;
    actionType: MentorModerationActionType;
    reason?: string;
  }) {
    return this.prismaClient.mentorModerationAction.create({
      data,
    });
  }

  /**
   * List moderation actions for a profile
   */
  async listModerationActions(studentProfileId: string) {
    return this.prismaClient.mentorModerationAction.findMany({
      where: { studentProfileId },
      select: {
        id: true,
        studentProfileId: true,
        actionByUserId: true,
        actionType: true,
        reason: true,
        createdAt: true,
        actionByUser: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
