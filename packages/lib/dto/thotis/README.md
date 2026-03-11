# Thotis DTOs

This directory contains comprehensive Data Transfer Objects (DTOs) for the Thotis mentoring platform. DTOs are used at all boundaries to ensure type safety and data validation.

## Structure

```
thotis/
├── ThotisApiSchemas.ts      # Core API schemas (profiles, sessions, ratings)
├── ThotisDtoMappers.ts      # Core mappers for API schemas
├── admin/                   # Admin-specific DTOs
│   ├── AmbassadorDtos.ts    # Ambassador management DTOs
│   ├── IncidentDtos.ts      # Incident and moderation DTOs
│   ├── BookingDtos.ts       # Admin booking management DTOs
│   ├── StatisticsDtos.ts    # Platform statistics DTOs
│   ├── AdminDtoMappers.ts   # Mappers for admin DTOs
│   └── index.ts             # Admin exports
├── index.ts                 # Main exports
└── README.md                # This file
```

## Usage

### Core DTOs

Core DTOs are used for public-facing APIs and general platform operations:

```typescript
import {
  type MentorProfileDto,
  type PaginatedMentorProfilesDto,
  type SessionDto,
  toMentorProfileDto,
  toPaginatedMentorProfilesDto,
} from "@calcom/lib/dto/thotis";

// Map raw data to DTO
const profileDto = toMentorProfileDto(rawProfile);

// Validate and parse
const validated = MentorProfileDtoSchema.parse(data);
```

### Admin DTOs

Admin DTOs are used for administrative operations:

```typescript
import {
  type ProvisionAmbassadorInputDto,
  type AmbassadorListItemDto,
  type IncidentDto,
  toAmbassadorListItemDto,
  toPaginatedIncidentsDto,
} from "@calcom/lib/dto/thotis/admin";

// Map ambassador data
const ambassadorDto = toAmbassadorListItemDto(rawData);

// Map incidents
const incidentsDto = toPaginatedIncidentsDto({
  incidents: rawIncidents,
  total: 100,
  page: 1,
  pageSize: 20,
});
```

## DTO Categories

### 1. Ambassador Management

**Files**: `admin/AmbassadorDtos.ts`

- `ProvisionAmbassadorInputDto` - Create new ambassador accounts
- `AmbassadorListItemDto` - Ambassador list items
- `PaginatedAmbassadorsDto` - Paginated ambassador lists
- `UpdateAmbassadorStatusDto` - Status updates
- `UpdateMentorProfileDto` - Profile updates
- `MentorScheduleDto` - Schedule management

### 2. Incidents & Moderation

**Files**: `admin/IncidentDtos.ts`

- `IncidentDto` - Incident reports
- `PaginatedIncidentsDto` - Paginated incidents
- `ModerationActionDto` - Moderation actions
- `ResolveIncidentDto` - Incident resolution

### 3. Booking Management

**Files**: `admin/BookingDtos.ts`

- `AdminBookingListItemDto` - Booking list items
- `BookingDetailsDto` - Detailed booking information
- `PaginatedAdminBookingsDto` - Paginated bookings
- `CancelBookingDto` - Booking cancellation

### 4. Statistics

**Files**: `admin/StatisticsDtos.ts`

- `PlatformStatsDto` - Platform-wide statistics
- `TrendsDto` - Trend data (daily, weekly, monthly)
- `FunnelDataDto` - Conversion funnel metrics
- `MentorExportDataDto` - Export data format

## Validation

All DTOs use Zod schemas for runtime validation:

```typescript
import { ProvisionAmbassadorInputDtoSchema } from "@calcom/lib/dto/thotis/admin";

// Validate input
const result = ProvisionAmbassadorInputDtoSchema.safeParse(input);
if (!result.success) {
  console.error(result.error);
}
```

## Mappers

Mapper functions convert raw database/service data to validated DTOs:

```typescript
// Always returns validated DTO or throws
const dto = toMentorProfileDto(rawData);

// For nullable data
const dto = toNullableMentorProfileDto(rawData); // Returns DTO | null
```

## Best Practices

1. **Use DTOs at boundaries**: Always use DTOs when data crosses boundaries (API responses, tRPC endpoints, service returns)

2. **Validate early**: Validate input DTOs as early as possible in the request lifecycle

3. **Map consistently**: Use provided mapper functions instead of manual mapping

4. **Type imports**: Use `import type` for DTO types:
   ```typescript
   import type { MentorProfileDto } from "@calcom/lib/dto/thotis";
   ```

5. **Schema exports**: Schemas are exported for validation:
   ```typescript
   import { MentorProfileDtoSchema } from "@calcom/lib/dto/thotis";
   ```

## Adding New DTOs

When adding new DTOs:

1. Create the schema using Zod in the appropriate file
2. Export the type using `z.infer<typeof Schema>`
3. Create mapper functions in the corresponding mapper file
4. Export from the appropriate index file
5. Document the DTO in this README

## Migration Guide

To migrate existing code to use DTOs:

1. Identify boundary points (API responses, tRPC returns, service outputs)
2. Replace inline types with DTO types
3. Add mapper calls to convert raw data to DTOs
4. Add validation where appropriate
5. Update tests to use DTOs

Example:

```typescript
// Before
async function getProfile(id: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id },
    include: { user: true },
  });
  return profile; // Raw Prisma type
}

// After
async function getProfile(id: string): Promise<MentorProfileDto> {
  const profile = await prisma.studentProfile.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      // ... other fields
      user: {
        select: {
          name: true,
          email: true,
          // ... other fields
        },
      },
    },
  });
  return toMentorProfileDto(profile);
}
```
