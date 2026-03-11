-- UUID Migration for Thotis Tables
-- Converts Int autoincrement PKs to String (cuid) PKs for:
--   ThotisOrientationIntent, ThotisSessionSummary, ThotisSessionResource
-- None of these tables have incoming foreign keys, so only the id column changes.

-- ============================================================
-- 1. ThotisOrientationIntent
-- ============================================================

-- Add new text id column
ALTER TABLE "ThotisOrientationIntent" ADD COLUMN "new_id" TEXT;

-- Generate cuid-like IDs for existing rows
UPDATE "ThotisOrientationIntent"
SET "new_id" = 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);

-- Make it NOT NULL now that all rows have values
ALTER TABLE "ThotisOrientationIntent" ALTER COLUMN "new_id" SET NOT NULL;

-- Drop the old primary key and id column
ALTER TABLE "ThotisOrientationIntent" DROP CONSTRAINT "ThotisOrientationIntent_pkey";
ALTER TABLE "ThotisOrientationIntent" DROP COLUMN "id";

-- Rename new_id to id
ALTER TABLE "ThotisOrientationIntent" RENAME COLUMN "new_id" TO "id";

-- Add primary key constraint on the new id
ALTER TABLE "ThotisOrientationIntent" ADD CONSTRAINT "ThotisOrientationIntent_pkey" PRIMARY KEY ("id");

-- ============================================================
-- 2. ThotisSessionSummary
-- ============================================================

ALTER TABLE "ThotisSessionSummary" ADD COLUMN "new_id" TEXT;

UPDATE "ThotisSessionSummary"
SET "new_id" = 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);

ALTER TABLE "ThotisSessionSummary" ALTER COLUMN "new_id" SET NOT NULL;

ALTER TABLE "ThotisSessionSummary" DROP CONSTRAINT "ThotisSessionSummary_pkey";
ALTER TABLE "ThotisSessionSummary" DROP COLUMN "id";

ALTER TABLE "ThotisSessionSummary" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "ThotisSessionSummary" ADD CONSTRAINT "ThotisSessionSummary_pkey" PRIMARY KEY ("id");

-- ============================================================
-- 3. ThotisSessionResource
-- ============================================================

ALTER TABLE "ThotisSessionResource" ADD COLUMN "new_id" TEXT;

UPDATE "ThotisSessionResource"
SET "new_id" = 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);

ALTER TABLE "ThotisSessionResource" ALTER COLUMN "new_id" SET NOT NULL;

ALTER TABLE "ThotisSessionResource" DROP CONSTRAINT "ThotisSessionResource_pkey";
ALTER TABLE "ThotisSessionResource" DROP COLUMN "id";

ALTER TABLE "ThotisSessionResource" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "ThotisSessionResource" ADD CONSTRAINT "ThotisSessionResource_pkey" PRIMARY KEY ("id");
