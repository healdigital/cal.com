import type { BookingRepository } from "@calcom/features/bookings/repositories/BookingRepository";
import type { ScheduleRepository } from "@calcom/features/schedules/repositories/ScheduleRepository";
import type { SchedulesRepository } from "@calcom/features/schedules/repositories/SchedulesRepository";
import type { UserRepository } from "@calcom/features/users/repositories/UserRepository";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import type { User } from "@calcom/prisma/client";
import { BookingStatus, MentorStatus } from "@calcom/prisma/enums";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MentorQualityRepository } from "../repositories/MentorQualityRepository";
import type { ProfileRepository } from "../repositories/ProfileRepository";
import type { ProfileService } from "./ProfileService";
import { ThotisAdminService } from "./ThotisAdminService";

const createProfileRepositoryMock = () =>
  ({
    getProfile: vi.fn(),
    getProfileByUserId: vi.fn(),
    incrementCancelledSessions: vi.fn(),
    listAdminProfiles: vi.fn(),
    updateProfile: vi.fn(),
  }) as unknown as ProfileRepository;

const createProfileServiceMock = () =>
  ({
    createProfile: vi.fn(),
  }) as unknown as ProfileService;

const createMentorQualityRepositoryMock = () =>
  ({
    createModerationAction: vi.fn(),
    listIncidents: vi.fn(),
    updateIncident: vi.fn(),
  }) as unknown as MentorQualityRepository;

const createUserRepositoryMock = () =>
  ({
    create: vi.fn(),
    findByEmail: vi.fn(),
    findForPasswordReset: vi.fn(),
    findUsersByUsername: vi.fn(),
    getTimeZoneAndDefaultScheduleId: vi.fn(),
  }) as unknown as UserRepository;

const createBookingRepositoryMock = () =>
  ({
    cancelThotisAdminBooking: vi.fn(),
    getThotisAdminBookingDetails: vi.fn(),
    getThotisAdminBookingForCancellation: vi.fn(),
    listThotisAdminBookings: vi.fn(),
    update: vi.fn(),
  }) as unknown as BookingRepository;

const createScheduleRepositoryMock = () =>
  ({
    getDefaultScheduleId: vi.fn(),
    setupDefaultSchedule: vi.fn(),
  }) as unknown as ScheduleRepository;

const createSchedulesRepositoryMock = () =>
  ({
    createScheduleWithAvailability: vi.fn(),
    getScheduleById: vi.fn(),
    replaceAvailability: vi.fn(),
    updateSchedule: vi.fn(),
  }) as unknown as SchedulesRepository;

