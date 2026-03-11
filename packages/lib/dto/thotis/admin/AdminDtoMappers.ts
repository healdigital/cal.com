import { toUserDto } from "../ThotisDtoMappers";
// Ambassador imports
import type {
  AdminBookingListItemDto,
  AmbassadorListItemDto,
  AvailabilitySlotDto,
  BookingAttendeeDto,
  BookingDetailsDto,
  BookingEventTypeDto,
  CancelBookingOutputDto,
  MentorScheduleDto,
  PaginatedAdminBookingsDto,
  PaginatedAmbassadorsDto,
  ProvisionAmbassadorOutputDto,
  SendPasswordResetOutputDto,
  UpdateAmbassadorStatusOutputDto,
  UpdateMentorProfileOutputDto,
  UpdateMentorScheduleOutputDto,
} from "./AmbassadorDtos";
import {
  AdminBookingListItemDtoSchema,
  AmbassadorListItemDtoSchema,
  AvailabilitySlotDtoSchema,
  BookingAttendeeDtoSchema,
  BookingDetailsDtoSchema,
  BookingEventTypeDtoSchema,
  CancelBookingOutputDtoSchema,
  MentorScheduleDtoSchema,
  PaginatedAdminBookingsDtoSchema,
  PaginatedAmbassadorsDtoSchema,
  ProvisionAmbassadorOutputDtoSchema,
  SendPasswordResetOutputDtoSchema,
  UpdateAmbassadorStatusOutputDtoSchema,
  UpdateMentorProfileOutputDtoSchema,
  UpdateMentorScheduleOutputDtoSchema,
} from "./AmbassadorDtos";
// Incident imports
import type {
  IncidentDto,
  IncidentStudentProfileDto,
  ModerationActionDto,
  PaginatedIncidentsDto,
  ResolveIncidentOutputDto,
  TakeModerationActionOutputDto,
} from "./IncidentDtos";
import {
  IncidentDtoSchema,
  IncidentStudentProfileDtoSchema,
  ModerationActionDtoSchema,
  PaginatedIncidentsDtoSchema,
  ResolveIncidentOutputDtoSchema,
  TakeModerationActionOutputDtoSchema,
} from "./IncidentDtos";
// Statistics imports
import type { MentorExportDataDto, PlatformStatsDto } from "./StatisticsDtos";
import { MentorExportDataDtoSchema, PlatformStatsDtoSchema } from "./StatisticsDtos";

// ============================================================================
// Helper Functions
// ============================================================================

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toIsoString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return new Date(value).toISOString();
  }
  return new Date(value as number).toISOString();
}

function getString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  return fallback;
}

