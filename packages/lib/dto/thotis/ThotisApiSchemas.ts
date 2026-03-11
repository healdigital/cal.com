import { z } from "zod";

export const AcademicFieldDtoSchema = z.enum([
  "DROIT",
  "ECONOMIE_GESTION",
  "SCIENCES_POLITIQUES",
  "INFORMATIQUE",
  "INGENIERIE",
  "SANTE",
  "SCIENCES",
  "LETTRES_LANGUES",
  "ARTS",
  "COMMUNICATION",
  "SPORT",
  "AUTRE",
]);

export const MentorStatusDtoSchema = z.enum(["PENDING_VERIFICATION", "VERIFIED", "SUSPENDED", "DELISTED"]);

export const BookingStatusDtoSchema = z.enum(["PENDING", "ACCEPTED", "CANCELLED", "REJECTED"]);

export const UserOrganizationDtoSchema = z.object({
  id: z.number(),
  slug: z.string().nullable(),
  logoUrl: z.string().nullable().optional(),
});

export const UserOrganizationProfileDtoSchema = z.object({
  organization: UserOrganizationDtoSchema.nullable(),
});

export const MentorUserDtoSchema = z.object({
  name: z.string().nullable(),
  username: z.string().nullable(),
  avatarUrl: z.string().nullable().optional(),
  email: z.string().email().optional(),
  profile: UserOrganizationProfileDtoSchema.nullable().optional(),
  profiles: z.array(UserOrganizationProfileDtoSchema).optional(),
});

export const MentorProfileDtoSchema = z.object({
  id: z.string(),
  userId: z.number(),
  university: z.string(),
  degree: z.string(),
  field: AcademicFieldDtoSchema,
  expertise: z.array(z.string()),
  currentYear: z.number(),
  bio: z.string(),
  profilePhotoUrl: z.string().nullable(),
  linkedInUrl: z.string().nullable(),
  isActive: z.boolean(),
  status: MentorStatusDtoSchema,
  totalSessions: z.number(),
  completedSessions: z.number(),
  cancelledSessions: z.number(),
  averageRating: z.number().nullable(),
  totalRatings: z.number(),
  timezone: z.string().nullable().optional(),
  marketingConsent: z.boolean().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  user: MentorUserDtoSchema,
  matchScore: z.number().optional(),
  matchReasons: z.array(z.string()).optional(),
});

export const PaginatedMentorProfilesDtoSchema = z.object({
  profiles: z.array(MentorProfileDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const BookingResultDtoSchema = z.object({
  bookingId: z.number().int().positive(),
  googleMeetLink: z.string(),
  calendarEventId: z.string(),
  confirmationSent: z.boolean(),
});

export const SessionSummaryPreviewDtoSchema = z.object({
  id: z.string().optional(),
  content: z.string().optional(),
  nextSteps: z.string().nullable().optional(),
  createdAt: z.string().datetime().optional(),
});

export const SessionDtoSchema = z.object({
  id: z.number().int().positive(),
  uid: z.string(),
  title: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: BookingStatusDtoSchema,
  metadata: z.record(z.string(), z.unknown()).nullable(),
  responses: z.record(z.string(), z.unknown()).nullable(),
  user: MentorUserDtoSchema.nullable().optional(),
  cancellationReason: z.string().nullable().optional(),
  thotisSessionSummary: SessionSummaryPreviewDtoSchema.nullable().optional(),
});

export const PaginatedSessionsDtoSchema = z.object({
  bookings: z.array(SessionDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const SessionRatingDtoSchema = z.object({
  id: z.string(),
  bookingId: z.number().int().positive(),
  studentProfileId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const PostSessionSummaryDtoSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  nextSteps: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const PostSessionResourceDtoSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  url: z.string(),
});

export const PostSessionDataDtoSchema = z.object({
  summary: PostSessionSummaryDtoSchema.nullable(),
  resources: z.array(PostSessionResourceDtoSchema),
});

export const ThotisBookingMetadataSchema = z
  .object({
    studentProfileId: z.string().optional(),
    prospectiveStudentEmail: z.string().optional(),
    completedAt: z.string().optional(),
    googleMeetLink: z.string().optional(),
    isFallbackLink: z.boolean().optional(),
    cancelledBy: z.string().optional(),
    cancelledAt: z.string().optional(),
    cancellationReason: z.string().optional(),
    noShowDetectedAt: z.string().optional(),
    oldStartTime: z.string().optional(),
    rescheduledAt: z.string().optional(),
    isThotisSession: z.boolean().optional(),
  })
  .passthrough();

/**
 * Safely parse booking metadata from Prisma's JsonValue.
 * Returns a typed object or an empty object if parsing fails.
 */
export function parseBookingMetadata(raw: unknown): ThotisBookingMetadata {
  if (raw === null || raw === undefined) return {};
  const result = ThotisBookingMetadataSchema.safeParse(raw);
  return result.success ? result.data : {};
}

export const SuccessResponseDtoSchema = z.object({
  success: z.literal(true),
});

export type MentorProfileDto = z.infer<typeof MentorProfileDtoSchema>;
export type PaginatedMentorProfilesDto = z.infer<typeof PaginatedMentorProfilesDtoSchema>;
export type BookingResultDto = z.infer<typeof BookingResultDtoSchema>;
export type SessionDto = z.infer<typeof SessionDtoSchema>;
export type PaginatedSessionsDto = z.infer<typeof PaginatedSessionsDtoSchema>;
export type SessionRatingDto = z.infer<typeof SessionRatingDtoSchema>;
export type PostSessionDataDto = z.infer<typeof PostSessionDataDtoSchema>;
export type ThotisBookingMetadata = z.infer<typeof ThotisBookingMetadataSchema>;
export type SuccessResponseDto = z.infer<typeof SuccessResponseDtoSchema>;