describe("ThotisAdminService", () => {
  let bookingRepositoryMock: BookingRepository;
  let mentorQualityRepositoryMock: MentorQualityRepository;
  let passwordResetRequestFn: (user: Pick<User, "email" | "locale" | "name">) => Promise<void>;
  let passwordResetRateLimitFn: (identifier: string) => Promise<void>;
  let profileRepositoryMock: ProfileRepository;
  let profileServiceMock: ProfileService;
  let scheduleRepositoryMock: ScheduleRepository;
  let schedulesRepositoryMock: SchedulesRepository;
  let service: ThotisAdminService;
  let userRepositoryMock: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    profileRepositoryMock = createProfileRepositoryMock();
    profileServiceMock = createProfileServiceMock();
    mentorQualityRepositoryMock = createMentorQualityRepositoryMock();
    userRepositoryMock = createUserRepositoryMock();
    bookingRepositoryMock = createBookingRepositoryMock();
    scheduleRepositoryMock = createScheduleRepositoryMock();
    schedulesRepositoryMock = createSchedulesRepositoryMock();
    passwordResetRequestFn = vi.fn().mockResolvedValue(undefined);
    passwordResetRateLimitFn = vi.fn().mockResolvedValue(undefined);

    service = new ThotisAdminService({
      bookingRepository: bookingRepositoryMock,
      mentorQualityRepository: mentorQualityRepositoryMock,
      passwordResetRequestFn,
      passwordResetRateLimitFn,
      profileRepository: profileRepositoryMock,
      profileService: profileServiceMock,
      scheduleRepository: scheduleRepositoryMock,
      schedulesRepository: schedulesRepositoryMock,
      userRepository: userRepositoryMock,
    });
  });

  it("provisions a new ambassador, reuses the default schedule, and sends the password setup email", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepositoryMock.findUsersByUsername).mockResolvedValue([]);
    vi.mocked(userRepositoryMock.create).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      timeZone: "Europe/Paris",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue(null);
    vi.mocked(profileServiceMock.createProfile).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: null,
      timeZone: "Europe/Paris",
    });
    vi.mocked(scheduleRepositoryMock.getDefaultScheduleId).mockResolvedValue(33);
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    const result = await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
    });

    expect(result).toEqual({ id: "profile-1" });
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        completedOnboarding: true,
        email: "mentor@example.com",
        locked: false,
        timeZone: "Europe/Paris",
        username: "mentor",
      })
    );
    expect(profileServiceMock.createProfile).toHaveBeenCalledWith({
      bio: "Helping students",
      degree: "Master",
      fieldOfStudy: "COMPUTER_SCIENCE",
      university: "Sorbonne",
      userId: 10,
      yearOfStudy: 4,
    });
    expect(scheduleRepositoryMock.setupDefaultSchedule).toHaveBeenCalledWith(10, 33);
    expect(passwordResetRequestFn).toHaveBeenCalledWith({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });
    expect(passwordResetRateLimitFn).toHaveBeenCalledWith("thotis:admin:password-reset:10");
  });

  it("creates a fallback default schedule when the user does not have any schedule yet", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      timeZone: "Europe/Paris",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(profileRepositoryMock.updateProfile).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: null,
      timeZone: "Europe/Paris",
    });
    vi.mocked(scheduleRepositoryMock.getDefaultScheduleId).mockRejectedValue(new Error("No schedule"));
    vi.mocked(schedulesRepositoryMock.createScheduleWithAvailability).mockResolvedValue({
      id: 44,
    });
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
    });

    expect(schedulesRepositoryMock.createScheduleWithAvailability).toHaveBeenCalledWith({
      availability: [
        {
          days: [1, 2, 3, 4, 5],
          endTime: new Date("1970-01-01T17:00:00Z"),
          startTime: new Date("1970-01-01T09:00:00Z"),
        },
      ],
      name: "Default Schedule",
      timeZone: "Europe/Paris",
      userId: 10,
    });
    expect(scheduleRepositoryMock.setupDefaultSchedule).toHaveBeenCalledWith(10, 44);
  });

  it("applies a fully custom schedule config when provided", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepositoryMock.findUsersByUsername).mockResolvedValue([]);
    vi.mocked(userRepositoryMock.create).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      locale: "fr",
      name: "Mentor",
      timeZone: "America/New_York",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue(null);
    vi.mocked(profileServiceMock.createProfile).mockResolvedValue({ id: "profile-1" });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: null,
      timeZone: "America/New_York",
    });
    vi.mocked(scheduleRepositoryMock.getDefaultScheduleId).mockRejectedValue(new Error("No schedule"));
    vi.mocked(schedulesRepositoryMock.createScheduleWithAvailability).mockResolvedValue({
      id: 55,
    });
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
      schedule: {
        days: [0, 6],
        startTime: "10:00",
        endTime: "14:00",
        timeZone: "America/New_York",
      },
    });

    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ timeZone: "America/New_York" })
    );
    expect(schedulesRepositoryMock.createScheduleWithAvailability).toHaveBeenCalledWith({
      availability: [
        {
          days: [0, 6],
          endTime: new Date("1970-01-01T14:00:00Z"),
          startTime: new Date("1970-01-01T10:00:00Z"),
        },
      ],
      name: "Default Schedule",
      timeZone: "America/New_York",
      userId: 10,
    });
    expect(scheduleRepositoryMock.setupDefaultSchedule).toHaveBeenCalledWith(10, 55);
  });

  it("merges a partial schedule config with defaults", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepositoryMock.findUsersByUsername).mockResolvedValue([]);
    vi.mocked(userRepositoryMock.create).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      locale: "fr",
      name: "Mentor",
      timeZone: "America/New_York",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue(null);
    vi.mocked(profileServiceMock.createProfile).mockResolvedValue({ id: "profile-1" });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: null,
      timeZone: "America/New_York",
    });
    vi.mocked(scheduleRepositoryMock.getDefaultScheduleId).mockRejectedValue(new Error("No schedule"));
    vi.mocked(schedulesRepositoryMock.createScheduleWithAvailability).mockResolvedValue({
      id: 66,
    });
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
      schedule: {
        timeZone: "America/New_York",
      },
    });

    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ timeZone: "America/New_York" })
    );
    expect(schedulesRepositoryMock.createScheduleWithAvailability).toHaveBeenCalledWith({
      availability: [
        {
          days: [1, 2, 3, 4, 5],
          endTime: new Date("1970-01-01T17:00:00Z"),
          startTime: new Date("1970-01-01T09:00:00Z"),
        },
      ],
      name: "Default Schedule",
      timeZone: "America/New_York",
      userId: 10,
    });
    expect(scheduleRepositoryMock.setupDefaultSchedule).toHaveBeenCalledWith(10, 66);
  });

  it("retries username generation when the base username is already taken", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepositoryMock.findUsersByUsername)
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([]);
    vi.mocked(userRepositoryMock.create).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      locale: "fr",
      name: "Mentor",
      timeZone: "Europe/Paris",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue(null);
    vi.mocked(profileServiceMock.createProfile).mockResolvedValue({ id: "profile-1" });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: 77,
      timeZone: "Europe/Paris",
    });
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
    });

    expect(userRepositoryMock.findUsersByUsername).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: expect.stringMatching(/^mentor-[0-9a-f]{6}$/),
      })
    );
  });

  it("throws when username generation keeps colliding", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepositoryMock.findUsersByUsername).mockResolvedValue([{ id: 1 }]);

    await expect(
      service.provisionAmbassador({
        bio: "Helping students",
        degree: "Master",
        email: "mentor@example.com",
        fieldOfStudy: "COMPUTER_SCIENCE",
        name: "Mentor",
        university: "Sorbonne",
        yearOfStudy: 4,
      })
    ).rejects.toMatchObject({
      code: ErrorCode.BadRequest,
    });

    expect(userRepositoryMock.findUsersByUsername).toHaveBeenCalledTimes(6);
  });

  it("keeps provisioning successful even when the password setup email fails", async () => {
    vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue({
      email: "mentor@example.com",
      id: 10,
      timeZone: "Europe/Paris",
    });
    vi.mocked(profileRepositoryMock.getProfileByUserId).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(profileRepositoryMock.updateProfile).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: 10,
      timeZone: "Europe/Paris",
    });
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });
    passwordResetRequestFn = vi.fn().mockRejectedValue(new Error("mailer down"));
    service = new ThotisAdminService({
      bookingRepository: bookingRepositoryMock,
      mentorQualityRepository: mentorQualityRepositoryMock,
      passwordResetRequestFn,
      passwordResetRateLimitFn,
      profileRepository: profileRepositoryMock,
      profileService: profileServiceMock,
      scheduleRepository: scheduleRepositoryMock,
      schedulesRepository: schedulesRepositoryMock,
      userRepository: userRepositoryMock,
    });

    const result = await service.provisionAmbassador({
      bio: "Helping students",
      degree: "Master",
      email: "mentor@example.com",
      fieldOfStudy: "COMPUTER_SCIENCE",
      name: "Mentor",
      university: "Sorbonne",
      yearOfStudy: 4,
    });

    expect(result).toEqual({ id: "profile-1" });
  });

  it("sends an initial password setup email", async () => {
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });

    const result = await service.sendInitialPasswordSetup(10);

    expect(result).toEqual({ success: true });
    expect(passwordResetRequestFn).toHaveBeenCalledWith({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });
    expect(passwordResetRateLimitFn).toHaveBeenCalledWith("thotis:admin:password-reset:10");
  });

  it("throws when sending a password setup email for an unknown user", async () => {
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue(null);

    await expect(service.sendInitialPasswordSetup(10)).rejects.toMatchObject({
      code: ErrorCode.NotFound,
    });
  });

  it("rejects password reset requests when the rate limit is exceeded", async () => {
    vi.mocked(userRepositoryMock.findForPasswordReset).mockResolvedValue({
      email: "mentor@example.com",
      locale: "fr",
      name: "Mentor",
    });
    passwordResetRateLimitFn = vi
      .fn()
      .mockRejectedValue(new ErrorWithCode(ErrorCode.BadRequest, "Password reset rate limit exceeded."));
    service = new ThotisAdminService({
      bookingRepository: bookingRepositoryMock,
      mentorQualityRepository: mentorQualityRepositoryMock,
      passwordResetRequestFn,
      passwordResetRateLimitFn,
      profileRepository: profileRepositoryMock,
      profileService: profileServiceMock,
      scheduleRepository: scheduleRepositoryMock,
      schedulesRepository: schedulesRepositoryMock,
      userRepository: userRepositoryMock,
    });

    await expect(service.sendInitialPasswordSetup(10)).rejects.toMatchObject({
      code: ErrorCode.BadRequest,
    });

    expect(passwordResetRequestFn).not.toHaveBeenCalled();
  });

  it("delegates ambassador listing to the profile repository", async () => {
    vi.mocked(profileRepositoryMock.listAdminProfiles).mockResolvedValue({
      page: 2,
      pageSize: 5,
      profiles: [{ id: "profile-1" }],
      total: 1,
    });

    const result = await service.listAllAmbassadors({ page: 2, pageSize: 5, search: "Mentor" });

    expect(result).toEqual({
      page: 2,
      pageSize: 5,
      profiles: [{ id: "profile-1" }],
      total: 1,
    });
  });

  it("updates ambassador status through the profile repository", async () => {
    vi.mocked(profileRepositoryMock.updateProfile).mockResolvedValue({
      id: "profile-1",
      isActive: true,
      status: MentorStatus.VERIFIED,
    });

    const result = await service.setAmbassadorStatus("profile-1", MentorStatus.VERIFIED);

    expect(result).toEqual({
      id: "profile-1",
      isActive: true,
      status: MentorStatus.VERIFIED,
    });
    expect(profileRepositoryMock.updateProfile).toHaveBeenCalledWith("profile-1", {
      isActive: true,
      status: MentorStatus.VERIFIED,
    });
  });

  it("lists and resolves incidents through the mentor quality repository", async () => {
    vi.mocked(mentorQualityRepositoryMock.listIncidents).mockResolvedValue({
      incidents: [{ id: "incident-1" }],
      page: 1,
      pageSize: 10,
      total: 1,
    });
    vi.mocked(mentorQualityRepositoryMock.updateIncident).mockResolvedValue({
      id: "incident-1",
      resolved: true,
    });

    const listed = await service.listIncidents({ page: 1, pageSize: 10 });
    const resolved = await service.resolveIncident("incident-1");

    expect(listed.total).toBe(1);
    expect(resolved).toEqual({
      id: "incident-1",
      resolved: true,
    });
  });

  it("creates moderation actions and optionally updates the mentor status", async () => {
    vi.mocked(mentorQualityRepositoryMock.createModerationAction).mockResolvedValue({
      id: "action-1",
    });
    vi.mocked(profileRepositoryMock.updateProfile).mockResolvedValue({
      id: "profile-1",
      isActive: false,
      status: MentorStatus.SUSPENDED,
    });

    const result = await service.takeModerationAction({
      actionByUserId: 99,
      actionType: "SUSPEND",
      reason: "Repeated no-shows",
      studentProfileId: "profile-1",
      updateStatusTo: MentorStatus.SUSPENDED,
    });

    expect(result).toEqual({ id: "action-1" });
    expect(profileRepositoryMock.updateProfile).toHaveBeenCalledWith("profile-1", {
      isActive: false,
      status: MentorStatus.SUSPENDED,
    });
  });

  it("delegates booking listing and details lookup to the booking repository", async () => {
    vi.mocked(bookingRepositoryMock.listThotisAdminBookings).mockResolvedValue({
      bookings: [{ id: 1 }],
      page: 1,
      pageSize: 20,
      total: 1,
    });
    vi.mocked(bookingRepositoryMock.getThotisAdminBookingDetails).mockResolvedValue({
      id: 1,
      uid: "booking-uid",
    });

    const listed = await service.listBookings({ status: BookingStatus.PENDING });
    const details = await service.getBookingDetails(1);

    expect(listed.total).toBe(1);
    expect(details).toEqual({
      id: 1,
      uid: "booking-uid",
    });
  });

  it("throws when the admin asks for details of an unknown booking", async () => {
    vi.mocked(bookingRepositoryMock.getThotisAdminBookingDetails).mockResolvedValue(null);

    await expect(service.getBookingDetails(404)).rejects.toMatchObject({
      code: ErrorCode.NotFound,
    });
  });

  it("cancels a booking on behalf of an admin and increments the mentor stats", async () => {
    vi.mocked(bookingRepositoryMock.getThotisAdminBookingForCancellation).mockResolvedValue({
      id: 1,
      metadata: { studentProfileId: "profile-1" },
      status: "PENDING",
      userId: 10,
    });

    const result = await service.adminCancelBooking(1, "Policy violation", 99);

    expect(result).toEqual({ success: true });
    expect(bookingRepositoryMock.cancelThotisAdminBooking).toHaveBeenCalledWith({
      adminUserId: 99,
      bookingId: 1,
      metadata: { studentProfileId: "profile-1" },
      reason: "Policy violation",
    });
    expect(profileRepositoryMock.incrementCancelledSessions).toHaveBeenCalledWith("profile-1");
  });

  it("updates mentor profiles and schedule settings through repositories", async () => {
    vi.mocked(profileRepositoryMock.getProfile).mockResolvedValue({
      id: "profile-1",
    });
    vi.mocked(profileRepositoryMock.updateProfile).mockResolvedValue({
      id: "profile-1",
      university: "Sorbonne",
    });
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: 55,
      timeZone: "Europe/Paris",
    });
    vi.mocked(schedulesRepositoryMock.replaceAvailability).mockResolvedValue(undefined);
    vi.mocked(schedulesRepositoryMock.updateSchedule).mockResolvedValue({
      id: 55,
    });

    const updatedProfile = await service.updateMentorProfile("profile-1", {
      university: "Sorbonne",
    });
    const updatedSchedule = await service.updateMentorSchedule(10, {
      availability: [
        {
          days: [1, 2],
          endTime: "12:00",
          startTime: "09:00",
        },
      ],
      timeZone: "Europe/Paris",
    });

    expect(updatedProfile).toEqual({
      id: "profile-1",
      university: "Sorbonne",
    });
    expect(schedulesRepositoryMock.replaceAvailability).toHaveBeenCalledWith({
      availability: [
        {
          days: [1, 2],
          endTime: new Date("1970-01-01T12:00:00Z"),
          startTime: new Date("1970-01-01T09:00:00Z"),
        },
      ],
      scheduleId: 55,
    });
    expect(updatedSchedule).toEqual({ success: true });
  });

  it("rejects invalid schedule time ranges", async () => {
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId).mockResolvedValue({
      defaultScheduleId: 55,
      timeZone: "Europe/Paris",
    });

    await expect(
      service.updateMentorSchedule(10, {
        availability: [
          {
            days: [1, 2],
            endTime: "09:00",
            startTime: "17:00",
          },
        ],
        timeZone: "Europe/Paris",
      })
    ).rejects.toMatchObject({
      code: ErrorCode.BadRequest,
    });

    expect(schedulesRepositoryMock.replaceAvailability).not.toHaveBeenCalled();
  });

  it("returns a no-schedule placeholder and the concrete schedule when available", async () => {
    vi.mocked(userRepositoryMock.getTimeZoneAndDefaultScheduleId)
      .mockResolvedValueOnce({
        defaultScheduleId: null,
        timeZone: "Europe/Paris",
      })
      .mockResolvedValueOnce({
        defaultScheduleId: 55,
        timeZone: "Europe/Paris",
      });
    vi.mocked(schedulesRepositoryMock.getScheduleById).mockResolvedValue({
      availability: [],
      id: 55,
      name: "Default Schedule",
      timeZone: "Europe/Paris",
    });

    const emptySchedule = await service.getMentorSchedule(10);
    const actualSchedule = await service.getMentorSchedule(10);

    expect(emptySchedule).toEqual({
      availability: [],
      hasSchedule: false,
      id: null,
      name: "No Schedule",
      timeZone: "Europe/Paris",
    });
    expect(actualSchedule).toEqual({
      availability: [],
      hasSchedule: true,
      id: 55,
      name: "Default Schedule",
      timeZone: "Europe/Paris",
    });
  });
});
