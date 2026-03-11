import { MentorIncidentType } from "@calcom/prisma/enums";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../../_lib/cors";
import { guestService, sessionOperationsService } from "../../_lib/services";
import { getGuestToken, parseBody } from "../../_lib/validate";

const ReportSchema = z.object({
  bookingId: z.number(),
  type: z.nativeEnum(MentorIncidentType),
  description: z.string().optional(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const input = await parseBody(request, ReportSchema);

  const magicLink = await guestService.verifyToken(token, input.bookingId);
  const result = await sessionOperationsService.reportIncident({
    bookingId: input.bookingId,
    type: input.type,
    description: input.description,
    reporterEmail: magicLink.guest.email,
    severity: input.type === "NO_SHOW" ? 5 : 3,
  });

  await guestService.invalidateToken(magicLink.id);
  await guestService.logAccess(magicLink.guestId, "guest/report", "REPORT", String(input.bookingId), true);

  return NextResponse.json(result, { status: 201 });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
