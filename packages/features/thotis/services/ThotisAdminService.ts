import { randomUUID } from "node:crypto";
import { passwordResetRequest } from "@calcom/features/auth/lib/passwordResetRequest";
import type { BookingRepository } from "@calcom/features/bookings/repositories/BookingRepository";
import type { ScheduleRepository } from "@calcom/features/schedules/repositories/ScheduleRepository";
import type { SchedulesRepository } from "@calcom/features/schedules/repositories/SchedulesRepository";
import type { UserRepository } from "@calcom/features/users/repositories/UserRepository";
import { parseThotisMetadata } from "@calcom/lib/dto/thotis/ThotisDtoMappers";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import logger from "@calcom/lib/logger";
import { rateLimiter } from "@calcom/lib/rateLimit";
import { sanitizeStringArray, sanitizeUserInput } from "@calcom/lib/sanitizeUserInput";
import type { User } from "@calcom/prisma/client";
import {
  type AcademicField,
  type BookingStatus,
  CreationSource,
  type MentorIncidentType,
  type MentorModerationActionType,
  MentorStatus,
} from "@calcom/prisma/enums";
import type { MentorQualityRepository } from "../repositories/MentorQualityRepository";
import type { ProfileRepository } from "../repositories/ProfileRepository";
import type { ProfileService } from "./ProfileService";

const log = logger.getSubLogger({ prefix: ["ThotisAdminService"] });
const PASSWORD_RESET_RATE_LIMIT = { limit: 3, duration: "1h" } as const;

export interface ScheduleConfig {
  /** Days of the week (0=Sunday, 1=Monday, ..., 6=Saturday). Defaults to [1,2,3,4,5] (Mon-Fri). */
  days?: number[];
  /** Start time in HH:MM format. Defaults to "09:00". */
  startTime?: string;
  /** End time in HH:MM format. Defaults to "17:00". */
  endTime?: string;
  /** IANA timezone. Defaults to "Europe/Paris". */
  timeZone?: string;
}

export const DEFAULT_SCHEDULE_CONFIG: Required<ScheduleConfig> = {
  days: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "17:00",
  timeZone: "Europe/Paris",
};

function getMinutesFromTimeString(time: string): number {
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  return hours * 60 + minutes;
}

function hasValidScheduleTimeRange(startTime: string, endTime: string): boolean {
  return getMinutesFromTimeString(endTime) > getMinutesFromTimeString(startTime);
}

export interface ProvisionAmbassadorInput {
  name: string;
  email: string;
  fieldOfStudy: AcademicField;
  university: string;
  degree: string;
  yearOfStudy: number;
  bio: string;
  expertise?: string[];
  schedule?: ScheduleConfig;
}

export class ThotisAdminService {
  private profileRepository: ProfileRepository;
  private mentorQualityRepository: MentorQualityRepository;
  private profileService: ProfileService;
  private userRepository: UserRepository;
  private bookingRepository: BookingRepository;
  private scheduleRepository: ScheduleRepository;
  private schedulesRepository: SchedulesRepository;
  private passwordResetRequestFn: (user: Pick<User, "email" | "locale" | "name">) => Promise<void>;
  private passwordResetRateLimitFn: (identifier: string) => Promise<void>;

  constructor(deps: {
    bookingRepository: BookingRepository;
    mentorQualityRepository: MentorQualityRepository;
    passwordResetRequestFn?: (user: Pick<User, "email" | "locale" | "name">) => Promise<void>;
    passwordResetRateLimitFn?: (identifier: string) => Promise<void>;
    profileRepository: ProfileRepository;
    profileService: ProfileService;
    scheduleRepository: ScheduleRepository;
    schedulesRepository: SchedulesRepository;
    userRepository: UserRepository;
  }) {
    this.profileRepository = deps.profileRepository;
    this.profileService = deps.profileService;
    this.mentorQualityRepository = deps.mentorQualityRepository;
    this.userRepository = deps.userRepository;
    this.bookingRepository = deps.bookingRepository;
    this.scheduleRepository = deps.scheduleRepository;
    this.schedulesRepository = deps.schedulesRepository;
    this.passwordResetRequestFn = deps.passwordResetRequestFn || passwordResetRequest;
    this.passwordResetRateLimitFn = deps.passwordResetRateLimitFn || this.rateLimitPasswordReset.bind(this);
  }

