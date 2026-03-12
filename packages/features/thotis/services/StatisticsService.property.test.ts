import type { PrismaClient } from "@calcom/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RedisService } from "../../redis/RedisService";
import type { ProfileRepository } from "../repositories/ProfileRepository";
import type { SessionRatingRepository } from "../repositories/SessionRatingRepository";
import { StatisticsService } from "./StatisticsService";
import type { ThotisAnalyticsService } from "./ThotisAnalyticsService";

type StatisticsPrismaMock = Pick<PrismaClient, "$transaction" | "sessionRating" | "studentProfile">;

describe("StatisticsService", () => {
  let profileRepositoryMock: Pick<
    ProfileRepository,
    | "getBookingTrends"
    | "getFieldDistribution"
    | "getPlatformAggregates"
    | "getProfileByUserId"
    | "updateStatistics"
  >;
  let ratingRepositoryMock: Pick<SessionRatingRepository, "getAverageRating">;
  let analyticsServiceMock: Pick<ThotisAnalyticsService, "getDataQualityMetrics" | "getFunnelData">;
  let redisMock: Pick<RedisService, "del" | "get" | "set">;
  let prismaMock: StatisticsPrismaMock;
  let transactionClient: {
    sessionRating: {
      aggregate: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
    studentProfile: {
      update: ReturnType<typeof vi.fn>;
    };
  };
  let service: StatisticsService;

  beforeEach(() => {
    transactionClient = {
      sessionRating: {
        aggregate: vi.fn(),
        create: vi.fn(),
      },
      studentProfile: {
        update: vi.fn(),
      },
    };

    prismaMock = {
      $transaction: vi.fn(async (callback) => await callback(transactionClient as never)),
      sessionRating: transactionClient.sessionRating as never,
      studentProfile: transactionClient.studentProfile as never,
    };

    profileRepositoryMock = {
      getBookingTrends: vi.fn(),
      getFieldDistribution: vi.fn(),
      getPlatformAggregates: vi.fn(),
      getProfileByUserId: vi.fn(),
      updateStatistics: vi.fn(),
    };

    ratingRepositoryMock = {
      getAverageRating: vi.fn(),
    };

    analyticsServiceMock = {
      getDataQualityMetrics: vi.fn(),
      getFunnelData: vi.fn(),
    };

    redisMock = {
      del: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    };

    service = new StatisticsService(
      profileRepositoryMock as unknown as ProfileRepository,
      ratingRepositoryMock as unknown as SessionRatingRepository,
      analyticsServiceMock as unknown as ThotisAnalyticsService,
      redisMock as unknown as RedisService,
      prismaMock
    );
  });

  it("returns cached student stats when available", async () => {
    vi.mocked(redisMock.get).mockResolvedValue({
      totalSessions: 5,
      completedSessions: 4,
      cancelledSessions: 1,
      averageRating: 4.7,
      totalRatings: 3,
    });

    const result = await service.getStudentStats(42);

    expect(result).toEqual({
      totalSessions: 5,
      completedSessions: 4,
      cancelledSessions: 1,
      averageRating: 4.7,
      totalRatings: 3,
    });
    expect(profileRepositoryMock.getProfileByUserId).not.toHaveBeenCalled();
  });

  it("increments the requested session counter and invalidates the cache", async () => {
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue({
      id: "profile-1",
      totalSessions: 2,
      completedSessions: 1,
      cancelledSessions: 0,
    } as never);

    await service.updateSessionCount(42, "completed");

    expect(profileRepositoryMock.updateStatistics).toHaveBeenCalledWith("profile-1", {
      completedSessions: 2,
    });
    expect(redisMock.del).toHaveBeenCalledWith("stats:student:42");
    expect(redisMock.del).toHaveBeenCalledWith("profile:42");
  });

  it("creates ratings and updates the average in a single transaction", async () => {
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue({
      id: "profile-1",
    } as never);
    vi.mocked(transactionClient.sessionRating.aggregate).mockResolvedValue({
      _avg: {
        rating: 4.26,
      },
    });

    await service.addRating(1001, 42, 5, "Very helpful session", "student@example.com");

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(transactionClient.sessionRating.create).toHaveBeenCalledWith({
      data: {
        bookingId: 1001,
        studentProfileId: "profile-1",
        rating: 5,
        feedback: "Very helpful session",
        prospectiveEmail: "student@example.com",
      },
      select: {
        id: true,
      },
    });
    expect(transactionClient.studentProfile.update).toHaveBeenCalledWith({
      where: {
        id: "profile-1",
      },
      data: {
        averageRating: 4.3,
      },
      select: {
        id: true,
      },
    });
  });

  it("composes platform statistics from repositories and analytics", async () => {
    vi.mocked(profileRepositoryMock.getPlatformAggregates).mockResolvedValue({
      _sum: {
        totalSessions: 10,
        completedSessions: 8,
        cancelledSessions: 2,
        totalRatings: 6,
      },
      _avg: {
        averageRating: 4.5,
      },
      _count: {
        id: 3,
      },
    } as never);
    vi.mocked(profileRepositoryMock.getBookingTrends).mockResolvedValue({
      daily: [],
      weekly: [],
      monthly: [],
    });
    vi.mocked(profileRepositoryMock.getFieldDistribution).mockResolvedValue([]);
    vi.mocked(analyticsServiceMock.getFunnelData).mockResolvedValue({
      counts: {
        booking_confirmed: 2,
        booking_started: 3,
        profile_viewed: 5,
        rating_submitted: 1,
        session_completed: 2,
      },
      conversion: {
        booking_started_to_confirmed: 66.7,
        completed_to_rated: 50,
        confirmed_to_completed: 100,
        overall: 40,
        profile_to_booking_started: 60,
      },
    });
    vi.mocked(analyticsServiceMock.getDataQualityMetrics).mockResolvedValue({
      isValid: true,
      issues: [],
      lastChecked: new Date("2026-03-12T10:00:00.000Z"),
      sampleSize: 2,
      totalIssues: 0,
    });

    const result = await service.getPlatformStats();

    expect(result._sum.totalSessions).toBe(10);
    expect(result._avg.averageRating).toBe(4.5);
    expect(result.funnel.counts.booking_started).toBe(3);
    expect(result.dataQuality.isValid).toBe(true);
  });
});
