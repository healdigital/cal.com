import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { withCors } from "../../_lib/cors";
import { bookingService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const RescheduleSchema = z.object({
  bookingId: z.number(),
  newDateTime: z.coerce.date(),
  email: z.string().email(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, RescheduleSchema);

  const result = await bookingService.rescheduleSession(input.bookingId, input.newDateTime, {
    email: input.email,
  });

  return NextResponse.json(result);
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
