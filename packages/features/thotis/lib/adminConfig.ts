import type { AcademicField } from "@calcom/prisma/enums";

export interface ScheduleConfig {
  days?: number[];
  endTime?: string;
  startTime?: string;
  timeZone?: string;
}

export interface ProvisionAmbassadorInput {
  bio: string;
  degree: string;
  email: string;
  expertise?: string[];
  fieldOfStudy: AcademicField;
  name: string;
  schedule?: ScheduleConfig;
  university: string;
  yearOfStudy: number;
}

export const DEFAULT_SCHEDULE_CONFIG: Required<ScheduleConfig> = {
  days: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "17:00",
  timeZone: "Europe/Paris",
};
