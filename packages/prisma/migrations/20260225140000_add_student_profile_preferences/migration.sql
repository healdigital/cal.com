-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris';
ALTER TABLE "StudentProfile" ADD COLUMN "marketingConsent" BOOLEAN NOT NULL DEFAULT false;
