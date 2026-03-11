import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthenticatedRequester } from "../../_lib/auth";
import { withCors } from "../../_lib/cors";
import { bookingService, guestService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const RescheduleSchema = z.object({
  bookingId: z.number(),
  newDateTime: z.coerce.date(),
  email: z.string().email().optional(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, RescheduleSchema);
  const auth = await requireAuthenticatedRequester(request, {
    action: "booking-reschedule",
    allowGuestToken: true,
    bookingId: input.bookingId,
  });

  const result = await bookingService.rescheduleSession(input.bookingId, input.newDateTime, {
    email: auth.requester.email,
    id: auth.requester.id,
  });

  if (auth.guestAccess) {
    await guestService.invalidateToken(auth.guestAccess.magicLinkId);
    await guestService.logAccess(
      auth.guestAccess.guestId,
      "bookings/reschedule",
      "RESCHEDULE",
      String(input.bookingId),
      true
    );
  }

  return NextResponse.json(result);
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
