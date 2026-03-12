import { formatWeekday } from "@calcom/lib/dateTimeFormatter";
import type { MentorIncidentType, MentorStatus } from "@calcom/prisma/enums";

type TranslateFn = (key: string) => string;

const INCIDENT_TYPE_TRANSLATION_KEYS: Record<MentorIncidentType, string> = {
  NO_SHOW: "thotis_incident_type_no_show",
  LATE_ARRIVAL: "thotis_incident_type_late_arrival",
  INAPPROPRIATE_BEHAVIOR: "thotis_incident_type_inappropriate_behavior",
  POOR_QUALITY: "thotis_incident_type_poor_quality",
  OTHER: "thotis_incident_type_other",
};

const MENTOR_STATUS_TRANSLATION_KEYS: Record<MentorStatus, string> = {
  PENDING_VERIFICATION: "thotis_mentor_status_pending_verification",
  VERIFIED: "thotis_mentor_status_verified",
  SUSPENDED: "thotis_mentor_status_suspended",
  DELISTED: "thotis_mentor_status_delisted",
};

function formatEnumFallback(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getMentorIncidentTypeLabel(t: TranslateFn, type: string): string {
  const translationKey = INCIDENT_TYPE_TRANSLATION_KEYS[type as MentorIncidentType];
  if (translationKey) {
    return t(translationKey);
  }

  return formatEnumFallback(type);
}

export function getMentorStatusLabel(t: TranslateFn, status: string): string {
  const translationKey = MENTOR_STATUS_TRANSLATION_KEYS[status as MentorStatus];
  if (translationKey) {
    return t(translationKey);
  }

  return formatEnumFallback(status);
}

export function getShortWeekdayLabel(locale: string, day: number): string {
  return formatWeekday(locale, day, "short");
}
