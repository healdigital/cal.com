import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../_lib/cors";
import { ratingService, sessionOperationsService } from "../_lib/services";
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
  const rating = await sessionOperationsService.submitRating({
    bookingId: input.bookingId,
    rating: input.rating,
    feedback: input.feedback,
    email: input.email,
  });

  return NextResponse.json({ rating }, { status: 201 });
}

export const GET = withCors(handleGet);
export const POST = withCors(handlePost);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