  /**
   * Generate a unique username from an email, appending a suffix if needed.
   */
  private async generateUniqueUsername(email: string): Promise<string> {
    const base =
      email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "user";

    const attempts = [base, ...Array.from({ length: 5 }, () => `${base}-${randomUUID().slice(0, 6)}`)];

    for (const username of attempts) {
      const existing = await this.userRepository.findUsersByUsername({
        orgSlug: null,
        usernameList: [username],
      });

      if (!existing.length) return username;
    }

    throw new ErrorWithCode(ErrorCode.BadRequest, `Unable to generate a unique username for ${email}`);
  }

  private assertValidScheduleTimeRange(startTime: string, endTime: string) {
    if (hasValidScheduleTimeRange(startTime, endTime)) return;

    throw new ErrorWithCode(ErrorCode.BadRequest, "Schedule end time must be after start time");
  }

  private assertValidAvailabilitySlots(
    availability: Array<{
      days: number[];
      startTime: string;
      endTime: string;
    }>
  ) {
    availability.forEach((slot) => {
      this.assertValidScheduleTimeRange(slot.startTime, slot.endTime);
    });
  }

  private async rateLimitPasswordReset(identifier: string) {
    const response = await rateLimiter()({
      identifier,
      opts: { limit: PASSWORD_RESET_RATE_LIMIT },
      rateLimitingType: "common",
    });

    if (response.success) return;

    const secondsToWait = Math.max(0, Math.ceil((response.reset - Date.now()) / 1000));
    throw new ErrorWithCode(
      ErrorCode.BadRequest,
      `Password reset rate limit exceeded. Try again in ${secondsToWait} seconds.`
    );
  }

  /**
   * Provision a new ambassador account and profile.
   * If user doesn't exist, creates one. Then creates the student profile.
   * Idempotent: if profile already exists, returns it.
   */
  async provisionAmbassador(input: ProvisionAmbassadorInput) {
    const scheduleConfig = {
      ...DEFAULT_SCHEDULE_CONFIG,
      ...input.schedule,
    };

    this.assertValidScheduleTimeRange(scheduleConfig.startTime, scheduleConfig.endTime);

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail({ email: input.email });
    const user = existingUser
      ? {
          email: existingUser.email,
          id: existingUser.id,
          locale: existingUser.locale,
          name: existingUser.name,
          timeZone: existingUser.timeZone,
        }
      : null;

    if (!user) {
      const userTimeZone = input.schedule?.timeZone || DEFAULT_SCHEDULE_CONFIG.timeZone;
      const username = await this.generateUniqueUsername(input.email);
      const createdUser = await this.userRepository.create({
        email: input.email,
        name: input.name,
        username,
        emailVerified: new Date(),
        completedOnboarding: true,
        locale: "fr",
        timeZone: userTimeZone,
        organizationId: null,
        creationSource: CreationSource.WEBAPP,
        locked: false,
      });

      const provisionedUser = {
        email: createdUser.email,
        id: createdUser.id,
        locale: createdUser.locale,
        name: createdUser.name,
        timeZone: createdUser.timeZone,
      };

      return this.provisionAmbassadorForUser(provisionedUser, input);
    }

    return this.provisionAmbassadorForUser(user, input);
  }