function getNullableString(value: unknown): string | null {
  if (typeof value === "string" || value === null) {
    return value;
  }
  return null;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

// ============================================================================
// Ambassador DTOs Mappers
// ============================================================================

export function toProvisionAmbassadorOutputDto(value: unknown): ProvisionAmbassadorOutputDto {
  const record = asRecord(value);
  return ProvisionAmbassadorOutputDtoSchema.parse({
    userId: Number(record?.userId),
    profileId: String(record?.profileId),
    username: getString(record?.username),
    email: getString(record?.email),
    scheduleId: record?.scheduleId ? Number(record.scheduleId) : undefined,
  });
}

export function toAmbassadorListItemDto(value: unknown): AmbassadorListItemDto {
  const record = asRecord(value);
  let averageRating: number | null = null;
  if (record?.averageRating !== null && record?.averageRating !== undefined) {
    averageRating = Number(record.averageRating);
  }

  return AmbassadorListItemDtoSchema.parse({
    id: String(record?.id),
    userId: Number(record?.userId),
    university: getNullableString(record?.university),
    degree: getNullableString(record?.degree),
    field: getNullableString(record?.field),
    expertise: getStringArray(record?.expertise),
    currentYear: record?.currentYear ? Number(record.currentYear) : null,
    bio: getNullableString(record?.bio),
    status: getString(record?.status, "PENDING_VERIFICATION"),
    totalSessions: record?.totalSessions ? Number(record.totalSessions) : null,
    completedSessions: record?.completedSessions ? Number(record.completedSessions) : null,
    averageRating,
    user: toUserDto(record?.user),
  });
}

export function toPaginatedAmbassadorsDto(value: {
  profiles: unknown[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedAmbassadorsDto {
  return PaginatedAmbassadorsDtoSchema.parse({
    ...value,
    profiles: value.profiles.map((profile) => toAmbassadorListItemDto(profile)),
  });
}

export function toUpdateAmbassadorStatusOutputDto(
  profileId: string,
  newStatus: string
): UpdateAmbassadorStatusOutputDto {
  return UpdateAmbassadorStatusOutputDtoSchema.parse({
    success: true,
    profileId,
    newStatus,
  });
}

export function toUpdateMentorProfileOutputDto(profileId: string): UpdateMentorProfileOutputDto {
  return UpdateMentorProfileOutputDtoSchema.parse({
    success: true,
    profileId,
  });
}

export function toSendPasswordResetOutputDto(userId: number, emailSent: boolean): SendPasswordResetOutputDto {
  return SendPasswordResetOutputDtoSchema.parse({
    success: true,
    userId,
    emailSent,
  });
}

// ============================================================================
// Schedule DTOs Mappers
// ============================================================================

export function toAvailabilitySlotDto(value: unknown): AvailabilitySlotDto {
  const record = asRecord(value);
  return AvailabilitySlotDtoSchema.parse({
    days: Array.isArray(record?.days) ? record.days : [],
    startTime: getString(record?.startTime),
    endTime: getString(record?.endTime),
  });
}

export function toMentorScheduleDto(value: unknown): MentorScheduleDto {
  const record = asRecord(value);
  const availability = Array.isArray(record?.availability)
    ? record.availability.map((slot) => toAvailabilitySlotDto(slot))
    : [];

  return MentorScheduleDtoSchema.parse({
    userId: Number(record?.userId),
    timeZone: getString(record?.timeZone, "Europe/Paris"),
    availability,
  });
}

export function toUpdateMentorScheduleOutputDto(scheduleId: number): UpdateMentorScheduleOutputDto {
  return UpdateMentorScheduleOutputDtoSchema.parse({
    success: true,
    scheduleId,
  });
}

// ============================================================================
// Incident DTOs Mappers
// ============================================================================

export function toIncidentStudentProfileDto(value: unknown): IncidentStudentProfileDto | null {
  const record = asRecord(value);
  if (!record) return null;

  const user = asRecord(record.user);
  return IncidentStudentProfileDtoSchema.parse({
    university: getNullableString(record.university),
    user: {
      name: getNullableString(user?.name),
    },
  });
}

export function toIncidentDto(value: unknown): IncidentDto {
  const record = asRecord(value);
  return IncidentDtoSchema.parse({
    id: String(record?.id),
    type: getString(record?.type, "OTHER"),
    description: getNullableString(record?.description),
    resolved: Boolean(record?.resolved),
    bookingUid: getNullableString(record?.bookingUid),
    createdAt: toIsoString(record?.createdAt),
    updatedAt: toIsoString(record?.updatedAt),
    studentProfile: toIncidentStudentProfileDto(record?.studentProfile),
  });
}

export function toPaginatedIncidentsDto(value: {
  incidents: unknown[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedIncidentsDto {
  return PaginatedIncidentsDtoSchema.parse({
    ...value,
    incidents: value.incidents.map((incident) => toIncidentDto(incident)),
  });
}

export function toResolveIncidentOutputDto(incidentId: string): ResolveIncidentOutputDto {
  return ResolveIncidentOutputDtoSchema.parse({
    success: true,
    incidentId,
    resolvedAt: new Date().toISOString(),
  });
}

export function toModerationActionDto(value: unknown): ModerationActionDto {
  const record = asRecord(value);
  return ModerationActionDtoSchema.parse({
    id: String(record?.id),
    studentProfileId: String(record?.studentProfileId),
    actionType: getString(record?.actionType, "WARNING"),
    reason: getNullableString(record?.reason),
    actionByUserId: Number(record?.actionByUserId),
    createdAt: toIsoString(record?.createdAt),
  });
}

export function toTakeModerationActionOutputDto(action: unknown): TakeModerationActionOutputDto {
  return TakeModerationActionOutputDtoSchema.parse({
    success: true,
    action: toModerationActionDto(action),
  });
}

// ============================================================================
// Booking DTOs Mappers
// ============================================================================

export function toBookingAttendeeDto(value: unknown): BookingAttendeeDto {
  const record = asRecord(value);
  return BookingAttendeeDtoSchema.parse({
    id: Number(record?.id),
    email: getString(record?.email),
    name: getString(record?.name),
    timeZone: getString(record?.timeZone, "UTC"),
    locale: getNullableString(record?.locale),
  });
}

export function toBookingEventTypeDto(value: unknown): BookingEventTypeDto | null {
  const record = asRecord(value);
  if (!record) return null;

  return BookingEventTypeDtoSchema.parse({
    id: Number(record.id),
    title: getString(record.title),
    slug: getString(record.slug),
    length: Number(record.length ?? 0),
  });
}

export function toAdminBookingListItemDto(value: unknown): AdminBookingListItemDto {
  const record = asRecord(value);
  const attendees = Array.isArray(record?.attendees)
    ? record.attendees.map((a) => {
        const attendee = asRecord(a);
        return {
          email: getString(attendee?.email),
          name: getString(attendee?.name),
        };
      })
    : [];

  return AdminBookingListItemDtoSchema.parse({
    id: Number(record?.id),
    uid: getString(record?.uid),
    title: getString(record?.title),
    startTime: toIsoString(record?.startTime),
    endTime: toIsoString(record?.endTime),
    status: getString(record?.status, "PENDING"),
    user: record?.user ? toUserDto(record.user) : null,
    attendees,
    metadata: asRecord(record?.metadata),
    responses: asRecord(record?.responses),
    cancellationReason: getNullableString(record?.cancellationReason),
  });
}

export function toPaginatedAdminBookingsDto(value: {
  bookings: unknown[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedAdminBookingsDto {
  return PaginatedAdminBookingsDtoSchema.parse({
    ...value,
    bookings: value.bookings.map((booking) => toAdminBookingListItemDto(booking)),
  });
}

export function toBookingDetailsDto(value: unknown): BookingDetailsDto {
  const record = asRecord(value);
  const attendees = Array.isArray(record?.attendees)
    ? record.attendees.map((a) => toBookingAttendeeDto(a))
    : [];

  return BookingDetailsDtoSchema.parse({
    id: Number(record?.id),
    uid: getString(record?.uid),
    title: getString(record?.title),
    description: getNullableString(record?.description),
    startTime: toIsoString(record?.startTime),
    endTime: toIsoString(record?.endTime),
    status: getString(record?.status, "PENDING"),
    user: record?.user ? toUserDto(record.user) : null,
    attendees,
    eventType: toBookingEventTypeDto(record?.eventType),
    metadata: asRecord(record?.metadata),
    responses: asRecord(record?.responses),
    cancellationReason: getNullableString(record?.cancellationReason),
    rescheduledFromUid: getNullableString(record?.rescheduledFromUid),
    createdAt: toIsoString(record?.createdAt),
    updatedAt: toIsoString(record?.updatedAt),
  });
}

export function toCancelBookingOutputDto(bookingId: number): CancelBookingOutputDto {
  return CancelBookingOutputDtoSchema.parse({
    success: true,
    bookingId,
    cancelledAt: new Date().toISOString(),
  });
}

// ============================================================================
// Statistics DTOs Mappers
// ============================================================================

export function toPlatformStatsDto(value: unknown): PlatformStatsDto {
  return PlatformStatsDtoSchema.parse(value);
}

export function toMentorExportDataDto(value: unknown): MentorExportDataDto {
  const record = asRecord(value);
  let averageRating: number | null = null;
  if (record?.averageRating !== null && record?.averageRating !== undefined) {
    averageRating = Number(record.averageRating);
  }

  return MentorExportDataDtoSchema.parse({
    id: String(record?.id),
    name: getNullableString(record?.name),
    email: getString(record?.email),
    university: getNullableString(record?.university),
    field: getNullableString(record?.field),
    degree: getNullableString(record?.degree),
    currentYear: record?.currentYear ? Number(record.currentYear) : null,
    status: getString(record?.status, "PENDING_VERIFICATION"),
    totalSessions: record?.totalSessions ? Number(record.totalSessions) : null,
    completedSessions: record?.completedSessions ? Number(record.completedSessions) : null,
    cancelledSessions: record?.cancelledSessions ? Number(record.cancelledSessions) : null,
    averageRating,
    totalRatings: record?.totalRatings ? Number(record.totalRatings) : null,
    createdAt: toIsoString(record?.createdAt),
  });
}
