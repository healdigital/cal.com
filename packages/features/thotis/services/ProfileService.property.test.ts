import { AcademicField, MentorStatus } from "@calcom/prisma/enums";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RedisService } from "../../redis/RedisService";
import type { ProfileRepository } from "../repositories/ProfileRepository";
import { ProfileService } from "./ProfileService";

type ProfileRepositoryMock = Pick<
  ProfileRepository,
  "createProfile" | "getProfileByUserId" | "searchProfiles" | "getProfilesByField"
>;

const createProfileRecord = () => ({
  id: "profile-1",
  userId: 42,
  university: "Test University",
  degree: "Bachelor",
  field: "AUTRE",
  expertise: ["React"],
  currentYear: 3,
  bio: "I mentor students on orientation and careers.",
  profilePhotoUrl: "https://cdn.example.com/avatar.jpg",
  linkedInUrl: null,
  isActive: true,
  status: MentorStatus.VERIFIED,
  totalSessions: 8,
  completedSessions: 6,
  cancelledSessions: 1,
  averageRating: 4.8,
  totalRatings: 4,
  timezone: "Europe/Paris",
  marketingConsent: true,
  createdAt: new Date("2026-01-01T10:00:00.000Z"),
  updatedAt: new Date("2026-01-02T10:00:00.000Z"),
  user: {
    name: "Mentor Name",
    username: "mentor-name",
    avatarUrl: null,
    profiles: [],
  },
});

describe("ProfileService", () => {
  let repositoryMock: ProfileRepositoryMock;
  let redisMock: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
  };
  let service: ProfileService;

  beforeEach(() => {
    repositoryMock = {
      createProfile: vi.fn(),
      getProfileByUserId: vi.fn(),
      getProfilesByField: vi.fn(),
      searchProfiles: vi.fn(),
    };
    redisMock = {
      get: vi.fn(),
      set: vi.fn(),
    };

    service = new ProfileService(
      repositoryMock as unknown as ProfileRepository,
      redisMock as unknown as RedisService
    );
  });

  it("normalizes profile photo URLs before persisting the profile", async () => {
    vi.mocked(repositoryMock.createProfile).mockResolvedValue(createProfileRecord() as never);

    await service.createProfile({
      userId: 42,
      fieldOfStudy: AcademicField.COMPUTER_SCIENCE,
      yearOfStudy: 3,
      bio: "I mentor students on orientation and careers.",
      university: "Test University",
      degree: "Bachelor",
      profilePhotoUrl: "cdn.example.com/avatar.jpg",
      expertise: ["React"],
    });

    expect(repositoryMock.createProfile).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        profilePhotoUrl: "https://cdn.example.com/avatar.jpg",
      })
    );
  });

  it("maps the public search filters to repository filters", async () => {
    vi.mocked(redisMock.get).mockResolvedValue(null);
    vi.mocked(repositoryMock.searchProfiles).mockResolvedValue({
      profiles: [createProfileRecord()],
      total: 1,
      page: 2,
      pageSize: 10,
    } as never);

    const result = await service.searchProfiles({
      fieldOfStudy: AcademicField.COMPUTER_SCIENCE,
      university: "Test University",
      minRating: 4,
      page: 2,
      pageSize: 10,
      query: "mentor",
      sort: "rating",
    });

    expect(repositoryMock.searchProfiles).toHaveBeenCalledWith({
      query: "mentor",
      field: AcademicField.COMPUTER_SCIENCE,
      expertise: undefined,
      university: "Test University",
      minRating: 4,
      page: 2,
      pageSize: 10,
      sort: "rating",
    });
    expect(result.total).toBe(1);
    expect(redisMock.set).toHaveBeenCalled();
  });

  it("flags a profile as incomplete when a required field is missing", () => {
    const incompleteProfile = {
      ...createProfileRecord(),
      university: null,
    };

    expect(
      service.isProfileComplete(
        incompleteProfile as unknown as NonNullable<
          Awaited<ReturnType<ProfileRepository["getProfileByUserId"]>>
        >
      )
    ).toBe(false);
  });
});
