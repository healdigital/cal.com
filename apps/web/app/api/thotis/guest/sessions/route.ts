import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../../_lib/cors";
import { bookingService } from "../../_lib/services";
import { getGuestToken, parseQuery } from "../../_lib/validate";

const SessionsSchema = z.object({
  status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const params = parseQuery(request, SessionsSchema);

  const sessions = await bookingService.studentSessions({
    token,
    status: params.status,
  });

  return NextResponse.json({ sessions });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
