DO $$
BEGIN
  CREATE TYPE "public"."MentorStatus" AS ENUM (
    'PENDING_VERIFICATION',
    'VERIFIED',
    'SUSPENDED',
    'DELISTED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "public"."StudentProfile"
  ADD COLUMN IF NOT EXISTS "expertise" TEXT[],
  ADD COLUMN IF NOT EXISTS "timezone" TEXT,
  ADD COLUMN IF NOT EXISTS "marketingConsent" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "status" "public"."MentorStatus";

UPDATE "public"."StudentProfile"
SET
  "expertise" = COALESCE("expertise", ARRAY[]::TEXT[]),
  "timezone" = COALESCE("timezone", 'Europe/Paris'),
  "marketingConsent" = COALESCE("marketingConsent", false),
  "status" = COALESCE(
    "status",
    CASE
      WHEN "isActive" THEN 'VERIFIED'::"public"."MentorStatus"
      ELSE 'DELISTED'::"public"."MentorStatus"
    END
  );

ALTER TABLE "public"."StudentProfile"
  ALTER COLUMN "expertise" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "expertise" SET NOT NULL,
  ALTER COLUMN "timezone" SET DEFAULT 'Europe/Paris',
  ALTER COLUMN "timezone" SET NOT NULL,
  ALTER COLUMN "marketingConsent" SET DEFAULT false,
  ALTER COLUMN "marketingConsent" SET NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'PENDING_VERIFICATION',
  ALTER COLUMN "status" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "StudentProfile_status_idx" ON "public"."StudentProfile"("status");
