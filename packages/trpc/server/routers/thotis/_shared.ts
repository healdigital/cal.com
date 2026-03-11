import { BookingRepository } from "@calcom/features/bookings/repositories/BookingRepository";
import { createContainer, createModule, type ResolveFunction } from "@calcom/features/di/di";
import { moduleLoader as prismaModuleLoader } from "@calcom/features/di/modules/Prisma";
import { DI_TOKENS } from "@calcom/features/di/tokens";
import { ScheduleRepository } from "@calcom/features/schedules/repositories/ScheduleRepository";
import { SchedulesRepository } from "@calcom/features/schedules/repositories/SchedulesRepository";
import { AnalyticsRepository } from "@calcom/features/thotis/repositories/AnalyticsRepository";
import { MentorQualityRepository } from "@calcom/features/thotis/repositories/MentorQualityRepository";
import { ProfileRepository } from "@calcom/features/thotis/repositories/ProfileRepository";
import { SessionRatingRepository } from "@calcom/features/thotis/repositories/SessionRatingRepository";
import { ProfileService } from "@calcom/features/thotis/services/ProfileService";
import { SessionRatingService } from "@calcom/features/thotis/services/SessionRatingService";
import { StatisticsService } from "@calcom/features/thotis/services/StatisticsService";
import { ThotisAdminService } from "@calcom/features/thotis/services/ThotisAdminService";
import { ThotisAnalyticsService } from "@calcom/features/thotis/services/ThotisAnalyticsService";
import { ThotisBookingService } from "@calcom/features/thotis/services/ThotisBookingService";
import { ThotisEmailService } from "@calcom/features/thotis/services/ThotisEmailService";
import { ThotisGuestService } from "@calcom/features/thotis/services/ThotisGuestService";
import { ThotisSessionOperationsService } from "@calcom/features/thotis/services/ThotisSessionOperationsService";
import { UserRepository } from "@calcom/features/users/repositories/UserRepository";
import type { PrismaClient } from "@calcom/prisma/client";

const THOTIS_TOKENS = {
  MODULE: Symbol("ThotisModule"),
  ANALYTICS_REPOSITORY: Symbol("ThotisAnalyticsRepository"),
  ANALYTICS_SERVICE: Symbol("ThotisAnalyticsService"),
  ADMIN_SERVICE: Symbol("ThotisAdminService"),
  BOOKING_REPOSITORY: Symbol("ThotisBookingRepository"),
  BOOKING_SERVICE: Symbol("ThotisBookingService"),
  EMAIL_SERVICE: Symbol("ThotisEmailService"),
  GUEST_SERVICE: Symbol("ThotisGuestService"),
  MENTOR_QUALITY_REPOSITORY: Symbol("ThotisMentorQualityRepository"),
  PROFILE_REPOSITORY: Symbol("ThotisProfileRepository"),
  PROFILE_SERVICE: Symbol("ThotisProfileService"),
  SCHEDULE_REPOSITORY: Symbol("ThotisScheduleRepository"),
  SCHEDULES_REPOSITORY: Symbol("ThotisSchedulesRepository"),
  SESSION_OPERATIONS_SERVICE: Symbol("ThotisSessionOperationsService"),
  SESSION_RATING_REPOSITORY: Symbol("ThotisSessionRatingRepository"),
  SESSION_RATING_SERVICE: Symbol("ThotisSessionRatingService"),
  STATISTICS_SERVICE: Symbol("ThotisStatisticsService"),
  USER_REPOSITORY: Symbol("ThotisUserRepository"),
} as const;

function getPrismaClient(resolve: ResolveFunction): PrismaClient {
  return resolve(DI_TOKENS.PRISMA_CLIENT) as PrismaClient;
}

function getProfileRepository(resolve: ResolveFunction): ProfileRepository {
  return resolve(THOTIS_TOKENS.PROFILE_REPOSITORY) as ProfileRepository;
}

