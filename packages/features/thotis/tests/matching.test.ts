import { beforeEach, describe, expect, it, vi } from "vitest";
import { THOTIS_MATCHING_REASON_MESSAGES, THOTIS_MATCHING_REASON_PREFIXES } from "../lib/constants";
import type { ProfileRepository, StudentProfileWithUser } from "../repositories/ProfileRepository";
import type { MentorMatchingService, ThotisOrientationIntent } from "../services/MentorMatchingService";
import { ProfileService } from "../services/ProfileService"; // Adjust import path

// Mock ProfileRepository
type MatchingRepositoryMock = Pick<
  ProfileRepository,
  "getProfileByUserId" | "getRecommendedProfilesByIntent" | "getTopRatedProfiles" | "searchProfiles"
>;

type MatchingServiceLike = Pick<MentorMatchingService, "sortMentors">;

const mockRepository: Record<keyof MatchingRepositoryMock, ReturnType<typeof vi.fn>> = {
  searchProfiles: vi.fn(),
  getTopRatedProfiles: vi.fn(),
  getRecommendedProfilesByIntent: vi.fn(),
  getProfileByUserId: vi.fn(),
};

const createMentor = (overrides?: Partial<StudentProfileWithUser>): StudentProfileWithUser =>
  ({
    averageRating: 4.9,
    bio: "Mentor bio",
    cancelledSessions: 0,
    completedSessions: 14,
    createdAt: new Date("2026-01-01T10:00:00.000Z"),
    currentYear: 3,
    degree: "Bachelor",
    expertise: ["React", "Node.js"],
    field: "INFORMATIQUE",
    id: "mentor-1",
    isActive: true,
    marketingConsent: true,
    profilePhotoUrl: null,
    status: "VERIFIED",
    timezone: "Europe/Paris",
    totalRatings: 12,
    totalSessions: 15,
    university: "Test University",
    updatedAt: new Date("2026-01-02T10:00:00.000Z"),
    user: {
      avatarUrl: null,
      name: "Mentor",
      profiles: [],
      username: "mentor",
    },
    userId: 1,
    ...overrides,
  }) as StudentProfileWithUser;

