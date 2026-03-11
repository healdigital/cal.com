-- CreateEnum
CREATE TYPE "ThotisAdminAuditAction" AS ENUM (
  'AMBASSADOR_PROVISIONED',
  'MENTOR_STATUS_UPDATED',
  'PASSWORD_RESET_SENT',
  'INCIDENT_RESOLVED',
  'MODERATION_ACTION_TAKEN',
  'BOOKING_CANCELLED',
  'MENTOR_PROFILE_UPDATED',
  'MENTOR_SCHEDULE_UPDATED',
  'CSV_EXPORTED'
);

-- CreateEnum
CREATE TYPE "ThotisAdminAuditResourceType" AS ENUM (
  'STUDENT_PROFILE',
  'USER',
  'BOOKING',
  'INCIDENT',
  'PLATFORM'
);

-- CreateTable
CREATE TABLE "ThotisAdminAuditLog" (
  "id" TEXT NOT NULL,
  "adminUserId" INTEGER NOT NULL,
  "adminUserName" TEXT,
  "adminUserEmail" TEXT,
  "action" "ThotisAdminAuditAction" NOT NULL,
  "resourceType" "ThotisAdminAuditResourceType" NOT NULL,
  "resourceId" TEXT NOT NULL,
  "resourceDisplayName" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ThotisAdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ThotisAdminAuditLog_adminUserId_idx" ON "ThotisAdminAuditLog"("adminUserId");

-- CreateIndex
CREATE INDEX "ThotisAdminAuditLog_action_idx" ON "ThotisAdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "ThotisAdminAuditLog_resourceType_resourceId_idx" ON "ThotisAdminAuditLog"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "ThotisAdminAuditLog_createdAt_idx" ON "ThotisAdminAuditLog"("createdAt");