function getAnalyticsRepository(resolve: ResolveFunction): AnalyticsRepository {
  return resolve(THOTIS_TOKENS.ANALYTICS_REPOSITORY) as AnalyticsRepository;
}

function getMentorQualityRepository(resolve: ResolveFunction): MentorQualityRepository {
  return resolve(THOTIS_TOKENS.MENTOR_QUALITY_REPOSITORY) as MentorQualityRepository;
}

function getUserRepository(resolve: ResolveFunction): UserRepository {
  return resolve(THOTIS_TOKENS.USER_REPOSITORY) as UserRepository;
}

function getBookingRepository(resolve: ResolveFunction): BookingRepository {
  return resolve(THOTIS_TOKENS.BOOKING_REPOSITORY) as BookingRepository;
}

function getScheduleRepository(resolve: ResolveFunction): ScheduleRepository {
  return resolve(THOTIS_TOKENS.SCHEDULE_REPOSITORY) as ScheduleRepository;
}

function getSchedulesRepository(resolve: ResolveFunction): SchedulesRepository {
  return resolve(THOTIS_TOKENS.SCHEDULES_REPOSITORY) as SchedulesRepository;
}

function getProfileService(resolve: ResolveFunction): ProfileService {
  return resolve(THOTIS_TOKENS.PROFILE_SERVICE) as ProfileService;
}

function getAnalyticsService(resolve: ResolveFunction): ThotisAnalyticsService {
  return resolve(THOTIS_TOKENS.ANALYTICS_SERVICE) as ThotisAnalyticsService;
}

function getGuestService(resolve: ResolveFunction): ThotisGuestService {
  return resolve(THOTIS_TOKENS.GUEST_SERVICE) as ThotisGuestService;
}

function getEmailService(resolve: ResolveFunction): ThotisEmailService {
  return resolve(THOTIS_TOKENS.EMAIL_SERVICE) as ThotisEmailService;
}

function getSessionRatingRepository(resolve: ResolveFunction): SessionRatingRepository {
  return resolve(THOTIS_TOKENS.SESSION_RATING_REPOSITORY) as SessionRatingRepository;
}

function getSessionRatingService(resolve: ResolveFunction): SessionRatingService {
  return resolve(THOTIS_TOKENS.SESSION_RATING_SERVICE) as SessionRatingService;
}

function getStatisticsService(resolve: ResolveFunction): StatisticsService {
  return resolve(THOTIS_TOKENS.STATISTICS_SERVICE) as StatisticsService;
}

const thotisModule: ReturnType<typeof createModule> = createModule();

thotisModule
  .bind(THOTIS_TOKENS.PROFILE_REPOSITORY)
  .toFactory(
    (resolve: ResolveFunction) => new ProfileRepository({ prismaClient: getPrismaClient(resolve) }),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.SESSION_RATING_REPOSITORY)
  .toFactory(
    (resolve: ResolveFunction) => new SessionRatingRepository({ prismaClient: getPrismaClient(resolve) }),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.ANALYTICS_REPOSITORY)
  .toFactory(
    (resolve: ResolveFunction) => new AnalyticsRepository({ prismaClient: getPrismaClient(resolve) }),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.MENTOR_QUALITY_REPOSITORY)
  .toFactory(
    (resolve: ResolveFunction) => new MentorQualityRepository({ prismaClient: getPrismaClient(resolve) }),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.USER_REPOSITORY)
  .toFactory((resolve: ResolveFunction) => new UserRepository(getPrismaClient(resolve)), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.BOOKING_REPOSITORY)
  .toFactory((resolve: ResolveFunction) => new BookingRepository(getPrismaClient(resolve)), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.SCHEDULE_REPOSITORY)
  .toFactory((resolve: ResolveFunction) => new ScheduleRepository(getPrismaClient(resolve)), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.SCHEDULES_REPOSITORY)
  .toFactory((resolve: ResolveFunction) => new SchedulesRepository(getPrismaClient(resolve)), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.PROFILE_SERVICE)
  .toFactory((resolve: ResolveFunction) => new ProfileService(getProfileRepository(resolve)), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.ANALYTICS_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) => new ThotisAnalyticsService(getAnalyticsRepository(resolve)),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.GUEST_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) => new ThotisGuestService({ prismaClient: getPrismaClient(resolve) }),
    "singleton"
  );
