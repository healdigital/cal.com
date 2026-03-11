import type {
  BookingResultDto,
  MentorProfileDto,
  PaginatedMentorProfilesDto,
  PaginatedSessionsDto,
  PostSessionDataDto,
  SessionDto,
  SessionRatingDto,
  SuccessResponseDto,
} from "./ThotisApiSchemas";
import {
  BookingResultDtoSchema,
  MentorProfileDtoSchema,
  PaginatedMentorProfilesDtoSchema,
  PaginatedSessionsDtoSchema,
  PostSessionDataDtoSchema,
  SessionDtoSchema,
  SessionRatingDtoSchema,
  SuccessResponseDtoSchema,
  ThotisBookingMetadataSchema,
} from "./ThotisApiSchemas";

type OrganizationProfileDto = NonNullable<NonNullable<MentorProfileDto["user"]["profile"]>>;
type MentorUserDto = MentorProfileDto["user"];
type SessionSummaryPreviewDto = NonNullable<NonNullable<SessionDto["thotisSessionSummary"]>>;
type PostSessionSummaryDto = NonNullable<NonNullable<PostSessionDataDto["summary"]>>;
type PostSessionResourceDto = PostSessionDataDto["resources"][number];

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

function getString(value: unknown, fallback: string = ""): string {
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

function getOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

function getNullableBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean" || value === null) {
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

function toOrganizationProfileDto(value: unknown): OrganizationProfileDto {
  const record = asRecord(value);
  const organization = asRecord(record?.organization);

  if (!organization) {
    return { organization: null };
  }

  return {
    organization: {
      id: Number(organization.id),
      slug: getNullableString(organization.slug),
      logoUrl: getNullableString(organization.logoUrl),
    },
  };
}

function toUserDto(value: unknown): MentorUserDto {
  const record = asRecord(value);
  let rawProfiles: unknown[] = [];

  if (Array.isArray(record?.profiles)) {
    rawProfiles = record.profiles;
  } else if (record?.profile) {
    rawProfiles = [record.profile];
  }

  const profiles = rawProfiles.map((profile) => toOrganizationProfileDto(profile));

  return {
    name: getNullableString(record?.name),
    username: getNullableString(record?.username),
    avatarUrl: getNullableString(record?.avatarUrl),
    email: getOptionalString(record?.email),
    profiles,
    profile: profiles[0] ?? null,
  };
}

function toSessionSummaryPreviewDto(value: unknown): SessionSummaryPreviewDto | null {
  const summary = asRecord(value);
  if (!summary) {
    return null;
  }

  let createdAt: string | undefined;
  if (summary.createdAt) {
    createdAt = toIsoString(summary.createdAt);
  }

  return {
    id: getOptionalString(summary.id),
    content: getOptionalString(summary.content),
    nextSteps: getNullableString(summary.nextSteps),
    createdAt,
  };
}

function toPostSessionSummaryDto(value: unknown): PostSessionSummaryDto | null {
  const summary = asRecord(value);
  if (!summary) {
    return null;
  }

  return {
    id: getOptionalString(summary.id),
    content: getString(summary.content),
    nextSteps: getNullableString(summary.nextSteps),
    createdAt: toIsoString(summary.createdAt),
  };
}

function toPostSessionResourceDto(value: unknown): PostSessionResourceDto {
  const resource = asRecord(value);

  return {
    id: String(resource?.id),
    type: getString(resource?.type),
    title: getString(resource?.title),
    url: getString(resource?.url),
  };
}

export function toMentorProfileDto(value: unknown): MentorProfileDto {
  const record = asRecord(value);
  let averageRating: number | null = null;
  if (record?.averageRating !== null && record?.averageRating !== undefined) {
    averageRating = Number(record.averageRating);
  }

  let matchScore: number | undefined;
  if (typeof record?.matchScore === "number") {
    matchScore = record.matchScore;
  }

  let matchReasons: string[] | undefined;
  if (Array.isArray(record?.matchReasons)) {
    matchReasons = getStringArray(record.matchReasons);
  }

  return MentorProfileDtoSchema.parse({
    id: String(record?.id),
    userId: Number(record?.userId),
    university: getString(record?.university),
    degree: getString(record?.degree),
    field: getString(record?.field, "AUTRE"),
    expertise: getStringArray(record?.expertise),
    currentYear: Number(record?.currentYear ?? 0),
    bio: getString(record?.bio),
    profilePhotoUrl: getNullableString(record?.profilePhotoUrl),
    linkedInUrl: getNullableString(record?.linkedInUrl),
    isActive: Boolean(record?.isActive),
    status: getString(record?.status, "PENDING_VERIFICATION"),
    totalSessions: Number(record?.totalSessions ?? 0),
    completedSessions: Number(record?.completedSessions ?? 0),
    cancelledSessions: Number(record?.cancelledSessions ?? 0),
    averageRating,
    totalRatings: Number(record?.totalRatings ?? 0),
    timezone: getNullableString(record?.timezone),
    marketingConsent: getNullableBoolean(record?.marketingConsent),
    createdAt: toIsoString(record?.createdAt),
    updatedAt: toIsoString(record?.updatedAt),
    user: toUserDto(record?.user),
    matchScore,
    matchReasons,
  });
}

export function toNullableMentorProfileDto(value: unknown): MentorProfileDto | null {
  if (!value) {
    return null;
  }

  return toMentorProfileDto(value);
}

export function toPaginatedMentorProfilesDto(value: {
  profiles: unknown[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedMentorProfilesDto {
  return PaginatedMentorProfilesDtoSchema.parse({
    ...value,
    profiles: value.profiles.map((profile) => toMentorProfileDto(profile)),
  });
}

export function toBookingResultDto(value: unknown): BookingResultDto {
  return BookingResultDtoSchema.parse(value);
}

export function toSessionDto(value: unknown): SessionDto {
  const record = asRecord(value);
  let user: MentorUserDto | null = null;
  if (record?.user) {
    user = toUserDto(record.user);
  }

  return SessionDtoSchema.parse({
    id: Number(record?.id),
    uid: String(record?.uid),
    title: getString(record?.title),
    startTime: toIsoString(record?.startTime),
    endTime: toIsoString(record?.endTime),
    status: getString(record?.status, "PENDING"),
    metadata: asRecord(record?.metadata),
    responses: asRecord(record?.responses),
    user,
    cancellationReason: getNullableString(record?.cancellationReason),
    thotisSessionSummary: toSessionSummaryPreviewDto(record?.thotisSessionSummary),
  });
}

export function toSessionDtoArray(values: unknown[]): SessionDto[] {
  return values.map((value) => toSessionDto(value));
}

export function toPaginatedSessionsDto(value: {
  bookings: unknown[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedSessionsDto {
  return PaginatedSessionsDtoSchema.parse({
    ...value,
    bookings: value.bookings.map((booking) => toSessionDto(booking)),
  });
}

export function toSessionRatingDto(value: unknown): SessionRatingDto {
  const record = asRecord(value);

  return SessionRatingDtoSchema.parse({
    id: String(record?.id),
    bookingId: Number(record?.bookingId),
    studentProfileId: String(record?.studentProfileId),
    rating: Number(record?.rating),
    feedback: getNullableString(record?.feedback),
    createdAt: toIsoString(record?.createdAt),
  });
}

export function toNullableSessionRatingDto(value: unknown): SessionRatingDto | null {
  if (!value) {
    return null;
  }

  return toSessionRatingDto(value);
}

export function toPostSessionDataDto(value: { summary: unknown; resources?: unknown[] }): PostSessionDataDto {
  const resources = value.resources ?? [];

  return PostSessionDataDtoSchema.parse({
    summary: toPostSessionSummaryDto(value.summary),
    resources: resources.map((resource) => toPostSessionResourceDto(resource)),
  });
}

export function parseThotisMetadata(metadata: unknown): Record<string, unknown> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const result = ThotisBookingMetadataSchema.safeParse(metadata);
  if (result.success) {
    return result.data as Record<string, unknown>;
  }

  return metadata as Record<string, unknown>;
}

export function toSuccessResponseDto(): SuccessResponseDto {
  return SuccessResponseDtoSchema.parse({ success: true });
}
