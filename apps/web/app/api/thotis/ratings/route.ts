import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";

import prisma from "@calcom/prisma";

import { withCors } from "../_lib/cors";
import { analyticsService, ratingService, statisticsService } from "../_lib/services";
import { parseBody, parseQuery } from "../_lib/validate";

const SubmitRatingSchema = z.object({
  bookingId: z.number(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  email: z.string().email(),
});

const GetRatingSchema = z.object({
  bookingId: z.coerce.number(),
});

async function handleGet(request: NextRequest) {
  const params = parseQuery(request, GetRatingSchema);
  const rating = await ratingService.getRatingByBookingId(params.bookingId);
  return NextResponse.json({ rating: rating ?? null });
}

async function handlePost(request: NextRequest) {
  const input = await parseBody(request, SubmitRatingSchema);

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
    input.email
  );

  await analyticsService.track({
    eventType: ThotisAnalyticsEventType.rating_submitted,
    bookingId: input.bookingId,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

export const GET = withCors(handleGet);
export const POST = withCors(handlePost);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
