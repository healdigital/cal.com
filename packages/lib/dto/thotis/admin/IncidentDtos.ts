import { z } from "zod";

// ============================================================================
// Incident Enums
// ============================================================================

export const MentorIncidentTypeDtoSchema = z.enum([
  "INAPPROPRIATE_BEHAVIOR",
  "NO_SHOW",
  "POOR_QUALITY",
  "TECHNICAL_ISSUE",
  "OTHER",
]);

export const MentorModerationActionTypeDtoSchema = z.enum([
  "WARNING",
  "TEMPORARY_SUSPENSION",
  "PERMANENT_BAN",
  "PROFILE_REVIEW",
  "TRAINING_REQUIRED",
]);

// ============================================================================
// Incident DTOs
// ============================================================================

export const IncidentStudentProfileDtoSchema = z.object({
  university: z.string().nullable(),
  user: z.object({
    name: z.string().nullable(),
  }),
});

export const IncidentDtoSchema = z.object({
  id: z.string(),
  type: MentorIncidentTypeDtoSchema,
  description: z.string().nullable(),
  resolved: z.boolean(),
  bookingUid: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  studentProfile: IncidentStudentProfileDtoSchema.nullable(),
});

export const ListIncidentsInputDtoSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  studentProfileId: z.string().optional(),
  type: MentorIncidentTypeDtoSchema.optional(),
  resolved: z.boolean().optional(),
});

export const PaginatedIncidentsDtoSchema = z.object({
  incidents: z.array(IncidentDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

// ============================================================================
// Incident Resolution DTOs
// ============================================================================

export const ResolveIncidentInputDtoSchema = z.object({
  incidentId: z.string(),
});

export const ResolveIncidentOutputDtoSchema = z.object({
  success: z.literal(true),
  incidentId: z.string(),
  resolvedAt: z.string().datetime(),
});

// ============================================================================
// Moderation Action DTOs
// ============================================================================

export const TakeModerationActionInputDtoSchema = z.object({
  studentProfileId: z.string(),
  actionType: MentorModerationActionTypeDtoSchema,
  reason: z.string().optional(),
  updateStatusTo: z.enum(["PENDING_VERIFICATION", "VERIFIED", "SUSPENDED", "DELISTED"]).optional(),
  actionByUserId: z.number().int().positive(),
});

export const ModerationActionDtoSchema = z.object({
  id: z.string(),
  studentProfileId: z.string(),
  actionType: MentorModerationActionTypeDtoSchema,
  reason: z.string().nullable(),
  actionByUserId: z.number().int().positive(),
  createdAt: z.string().datetime(),
});

export const TakeModerationActionOutputDtoSchema = z.object({
  success: z.literal(true),
  action: ModerationActionDtoSchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type MentorIncidentTypeDto = z.infer<typeof MentorIncidentTypeDtoSchema>;
export type MentorModerationActionTypeDto = z.infer<typeof MentorModerationActionTypeDtoSchema>;

export type IncidentStudentProfileDto = z.infer<typeof IncidentStudentProfileDtoSchema>;
export type IncidentDto = z.infer<typeof IncidentDtoSchema>;
export type ListIncidentsInputDto = z.infer<typeof ListIncidentsInputDtoSchema>;
export type PaginatedIncidentsDto = z.infer<typeof PaginatedIncidentsDtoSchema>;

export type ResolveIncidentInputDto = z.infer<typeof ResolveIncidentInputDtoSchema>;
export type ResolveIncidentOutputDto = z.infer<typeof ResolveIncidentOutputDtoSchema>;

export type TakeModerationActionInputDto = z.infer<typeof TakeModerationActionInputDtoSchema>;
export type ModerationActionDto = z.infer<typeof ModerationActionDtoSchema>;
export type TakeModerationActionOutputDto = z.infer<typeof TakeModerationActionOutputDtoSchema>;