  private async provisionAmbassadorForUser(
    user: {
      email: string;
      id: number;
      locale: string | null;
      name: string | null;
      timeZone: string;
    },
    input: ProvisionAmbassadorInput
  ) {
    const existingProfile = await this.profileRepository.getProfileByUserId(user.id);

    // Sanitize user inputs
    const sanitizedBio = sanitizeUserInput(input.bio, 2000);
    const sanitizedUniversity = sanitizeUserInput(input.university, 200);
    const sanitizedDegree = sanitizeUserInput(input.degree, 200);
    const sanitizedExpertise = sanitizeStringArray(input.expertise, 10, 50);

    let profile;
    if (existingProfile) {
      // Profile exists (e.g., from a previous attempt where email failed) — update it
      profile = await this.profileRepository.updateProfile(existingProfile.id, {
        field: input.fieldOfStudy,
        currentYear: input.yearOfStudy,
        bio: sanitizedBio,
        university: sanitizedUniversity,
        degree: sanitizedDegree,
        status: MentorStatus.VERIFIED,
        isActive: true,
        ...(sanitizedExpertise.length > 0 ? { expertise: sanitizedExpertise } : {}),
      });
    } else {
      profile = await this.profileService.createProfile({
        userId: user.id,
        fieldOfStudy: input.fieldOfStudy,
        yearOfStudy: input.yearOfStudy,
        bio: sanitizedBio,
        university: sanitizedUniversity,
        degree: sanitizedDegree,
        expertise: sanitizedExpertise.length > 0 ? sanitizedExpertise : undefined,
      });
    }

    // 3. Ensure user has a default schedule
    const scheduleConfig = {
      ...DEFAULT_SCHEDULE_CONFIG,
      ...input.schedule,
    };

    const userWithSchedule = await this.userRepository.getTimeZoneAndDefaultScheduleId({ userId: user.id });

    if (!userWithSchedule) {
      throw new ErrorWithCode(ErrorCode.NotFound, `User ${user.id} not found`);
    }

    if (!userWithSchedule.defaultScheduleId) {
      let defaultScheduleId: number;

      try {
        defaultScheduleId = await this.scheduleRepository.getDefaultScheduleId(user.id);
      } catch {
        const defaultSchedule = await this.schedulesRepository.createScheduleWithAvailability({
          userId: user.id,
          name: "Default Schedule",
          timeZone: scheduleConfig.timeZone,
          availability: [
            {
              days: scheduleConfig.days,
              startTime: new Date(`1970-01-01T${scheduleConfig.startTime}:00Z`),
              endTime: new Date(`1970-01-01T${scheduleConfig.endTime}:00Z`),
            },
          ],
        });
        defaultScheduleId = defaultSchedule.id;
      }

      await this.scheduleRepository.setupDefaultSchedule(user.id, defaultScheduleId);
    }

    // 4. Send password reset email (non-blocking: don't fail provisioning if email fails)
    try {
      await this.sendInitialPasswordSetup(user.id);
    } catch (emailError) {
      log.warn("Failed to send password setup email", { error: emailError, userId: user.id });
      // Don't throw — the account is provisioned, admin can resend later
    }

    return profile;
  }

  /**
   * Send a password reset email for initial setup or admin-triggered reset.
   */
  async sendInitialPasswordSetup(userId: number) {
    const user = await this.userRepository.findForPasswordReset({ id: userId });

    if (!user) throw new ErrorWithCode(ErrorCode.NotFound, "User not found");

    await this.passwordResetRateLimitFn(`thotis:admin:password-reset:${userId}`);
    await this.passwordResetRequestFn(user);

    return { success: true };
  }

  /**
   * List all ambassadors with pagination and filters
   */
  async listAllAmbassadors(filters: {
    page?: number;
    pageSize?: number;
    fieldOfStudy?: AcademicField;
    isActive?: boolean;
    search?: string;
  }) {
    return this.profileRepository.listAdminProfiles(filters);
  }

  /**
   * Set ambassador status
   */
  async setAmbassadorStatus(profileId: string, status: MentorStatus) {
    return await this.profileRepository.updateProfile(profileId, {
      status,
      isActive: status === MentorStatus.VERIFIED,
    });
  }

  /**
   * List quality incidents
   */
  async listIncidents(filters: {
    page?: number;
    pageSize?: number;
    studentProfileId?: string;
    type?: MentorIncidentType;
    resolved?: boolean;
  }) {
    return await this.mentorQualityRepository.listIncidents(filters);
  }

  /**
   * Resolve an incident
   */
  async resolveIncident(incidentId: string) {
    return await this.mentorQualityRepository.updateIncident(incidentId, {
      resolved: true,
      resolvedAt: new Date(),
    });
  }

  /**
   * Take a moderation action
   */
  async takeModerationAction(input: {
    studentProfileId: string;
    actionByUserId: number;
    actionType: MentorModerationActionType;
    reason?: string;
    updateStatusTo?: MentorStatus;
  }) {
    const action = await this.mentorQualityRepository.createModerationAction({
      studentProfileId: input.studentProfileId,
      actionByUserId: input.actionByUserId,
      actionType: input.actionType,
      reason: input.reason,
    });

    if (input.updateStatusTo) {
      await this.setAmbassadorStatus(input.studentProfileId, input.updateStatusTo);
    }

    return action;
  }

