import { thotisEmailSchema } from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthenticatedRequester } from "../../_lib/auth";
import { withCors } from "../../_lib/cors";
import { bookingService, guestService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const CancelSchema = z
  .object({
    bookingId: z.number(),
    reason: z.string().min(1),
    email: thotisEmailSchema.optional(),
  })
  .strict();

async function handler(request: NextRequest) {
  const input = await parseBody(request, CancelSchema);
  const auth = await requireAuthenticatedRequester(request, {
    action: "booking-cancel",
    allowGuestToken: true,
    bookingId: input.bookingId,
  });

  await bookingService.cancelSession(input.bookingId, input.reason, "student", {
    email: auth.requester.email,
    id: auth.requester.id,
  });

  if (auth.guestAccess) {
    await guestService.invalidateToken(auth.guestAccess.magicLinkId);
    await guestService.logAccess(
      auth.guestAccess.guestId,
      "bookings/cancel",
      "CANCEL",
      String(input.bookingId),
      true
    );
  }

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
