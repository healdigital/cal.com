/**
 * Singleton service instances for the Thotis REST API.
 * Mirrors the instantiation pattern used in the tRPC router.
 */
import prisma from "@calcom/prisma";

import { AnalyticsRepository } from "@calcom/features/thotis/repositories/AnalyticsRepository";
import { ProfileRepository } from "@calcom/features/thotis/repositories/ProfileRepository";
import { SessionRatingRepository } from "@calcom/features/thotis/repositories/SessionRatingRepository";
import { MentorMatchingService } from "@calcom/features/thotis/services/MentorMatchingService";
import { ProfileService } from "@calcom/features/thotis/services/ProfileService";
import { SessionRatingService } from "@calcom/features/thotis/services/SessionRatingService";
import { StatisticsService } from "@calcom/features/thotis/services/StatisticsService";
import { ThotisAnalyticsService } from "@calcom/features/thotis/services/ThotisAnalyticsService";
import { ThotisBookingService } from "@calcom/features/thotis/services/ThotisBookingService";
import { ThotisEmailService } from "@calcom/features/thotis/services/ThotisEmailService";
import { ThotisGuestService } from "@calcom/features/thotis/services/ThotisGuestService";

const profileRepository = new ProfileRepository();
const ratingRepository = new SessionRatingRepository();
const analyticsRepository = new AnalyticsRepository();
const analyticsService = new ThotisAnalyticsService(analyticsRepository);

export const profileService = new ProfileService(profileRepository);
export const bookingService = new ThotisBookingService(prisma, undefined, undefined, analyticsService);
export const ratingService = new SessionRatingService(ratingRepository);
export const statisticsService = new StatisticsService(profileRepository, ratingRepository, analyticsService);
export const guestService = new ThotisGuestService();
export const emailService = new ThotisEmailService();
export const matchingService = new MentorMatchingService();
export { analyticsService };
