import { z } from "zod";
import { AcademicFieldDtoSchema, MentorStatusDtoSchema, MentorUserDtoSchema } from "../ThotisApiSchemas";
import { thotisAdminPageSizeSchema, thotisEmailSchema, thotisPublicPageSchema } from "../ThotisValidationSchemas";

// ============================================================================
// Schedule DTOs
// ============================================================================

export const ScheduleConfigDtoSchema = z.object({
  days: z.array(z.number().int().min(0).max(6)).optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")
    .optional(),
  timeZone: z.string().optional(),
});

export const AvailabilitySlotDtoSchema = z.object({
  days: z.array(z.number().int().min(0).max(6)),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const MentorScheduleDtoSchema = z.object({
  userId: z.number().int().positive(),
  timeZone: z.string(),
  availability: z.array(AvailabilitySlotDtoSchema),
});

// ============================================================================
// Ambassador Provisioning DTOs
// ============================================================================

export const ProvisionAmbassadorInputDtoSchema = z.object({
  name: z.string().min(1),
  email: thotisEmailSchema,
  fieldOfStudy: AcademicFieldDtoSchema,
  university: z.string().min(1),
  degree: z.string().min(1),
  yearOfStudy: z.number().int().min(1).max(10),
  bio: z.string().min(1),
  expertise: z.array(z.string()).optional(),
  schedule: ScheduleConfigDtoSchema.optional(),
});

export const ProvisionAmbassadorOutputDtoSchema = z.object({
  userId: z.number().int().positive(),
  profileId: z.string(),
  username: z.string(),
  email: thotisEmailSchema,
  scheduleId: z.number().int().positive().optional(),
});

// ============================================================================
// Ambassador List DTOs
// ============================================================================

export const ListAmbassadorsInputDtoSchema = z.object({
  page: thotisPublicPageSchema.optional(),
  pageSize: thotisAdminPageSizeSchema.optional(),
  fieldOfStudy: AcademicFieldDtoSchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const AmbassadorListItemDtoSchema = z.object({
  id: z.string(),
  userId: z.number().int().positive(),
  university: z.string().nullable(),
  degree: z.string().nullable(),
  field: z.string().nullable(),
  expertise: z.array(z.string()),
  currentYear: z.number().int().nullable(),
  bio: z.string().nullable(),
  status: MentorStatusDtoSchema,
  totalSessions: z.number().int().nonnegative().nullable(),
  completedSessions: z.number().int().nonnegative().nullable(),
  averageRating: z.number().nullable(),
  user: MentorUserDtoSchema,
});

export const PaginatedAmbassadorsDtoSchema = z.object({
  profiles: z.array(AmbassadorListItemDtoSchema),
  total: z.number().int().nonnegative(),
  page: thotisPublicPageSchema,
  pageSize: thotisAdminPageSizeSchema,
});

// ============================================================================
// Ambassador Status Update DTOs
// ============================================================================

export const UpdateAmbassadorStatusInputDtoSchema = z.object({
  profileId: z.string(),
  status: MentorStatusDtoSchema,
});

export const UpdateAmbassadorStatusOutputDtoSchema = z.object({
  success: z.literal(true),
  profileId: z.string(),
  newStatus: MentorStatusDtoSchema,
});

// ============================================================================
// Ambassador Profile Update DTOs
// ============================================================================

export const UpdateMentorProfileInputDtoSchema = z.object({
  profileId: z.string(),
  bio: z.string().min(1).optional(),
  university: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field: AcademicFieldDtoSchema.optional(),
  expertise: z.array(z.string()).optional(),
  currentYear: z.number().int().min(1).max(10).optional(),
});

export const UpdateMentorProfileOutputDtoSchema = z.object({
  success: z.literal(true),
  profileId: z.string(),
});

// ============================================================================
// Password Reset DTOs
// ============================================================================

export const SendPasswordResetInputDtoSchema = z.object({
  userId: z.number().int().positive(),
});

export const SendPasswordResetOutputDtoSchema = z.object({
  success: z.literal(true),
  userId: z.number().int().positive(),
  emailSent: z.boolean(),
});

// ============================================================================
// Schedule Management DTOs
// ============================================================================

export const GetMentorScheduleInputDtoSchema = z.object({
  mentorUserId: z.number().int().positive(),
});

export const UpdateMentorScheduleInputDtoSchema = z.object({
  mentorUserId: z.number().int().positive(),
  timeZone: z.string().optional(),
  availability: z.array(AvailabilitySlotDtoSchema),
});

export const UpdateMentorScheduleOutputDtoSchema = z.object({
  success: z.literal(true),
  scheduleId: z.number().int().positive(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ScheduleConfigDto = z.infer<typeof ScheduleConfigDtoSchema>;
export type AvailabilitySlotDto = z.infer<typeof AvailabilitySlotDtoSchema>;
export type MentorScheduleDto = z.infer<typeof MentorScheduleDtoSchema>;

export type ProvisionAmbassadorInputDto = z.infer<typeof ProvisionAmbassadorInputDtoSchema>;
export type ProvisionAmbassadorOutputDto = z.infer<typeof ProvisionAmbassadorOutputDtoSchema>;

export type ListAmbassadorsInputDto = z.infer<typeof ListAmbassadorsInputDtoSchema>;
export type AmbassadorListItemDto = z.infer<typeof AmbassadorListItemDtoSchema>;
export type PaginatedAmbassadorsDto = z.infer<typeof PaginatedAmbassadorsDtoSchema>;

export type UpdateAmbassadorStatusInputDto = z.infer<typeof UpdateAmbassadorStatusInputDtoSchema>;
export type UpdateAmbassadorStatusOutputDto = z.infer<typeof UpdateAmbassadorStatusOutputDtoSchema>;

export type UpdateMentorProfileInputDto = z.infer<typeof UpdateMentorProfileInputDtoSchema>;
export type UpdateMentorProfileOutputDto = z.infer<typeof UpdateMentorProfileOutputDtoSchema>;

export type SendPasswordResetInputDto = z.infer<typeof SendPasswordResetInputDtoSchema>;
export type SendPasswordResetOutputDto = z.infer<typeof SendPasswordResetOutputDtoSchema>;

export type GetMentorScheduleInputDto = z.infer<typeof GetMentorScheduleInputDtoSchema>;
export type UpdateMentorScheduleInputDto = z.infer<typeof UpdateMentorScheduleInputDtoSchema>;
export type UpdateMentorScheduleOutputDto = z.infer<typeof UpdateMentorScheduleOutputDtoSchema>;
