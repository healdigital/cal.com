-- Add missing index on SessionRating for studentProfileId lookups
CREATE INDEX IF NOT EXISTS "SessionRating_studentProfileId_idx" ON "SessionRating"("studentProfileId");

-- Add missing indexes on ThotisAnalyticsEvent for query performance
CREATE INDEX IF NOT EXISTS "ThotisAnalyticsEvent_userId_idx" ON "ThotisAnalyticsEvent"("userId");
CREATE INDEX IF NOT EXISTS "ThotisAnalyticsEvent_guestId_idx" ON "ThotisAnalyticsEvent"("guestId");
CREATE INDEX IF NOT EXISTS "ThotisAnalyticsEvent_bookingId_idx" ON "ThotisAnalyticsEvent"("bookingId");