describe("Thotis Matching & Discovery Backend", () => {
  let service: ProfileService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProfileService(mockRepository as unknown as ProfileRepository);
  });

  describe("searchProfiles", () => {
    it("should pass filter parameters correctly to repository", async () => {
      const filters = {
        query: "Computer Science",
        expertise: ["React", "Node.js"],
        sort: "rating" as const,
        minRating: 4,
      };

      const mockResult = {
        profiles: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };

      mockRepository.searchProfiles.mockResolvedValue(mockResult);

      await service.searchProfiles(filters);

      expect(mockRepository.searchProfiles).toHaveBeenCalledWith({
        query: "Computer Science",
        field: undefined,
        expertise: ["React", "Node.js"],
        university: undefined,
        minRating: 4,
        page: undefined,
        pageSize: undefined,
        sort: "rating",
      });
    });

    it("should handle default sort and pagination", async () => {
      const mockResult = {
        profiles: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };

      mockRepository.searchProfiles.mockResolvedValue(mockResult);

      await service.searchProfiles({});

      expect(mockRepository.searchProfiles).toHaveBeenCalledWith({
        query: undefined,
        field: undefined,
        expertise: undefined,
        university: undefined,
        minRating: undefined,
        page: undefined,
        pageSize: undefined,
        sort: undefined,
      });
    });
  });

  describe("Recommendations", () => {
    it("should call getTopRatedProfiles for top mentors", async () => {
      mockRepository.getTopRatedProfiles.mockResolvedValue([]);
      await service.getTopRatedProfiles();
      expect(mockRepository.getTopRatedProfiles).toHaveBeenCalled();
    });

    it("should call getRecommendedProfilesByIntent with intent", async () => {
      const intent = {
        targetFields: ["INFORMATIQUE"],
        academicLevel: "BACHELOR",
        goals: ["React"],
        scheduleConstraints: { preferredTimes: ["weekdays"] },
      };
      mockRepository.getRecommendedProfilesByIntent.mockResolvedValue([]);
      await service.getRecommendedProfilesByIntent(intent);
      expect(mockRepository.getRecommendedProfilesByIntent).toHaveBeenCalledWith(intent);
    });

    it("should delegate mentor scoring to the injected matching service", async () => {
      const intent: ThotisOrientationIntent = {
        targetFields: ["INFORMATIQUE"],
        academicLevel: "BACHELOR",
        goals: ["React"],
      };
      const candidates = [createMentor()];
      const matchingService: MatchingServiceLike = {
        sortMentors: vi.fn().mockReturnValue([
          {
            ...createMentor(),
            matchReasons: [THOTIS_MATCHING_REASON_MESSAGES.fieldMatch],
            matchScore: 98,
          },
        ]),
      };

      mockRepository.getRecommendedProfilesByIntent.mockResolvedValue(candidates);
      service = new ProfileService(
        mockRepository as unknown as ProfileRepository,
        undefined,
        undefined,
        matchingService as unknown as MentorMatchingService
      );

      const result = await service.getRecommendedProfilesByIntent(intent);

      expect(matchingService.sortMentors).toHaveBeenCalledWith(candidates, intent);
      expect(result[0]?.matchScore).toBe(98);
      expect(result[0]?.matchReasons).toEqual([THOTIS_MATCHING_REASON_MESSAGES.fieldMatch]);
    });
  });

  describe("MentorMatchingService", () => {
    it("should score mentor higher with goal match", async () => {
      const { MentorMatchingService } = await import("../services/MentorMatchingService");
      const matchingService = new MentorMatchingService();

      const mentorBase = createMentor();

      const intentWithGoal: ThotisOrientationIntent = {
        targetFields: ["INFORMATIQUE"],
        goals: ["React"],
        scheduleConstraints: { preferredTimes: ["weekdays"] },
        academicLevel: "BACHELOR",
      };

      const intentWithoutGoal: ThotisOrientationIntent = {
        targetFields: ["INFORMATIQUE"],
        goals: ["Law"],
        scheduleConstraints: { preferredTimes: ["weekdays"] },
        academicLevel: "BACHELOR",
      };

      const scoredWithGoal = matchingService.scoreMentor(mentorBase, intentWithGoal);
      const scoredWithoutGoal = matchingService.scoreMentor(mentorBase, intentWithoutGoal);

      expect(scoredWithGoal.matchScore).toBeGreaterThan(scoredWithoutGoal.matchScore);
      expect(scoredWithGoal.matchReasons).toContain(THOTIS_MATCHING_REASON_MESSAGES.goalExpertise(["React"]));
    });

    it("should deduplicate repeated goal matches and keep the reason stable", async () => {
      const { MentorMatchingService } = await import("../services/MentorMatchingService");
      const matchingService = new MentorMatchingService();
      const mentor = createMentor({ expertise: ["React", "React Native"] });

      const scored = matchingService.scoreMentor(mentor, {
        academicLevel: "BACHELOR",
        goals: ["React", "React"],
        targetFields: ["INFORMATIQUE"],
      });

      expect(scored.matchReasons).toContain(THOTIS_MATCHING_REASON_MESSAGES.goalExpertise(["React"]));
      expect(
        scored.matchReasons.filter((reason: string) =>
          reason.startsWith(THOTIS_MATCHING_REASON_PREFIXES.goalExpertise)
        )
      ).toHaveLength(1);
    });

    it("should trim and normalize target fields before scoring", async () => {
      const { MentorMatchingService } = await import("../services/MentorMatchingService");
      const matchingService = new MentorMatchingService();

      const scored = matchingService.scoreMentor(createMentor(), {
        academicLevel: "BACHELOR",
        goals: [],
        targetFields: [" informatique "],
      });

      expect(scored.matchReasons).toContain(THOTIS_MATCHING_REASON_MESSAGES.fieldMatch);
    });

    it("should use rating and session history as deterministic tiebreakers", async () => {
      const { MentorMatchingService } = await import("../services/MentorMatchingService");
      const matchingService = new MentorMatchingService();
      const lowerRatedMentor = createMentor({
        averageRating: 4.6,
        completedSessions: 8,
        id: "mentor-1",
        totalRatings: 8,
      });
      const higherRatedMentor = createMentor({
        averageRating: 4.9,
        completedSessions: 15,
        id: "mentor-2",
        totalRatings: 20,
      });

      const [topMentor] = matchingService.sortMentors([lowerRatedMentor, higherRatedMentor], {
        academicLevel: "BACHELOR",
        goals: [],
        targetFields: ["LAW"],
      });

      expect(topMentor.id).toBe("mentor-2");
    });
  });
});
