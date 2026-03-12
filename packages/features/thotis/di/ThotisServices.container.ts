import { type Container, createContainer } from "@calcom/features/di/di";
import { moduleLoader as prismaModuleLoader } from "@calcom/features/di/modules/Prisma";
import type { PrismaClient } from "@calcom/prisma/client";
import type { MentorMatchingService } from "../services/MentorMatchingService";
import type { ProfileService } from "../services/ProfileService";
import type { SessionRatingService } from "../services/SessionRatingService";
import type { StatisticsService } from "../services/StatisticsService";
import type { ThotisAdminService } from "../services/ThotisAdminService";
import type { ThotisAnalyticsService } from "../services/ThotisAnalyticsService";
import type { ThotisBookingService } from "../services/ThotisBookingService";
import type { ThotisEmailService } from "../services/ThotisEmailService";
import type { ThotisGuestService } from "../services/ThotisGuestService";
import type { ThotisSessionOperationsService } from "../services/ThotisSessionOperationsService";
import { THOTIS_DI_TOKENS, moduleLoader as thotisServicesModuleLoader } from "./ThotisServices.module";

const thotisContainer: Container = createContainer();
thotisServicesModuleLoader.loadModule(thotisContainer);

export const prisma: PrismaClient = thotisContainer.get<PrismaClient>(prismaModuleLoader.token);
export const analyticsService: ThotisAnalyticsService = thotisContainer.get<ThotisAnalyticsService>(
  THOTIS_DI_TOKENS.ANALYTICS_SERVICE
);
export const bookingService: ThotisBookingService = thotisContainer.get<ThotisBookingService>(
  THOTIS_DI_TOKENS.BOOKING_SERVICE
);
export const emailService: ThotisEmailService = thotisContainer.get<ThotisEmailService>(
  THOTIS_DI_TOKENS.EMAIL_SERVICE
);
export const guestService: ThotisGuestService = thotisContainer.get<ThotisGuestService>(
  THOTIS_DI_TOKENS.GUEST_SERVICE
);
export const matchingService: MentorMatchingService = thotisContainer.get<MentorMatchingService>(
  THOTIS_DI_TOKENS.MATCHING_SERVICE
);
export const profileService: ProfileService = thotisContainer.get<ProfileService>(
  THOTIS_DI_TOKENS.PROFILE_SERVICE
);
export const ratingService: SessionRatingService = thotisContainer.get<SessionRatingService>(
  THOTIS_DI_TOKENS.SESSION_RATING_SERVICE
);
export const sessionOperationsService: ThotisSessionOperationsService =
  thotisContainer.get<ThotisSessionOperationsService>(THOTIS_DI_TOKENS.SESSION_OPERATIONS_SERVICE);
export const statisticsService: StatisticsService = thotisContainer.get<StatisticsService>(
  THOTIS_DI_TOKENS.STATISTICS_SERVICE
);
export const adminService: ThotisAdminService = thotisContainer.get<ThotisAdminService>(
  THOTIS_DI_TOKENS.ADMIN_SERVICE
);
