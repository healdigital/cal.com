import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireGuestAccess } from "../../_lib/auth";
import { withCors } from "../../_lib/cors";
import { bookingService, guestService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const CancelSchema = z.object({
  bookingId: z.number(),
  reason: z.string().min(1),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, CancelSchema);
  const { magicLink, requester } = await requireGuestAccess(request, {
    action: "guest-cancel",
    bookingId: input.bookingId,
  });

  await bookingService.cancelSession(input.bookingId, input.reason, "student", requester);
  await guestService.invalidateToken(magicLink.id);
  await guestService.logAccess(magicLink.guestId, "guest/cancel", "CANCEL", String(input.bookingId), true);

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
