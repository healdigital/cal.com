import { z } from "zod";

// ============================================================================
// Platform Statistics DTOs
// ============================================================================

export const DataQualityIssueDtoSchema = z.object({
  issues: z.array(z.string()),
});

export const TrendPeriodDataDtoSchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
});

export const TrendsDtoSchema = z.object({
  daily: z.array(TrendPeriodDataDtoSchema),
  weekly: z.array(TrendPeriodDataDtoSchema),
  monthly: z.array(TrendPeriodDataDtoSchema),
});

export const FunnelDataDtoSchema = z.object({
  counts: z.object({
    profile_viewed: z.number().int().nonnegative(),
    booking_started: z.number().int().nonnegative(),
    booking_confirmed: z.number().int().nonnegative(),
    session_completed: z.number().int().nonnegative(),
  }),
  conversion: z.object({
    profile_to_booking_started: z.number(),
    booking_started_to_confirmed: z.number(),
  }),
});

export const FieldDistributionItemDtoSchema = z.object({
  field: z.string(),
  _count: z.object({
    id: z.number().int().nonnegative(),
  }),
});

export const PlatformStatsDtoSchema = z.object({
  _count: z.object({
    id: z.number().int().nonnegative(),
  }),
  _sum: z.object({
    totalSessions: z.number().int().nonnegative().nullable(),
    completedSessions: z.number().int().nonnegative().nullable(),
  }),
  _avg: z.object({
    averageRating: z.number().nullable(),
  }),
  dataQuality: DataQualityIssueDtoSchema.optional(),
  trends: TrendsDtoSchema.optional(),
  funnel: FunnelDataDtoSchema.optional(),
  fieldDistribution: z.array(FieldDistributionItemDtoSchema).optional(),
});

// ============================================================================
// Export Statistics DTOs
// ============================================================================

export const MentorExportDataDtoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  university: z.string().nullable(),
  field: z.string().nullable(),
  degree: z.string().nullable(),
  currentYear: z.number().int().nullable(),
  status: z.string(),
  totalSessions: z.number().int().nonnegative().nullable(),
  completedSessions: z.number().int().nonnegative().nullable(),
  cancelledSessions: z.number().int().nonnegative().nullable(),
  averageRating: z.number().nullable(),
  totalRatings: z.number().int().nonnegative().nullable(),
  createdAt: z.string().datetime(),
});

export const ExportStatisticsOutputDtoSchema = z.object({
  mentors: z.array(MentorExportDataDtoSchema),
  generatedAt: z.string().datetime(),
  totalCount: z.number().int().nonnegative(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type DataQualityIssueDto = z.infer<typeof DataQualityIssueDtoSchema>;
export type TrendPeriodDataDto = z.infer<typeof TrendPeriodDataDtoSchema>;
export type TrendsDto = z.infer<typeof TrendsDtoSchema>;
export type FunnelDataDto = z.infer<typeof FunnelDataDtoSchema>;
export type FieldDistributionItemDto = z.infer<typeof FieldDistributionItemDtoSchema>;
export type PlatformStatsDto = z.infer<typeof PlatformStatsDtoSchema>;

export type MentorExportDataDto = z.infer<typeof MentorExportDataDtoSchema>;
export type ExportStatisticsOutputDto = z.infer<typeof ExportStatisticsOutputDtoSchema>;
