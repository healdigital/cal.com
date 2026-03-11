import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../../_lib/cors";
import { guestService, sessionOperationsService } from "../../_lib/services";
import { getGuestToken, parseQuery } from "../../_lib/validate";

const QuerySchema = z.object({
  bookingId: z.coerce.number(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const params = parseQuery(request, QuerySchema);

  const magicLink = await guestService.verifyToken(token, params.bookingId);
  const data = await sessionOperationsService.getPostSessionData({
    bookingId: params.bookingId,
    email: magicLink.guest.email,
  });

  await guestService.logAccess(
    magicLink.guestId,
    "guest/post-session",
    "VIEW",
    String(params.bookingId),
    true
  );

  return NextResponse.json(data);
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
