import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { withCors } from "../../_lib/cors";
import { bookingService, guestService } from "../../_lib/services";
import { getGuestToken, parseBody } from "../../_lib/validate";

const CancelSchema = z.object({
  bookingId: z.number(),
  reason: z.string().min(1),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const input = await parseBody(request, CancelSchema);

  const magicLink = await guestService.verifyToken(token);
  const requester = { id: 0, email: magicLink.guest.email };

  await bookingService.cancelSession(input.bookingId, input.reason, "student", requester);
  await guestService.invalidateToken(magicLink.id);
  await guestService.logAccess(magicLink.guestId, "guest/cancel", "CANCEL", String(input.bookingId), true);

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