  /**
   * List all Thotis bookings with pagination and filters
   */
  async listBookings(filters: {
    page?: number;
    pageSize?: number;
    mentorUserId?: number;
    status?: BookingStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    return this.bookingRepository.listThotisAdminBookings(filters);
  }

  /**
   * Get detailed booking information for admin view
   */
  async getBookingDetails(bookingId: number) {
    const booking = await this.bookingRepository.getThotisAdminBookingDetails(bookingId);

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    return booking;
  }

  /**
   * Admin-initiated booking cancellation with audit trail
   */
  async adminCancelBooking(bookingId: number, reason: string, adminUserId: number) {
    const booking = await this.bookingRepository.getThotisAdminBookingForCancellation(bookingId);

    if (!booking) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Booking ${bookingId} not found`);
    }

    if (booking.status === "CANCELLED") {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Booking is already cancelled");
    }

    const metadata = parseThotisMetadata(booking.metadata);
    const studentProfileId =
      typeof metadata.studentProfileId === "string" ? metadata.studentProfileId : undefined;

    await this.bookingRepository.cancelThotisAdminBooking({
      adminUserId,
      bookingId,
      metadata,
      reason,
    });

    if (studentProfileId) {
      await this.profileRepository.incrementCancelledSessions(studentProfileId);
    }

    return { success: true };
  }

  /**
   * Update a mentor profile (admin override)
   */
  async updateMentorProfile(
    profileId: string,
    data: {
      bio?: string;
      university?: string;
      degree?: string;
      field?: AcademicField;
      expertise?: string[];
      currentYear?: number;
    }
  ) {
    const profile = await this.profileRepository.getProfile(profileId);
    if (!profile) {
      throw new ErrorWithCode(ErrorCode.NotFound, `Profile ${profileId} not found`);
    }

    // Sanitize user inputs
    const sanitizedData: typeof data = {
      ...data,
      ...(data.bio !== undefined ? { bio: sanitizeUserInput(data.bio, 2000) } : {}),
      ...(data.university !== undefined ? { university: sanitizeUserInput(data.university, 200) } : {}),
      ...(data.degree !== undefined ? { degree: sanitizeUserInput(data.degree, 200) } : {}),
      ...(data.expertise !== undefined ? { expertise: sanitizeStringArray(data.expertise, 10, 50) } : {}),
    };

    return this.profileRepository.updateProfile(profileId, sanitizedData);
  }

  /**
   * Get a mentor's schedule and availability configuration
   */
  async getMentorSchedule(mentorUserId: number) {
    const user = await this.userRepository.getTimeZoneAndDefaultScheduleId({ userId: mentorUserId });

    if (!user) {
      throw new ErrorWithCode(ErrorCode.NotFound, `User ${mentorUserId} not found`);
    }

    if (!user.defaultScheduleId) {
      return {
        id: null,
        name: "No Schedule",
        timeZone: user.timeZone || "Europe/Paris",
        availability: [] as Array<{
          id: number;
          days: number[];
          startTime: Date;
          endTime: Date;
          date: Date | null;
        }>,
        hasSchedule: false,
      };
    }

    const schedule = await this.schedulesRepository.getScheduleById(user.defaultScheduleId);

    if (!schedule) {
      throw new ErrorWithCode(ErrorCode.NotFound, "Schedule not found");
    }

    return { ...schedule, hasSchedule: true };
  }

  /**
   * Update a mentor's schedule availability (admin override)
   */
  async updateMentorSchedule(
    mentorUserId: number,
    scheduleData: {
      timeZone?: string;
      availability: Array<{
        days: number[];
        startTime: string;
        endTime: string;
      }>;
    }
  ) {
    const user = await this.userRepository.getTimeZoneAndDefaultScheduleId({ userId: mentorUserId });

    if (!user) {
      throw new ErrorWithCode(ErrorCode.NotFound, `User ${mentorUserId} not found`);
    }

    if (!user.defaultScheduleId) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "User has no default schedule");
    }

    const scheduleId = user.defaultScheduleId;

    this.assertValidAvailabilitySlots(scheduleData.availability);

    await this.schedulesRepository.replaceAvailability({
      scheduleId,
      availability: scheduleData.availability.map((slot) => ({
        days: slot.days,
        startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${slot.endTime}:00Z`),
      })),
    });

    if (scheduleData.timeZone) {
      await this.schedulesRepository.updateSchedule({
        scheduleId,
        timeZone: scheduleData.timeZone,
      });
    }

    return { success: true };
  }
}
