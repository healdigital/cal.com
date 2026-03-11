import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withCors } from "../_lib/cors";
import { bookingService } from "../_lib/services";
import { parseQuery } from "../_lib/validate";

const SessionsSchema = z.object({
  email: z.string().email().optional(),
  status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
});

async function handler(request: NextRequest) {
  const params = parseQuery(request, SessionsSchema);

  if (!params.email) {
    throw ApiError.badRequest("Email is required to fetch sessions");
  }

  const sessions = await bookingService.studentSessions({
    email: params.email,
    status: params.status,
  });

  return NextResponse.json({ sessions });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
