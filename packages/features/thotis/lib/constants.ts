export const THOTIS_BOOKING_DURATION_MINUTES = 15;
export const THOTIS_BOOKING_DURATION_MS: number = THOTIS_BOOKING_DURATION_MINUTES * 60 * 1000;
export const THOTIS_MINIMUM_BOOKING_NOTICE_MINUTES = 120;

export const THOTIS_DEFAULT_LOCALE = "en";
export const THOTIS_DEFAULT_TIME_ZONE = "Europe/Paris";

export const THOTIS_MENTORING_EVENT_TYPE = "thotis-mentoring";
export const THOTIS_MENTORING_EVENT_TITLE = "Thotis Student Mentoring Session";
export const THOTIS_MENTORING_EVENT_DESCRIPTION = "Student mentoring session";
export const THOTIS_MENTORING_EVENT_SLUG = "thotis-mentoring-session";

export const THOTIS_GOOGLE_MEET_PLACEHOLDER = "integrations:google-video";
export const THOTIS_JITSI_ROOM_PREFIX = "thotis";

export const THOTIS_MENTOR_MATCHING_WEIGHTS = {
  AVAILABILITY: 15,
  COMPLETION_RATE: 5,
  FIELD_MATCH: 25,
  GOAL_MATCH: 15,
  LEVEL_MATCH: 15,
  MENTOR_LOAD: 5,
  RATING: 10,
  SCHEDULE_MATCH: 10,
} as const;

export const THOTIS_MENTOR_MATCHING_THRESHOLDS = {
  experiencedYear: 2,
  goalMatchIncrement: 5,
  highCompletionRate: 0.9,
  highCompletionRateMinimumSessions: 5,
  lowMentorLoadMaximumSessions: 20,
  seniorYear: 3,
  strongRating: 4.5,
  topRating: 4.8,
  veryActiveMinimumSessions: 10,
} as const;

export const THOTIS_MATCHING_REASON_PREFIXES = {
  goalExpertise: "Expert in:",
} as const;

export const THOTIS_MATCHING_REASON_MESSAGES = {
  exceptionallyHighRating: "Exceptionally high rating",
  experiencedStudent: "Experienced student",
  fieldMatch: "Matches your target field",
  goalExpertise: (goals: string[]) => `${THOTIS_MATCHING_REASON_PREFIXES.goalExpertise} ${goals.join(", ")}`,
  seniorStudentPerspective: "Senior student with perspective",
  veryActiveMentor: "Very active mentor",
  preferredTimes: "Available during preferred times",
} as const;

export const THOTIS_NO_SHOW_SYSTEM_DESCRIPTION = "Automated no-show detection by system lifecycle cron.";
