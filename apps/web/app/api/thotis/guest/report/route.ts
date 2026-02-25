import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { MentorIncidentType } from "@calcom/prisma/enums";

import { withCors } from "../../_lib/cors";
import { guestService } from "../../_lib/services";
import { getGuestToken, parseBody } from "../../_lib/validate";

import prisma from "@calcom/prisma";

const ReportSchema = z.object({
  bookingId: z.number(),
  type: z.nativeEnum(MentorIncidentType),
  description: z.string().optional(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const input = await parseBody(request, ReportSchema);

  const magicLink = await guestService.verifyToken(token);

  // Find the booking to get the mentor's profile ID
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    select: {
      uid: true,
      metadata: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const metadata = booking.metadata as { studentProfileId?: string } | null;

  await prisma.mentorQualityIncident.create({
    data: {
      studentProfileId: metadata?.studentProfileId ?? "",
      bookingUid: booking.uid,
      type: input.type,
      description: input.description ?? "",
      severity: input.type === "NO_SHOW" ? 5 : 3,
    },
  });

  await guestService.logAccess(magicLink.guestId, "guest/report", "REPORT", String(input.bookingId), true);

  return NextResponse.json({ success: true }, { status: 201 });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
