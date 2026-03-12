import { thotisEmailSchema } from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthenticatedRequester } from "../_lib/auth";
import { withCors } from "../_lib/cors";
import { guestService, sessionOperationsService } from "../_lib/services";
import { parseBody, parseQuery } from "../_lib/validate";

const SubmitRatingSchema = z
  .object({
    bookingId: z.number(),
    rating: z.number().min(1).max(5),
    feedback: z.string().optional(),
    email: thotisEmailSchema.optional(),
  })
  .strict();

const GetRatingSchema = z
  .object({
    bookingId: z.coerce.number(),
  })
  .strict();

async function handleGet(request: NextRequest) {
  const params = parseQuery(request, GetRatingSchema);
  const auth = await requireAuthenticatedRequester(request, {
    action: "rating-read",
    allowGuestToken: true,
    bookingId: params.bookingId,
  });

  const rating = await sessionOperationsService.getRating({
    bookingId: params.bookingId,
    email: auth.requester.email,
    userId: auth.requester.id,
  });

  return NextResponse.json({ rating });
}

async function handlePost(request: NextRequest) {
  const input = await parseBody(request, SubmitRatingSchema);
  const auth = await requireAuthenticatedRequester(request, {
    action: "rating-submit",
    allowGuestToken: true,
    bookingId: input.bookingId,
  });

  const rating = await sessionOperationsService.submitRating({
    bookingId: input.bookingId,
    rating: input.rating,
    feedback: input.feedback,
    email: auth.requester.email ?? input.email ?? "",
    guestId: auth.guestAccess?.guestId,
    requireCompletedAt: true,
  });

  if (auth.guestAccess) {
    await guestService.invalidateToken(auth.guestAccess.magicLinkId);
    await guestService.logAccess(auth.guestAccess.guestId, "ratings", "RATE", String(input.bookingId), true);
  }

  return NextResponse.json({ rating }, { status: 201 });
}

export const GET = withCors(handleGet);
export const POST = withCors(handlePost);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
