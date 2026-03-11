-- Draft SQL script for partitioning Booking and CalendarCacheEvent tables
-- Goal: Improve performance on high-volume tables over time by partitioning by `createdAt` per quarter or year.
-- Note: This is a manual migration as Prisma doesn't natively support declarative partitions.

-- ==============================================================================
-- 1. Partitioning `CalendarCacheEvent`
-- Safe to do as there are no incoming Foreign Keys to it in the schema.
-- ==============================================================================
-- Step A: Create the new partitioned table
CREATE TABLE "CalendarCacheEventPartitioned" (
  LIKE "CalendarCacheEvent" INCLUDING ALL
) PARTITION BY RANGE ("createdAt");

-- Step B: Recreate Primary Key to include the partition key (PostgreSQL requirement)
ALTER TABLE "CalendarCacheEventPartitioned" DROP CONSTRAINT "CalendarCacheEvent_pkey";
ALTER TABLE "CalendarCacheEventPartitioned" ADD PRIMARY KEY ("id", "createdAt");

-- Step C: Create partitions (example for 2024 and 2025)
CREATE TABLE "CalendarCacheEvent_y2024" PARTITION OF "CalendarCacheEventPartitioned" FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE "CalendarCacheEvent_y2025" PARTITION OF "CalendarCacheEventPartitioned" FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Step D: Migrate data (Warning: Requires downtime or a background migration script)
-- INSERT INTO "CalendarCacheEventPartitioned" SELECT * FROM "CalendarCacheEvent";

-- Step E: Swap tables
-- DROP TABLE "CalendarCacheEvent";
-- ALTER TABLE "CalendarCacheEventPartitioned" RENAME TO "CalendarCacheEvent";


-- ==============================================================================
-- 2. Partitioning `Booking`
-- DANGER: Booking has MANY incoming foreign keys (Attendee, Payment, WorkflowReminder, etc.).
-- All child tables must be updated to reference ("id", "createdAt") instead of just "id".
-- ==============================================================================
-- Step A: Create the partitioned table
CREATE TABLE "BookingPartitioned" (
  LIKE "Booking" INCLUDING ALL
) PARTITION BY RANGE ("createdAt");

-- Step B: Recreate Primary Key
ALTER TABLE "BookingPartitioned" DROP CONSTRAINT "Booking_pkey";
ALTER TABLE "BookingPartitioned" ADD PRIMARY KEY ("id", "createdAt");

-- Step C: Create partitions
CREATE TABLE "Booking_y2024" PARTITION OF "BookingPartitioned" FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE "Booking_y2025" PARTITION OF "BookingPartitioned" FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Step D: Migrate data
-- INSERT INTO "BookingPartitioned" SELECT * FROM "Booking";

-- Step E: Update Foreign Keys referencing Booking
-- Example: Attendee table
-- 1. Add bookingCreatedAt column to Attendee
-- ALTER TABLE "Attendee" ADD COLUMN "bookingCreatedAt" timestamp(3) without time zone;
-- 2. Backfill bookingCreatedAt
-- UPDATE "Attendee" a SET "bookingCreatedAt" = b."createdAt" FROM "Booking" b WHERE a."bookingId" = b.id;
-- 3. Update FK constraint
-- ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_bookingId_fkey";
-- ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_bookingId_fkey" FOREIGN KEY ("bookingId", "bookingCreatedAt") REFERENCES "BookingPartitioned"("id", "createdAt") ON DELETE CASCADE ON UPDATE CASCADE;

-- (Repeat Step E for ALL tables referencing Booking: Payment, WorkflowReminder, BookingReference, DailyEventReference, SelectedCalendar, WebhookScheduledTriggers, OutOfOfficeEntry...)

-- Step F: Swap tables
-- DROP TABLE "Booking" CASCADE;
-- ALTER TABLE "BookingPartitioned" RENAME TO "Booking";
