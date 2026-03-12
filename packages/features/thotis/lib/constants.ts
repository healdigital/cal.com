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

export const THOTIS_MATCHING_REASON_MESSAGES = {
  exceptionallyHighRating: "Exceptionally high rating",
  experiencedStudent: "Experienced student",
  fieldMatch: "Matches your target field",
  goalExpertise: (goals: string[]) => `Expert in: ${goals.join(", ")}`,
  seniorStudentPerspective: "Senior student with perspective",
  veryActiveMentor: "Very active mentor",
  preferredTimes: "Available during preferred times",
} as const;

export const THOTIS_NO_SHOW_SYSTEM_DESCRIPTION = "Automated no-show detection by system lifecycle cron.";
