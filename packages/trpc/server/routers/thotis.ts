import { router } from "../trpc";
import { adminRouter } from "./thotis/admin.router";
import { analyticsRouter } from "./thotis/analytics.router";
import { bookingRouter } from "./thotis/booking.router";
import { guestRouter } from "./thotis/guest.router";
import { incidentRouter } from "./thotis/incident.router";
import { intentRouter } from "./thotis/intent.router";
import { profileRouter } from "./thotis/profile.router";
import { ratingRouter } from "./thotis/rating.router";
import { statisticsRouter } from "./thotis/statistics.router";

export const thotisRouter = router({
  profile: profileRouter,
  booking: bookingRouter,
  rating: ratingRouter,
  statistics: statisticsRouter,
  admin: adminRouter,
  guest: guestRouter,
  incident: incidentRouter,
  analytics: analyticsRouter,
  intent: intentRouter,
});