thotisModule.bind(THOTIS_TOKENS.EMAIL_SERVICE).toFactory(() => new ThotisEmailService(), "singleton");
thotisModule
  .bind(THOTIS_TOKENS.SESSION_RATING_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) => new SessionRatingService(getSessionRatingRepository(resolve)),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.BOOKING_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) =>
      new ThotisBookingService(
        getPrismaClient(resolve),
        undefined,
        undefined,
        getAnalyticsService(resolve),
        getGuestService(resolve),
        getEmailService(resolve)
      ),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.STATISTICS_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) =>
      new StatisticsService(
        getProfileRepository(resolve),
        getSessionRatingRepository(resolve),
        getAnalyticsService(resolve)
      ),
    "singleton"
  );
thotisModule
  .bind(THOTIS_TOKENS.SESSION_OPERATIONS_SERVICE)
  .toFactory(
    (resolve: ResolveFunction) =>
      new ThotisSessionOperationsService(
        getPrismaClient(resolve),
        getStatisticsService(resolve),
        getSessionRatingService(resolve),
        getAnalyticsService(resolve)
      ),
    "singleton"
  );
thotisModule.bind(THOTIS_TOKENS.ADMIN_SERVICE).toFactory(
  (resolve: ResolveFunction) =>
    new ThotisAdminService({
      bookingRepository: getBookingRepository(resolve),
      mentorQualityRepository: getMentorQualityRepository(resolve),
      profileRepository: getProfileRepository(resolve),
      profileService: getProfileService(resolve),
      scheduleRepository: getScheduleRepository(resolve),
      schedulesRepository: getSchedulesRepository(resolve),
      userRepository: getUserRepository(resolve),
    }),
  "singleton"
);

const thotisContainer: ReturnType<typeof createContainer> = createContainer();

prismaModuleLoader.loadModule(thotisContainer);
thotisContainer.load(THOTIS_TOKENS.MODULE, thotisModule);

export const prisma: PrismaClient = thotisContainer.get<PrismaClient>(DI_TOKENS.PRISMA_CLIENT);
export const analyticsService: ThotisAnalyticsService = thotisContainer.get<ThotisAnalyticsService>(
  THOTIS_TOKENS.ANALYTICS_SERVICE
);
export const profileService: ProfileService = thotisContainer.get<ProfileService>(
  THOTIS_TOKENS.PROFILE_SERVICE
);
export const guestService: ThotisGuestService = thotisContainer.get<ThotisGuestService>(
  THOTIS_TOKENS.GUEST_SERVICE
);
export const emailService: ThotisEmailService = thotisContainer.get<ThotisEmailService>(
  THOTIS_TOKENS.EMAIL_SERVICE
);
export const ratingService: SessionRatingService = thotisContainer.get<SessionRatingService>(
  THOTIS_TOKENS.SESSION_RATING_SERVICE
);
export const bookingService: ThotisBookingService = thotisContainer.get<ThotisBookingService>(
  THOTIS_TOKENS.BOOKING_SERVICE
);
export const statisticsService: StatisticsService = thotisContainer.get<StatisticsService>(
  THOTIS_TOKENS.STATISTICS_SERVICE
);
export const sessionOperationsService: ThotisSessionOperationsService =
  thotisContainer.get<ThotisSessionOperationsService>(THOTIS_TOKENS.SESSION_OPERATIONS_SERVICE);
export const adminService: ThotisAdminService = thotisContainer.get<ThotisAdminService>(
  THOTIS_TOKENS.ADMIN_SERVICE
);
