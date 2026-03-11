import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../../_lib/cors";
import { bookingService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const CancelSchema = z.object({
  bookingId: z.number(),
  reason: z.string().min(1),
  email: z.string().email(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, CancelSchema);

  await bookingService.cancelSession(input.bookingId, input.reason, "student", {
    email: input.email,
  });

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
