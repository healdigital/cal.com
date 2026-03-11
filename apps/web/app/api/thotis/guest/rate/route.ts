import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireGuestAccess } from "../../_lib/auth";
import { withCors } from "../../_lib/cors";
import { guestService, sessionOperationsService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const RateSchema = z.object({
  bookingId: z.number(),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, RateSchema);
  const { magicLink } = await requireGuestAccess(request, {
    action: "guest-rate",
    bookingId: input.bookingId,
  });
  const rating = await sessionOperationsService.submitRating({
    bookingId: input.bookingId,
    rating: input.rating,
    feedback: input.feedback,
    email: magicLink.guest.email,
    guestId: magicLink.guestId,
    requireCompletedAt: true,
  });

  await guestService.invalidateToken(magicLink.id);
  await guestService.logAccess(magicLink.guestId, "guest/rate", "RATE", String(input.bookingId), true);

  return NextResponse.json({ rating }, { status: 201 });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
