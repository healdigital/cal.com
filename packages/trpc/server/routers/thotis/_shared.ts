import { AnalyticsRepository } from "@calcom/features/thotis/repositories/AnalyticsRepository";
import { MentorQualityRepository } from "@calcom/features/thotis/repositories/MentorQualityRepository";
import { ProfileRepository } from "@calcom/features/thotis/repositories/ProfileRepository";
import { SessionRatingRepository } from "@calcom/features/thotis/repositories/SessionRatingRepository";
import { ProfileService } from "@calcom/features/thotis/services/ProfileService";
import { StatisticsService } from "@calcom/features/thotis/services/StatisticsService";
import { ThotisAdminService } from "@calcom/features/thotis/services/ThotisAdminService";
import { ThotisAnalyticsService } from "@calcom/features/thotis/services/ThotisAnalyticsService";
import { ThotisBookingService } from "@calcom/features/thotis/services/ThotisBookingService";
import { ThotisEmailService } from "@calcom/features/thotis/services/ThotisEmailService";
import { ThotisGuestService } from "@calcom/features/thotis/services/ThotisGuestService";
import prisma from "@calcom/prisma";

export { prisma };

const profileRepository = new ProfileRepository();
const ratingRepository = new SessionRatingRepository();
const analyticsRepository = new AnalyticsRepository();
const mentorQualityRepository = new MentorQualityRepository();

export const analyticsService = new ThotisAnalyticsService(analyticsRepository);
export const profileService = new ProfileService(profileRepository);
export const bookingService = new ThotisBookingService(prisma, undefined, undefined, analyticsService);
export const statisticsService = new StatisticsService(profileRepository, ratingRepository, analyticsService);
export const adminService = new ThotisAdminService(profileService, profileRepository, mentorQualityRepository);
export const guestService = new ThotisGuestService();
export const emailService = new ThotisEmailService();
