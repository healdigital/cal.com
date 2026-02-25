import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { withCors } from "../_lib/cors";
import { bookingService } from "../_lib/services";
import { parseQuery } from "../_lib/validate";

const AvailabilitySchema = z.object({
  profileId: z.string().min(1),
  start: z.coerce.date(),
  end: z.coerce.date(),
  timeZone: z.string().optional(),
});

async function handler(request: NextRequest) {
  const params = parseQuery(request, AvailabilitySchema);

  const slots = await bookingService.getStudentAvailability(
    params.profileId,
    { start: params.start, end: params.end },
    params.timeZone
  );

  return NextResponse.json({ slots });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
