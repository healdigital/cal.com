import prisma from "@calcom/prisma";
import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../../_lib/cors";
import { analyticsService, guestService, statisticsService } from "../../_lib/services";
import { getGuestToken, parseBody } from "../../_lib/validate";

const RateSchema = z.object({
  bookingId: z.number(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const input = await parseBody(request, RateSchema);

  const magicLink = await guestService.verifyToken(token);

  // Look up booking to get the mentor userId needed by addRating
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    select: { userId: true },
  });

  if (!booking?.userId) {
    return NextResponse.json({ error: "Booking not found or has no mentor" }, { status: 404 });
  }

  await statisticsService.addRating(
    input.bookingId,
    booking.userId,
    input.rating,
    input.feedback || null,
    magicLink.guest.email
  );

  await analyticsService.track({
    eventType: ThotisAnalyticsEventType.rating_submitted,
    bookingId: input.bookingId,
    guestId: magicLink.guestId,
  });

  await guestService.invalidateToken(magicLink.id);
  await guestService.logAccess(magicLink.guestId, "guest/rate", "RATE", String(input.bookingId), true);

  return NextResponse.json({ success: true }, { status: 201 });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
