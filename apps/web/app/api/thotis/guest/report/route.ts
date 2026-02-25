import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { Prisma } from "@calcom/prisma/client";
import { MentorIncidentType } from "@calcom/prisma/enums";

import prisma from "@calcom/prisma";

import { ApiError, withCors } from "../../_lib/cors";
import { guestService } from "../../_lib/services";
import { getGuestToken, parseBody } from "../../_lib/validate";

const ReportSchema = z.object({
  bookingId: z.number(),
  type: z.nativeEnum(MentorIncidentType),
  description: z.string().optional(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const input = await parseBody(request, ReportSchema);

  const magicLink = await guestService.verifyToken(token);

  // Find the booking and verify access
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    select: {
      uid: true,
      metadata: true,
      responses: true,
    },
  });

  if (!booking) {
    throw ApiError.notFound("Booking not found");
  }

  // Verify the guest has access to this booking
  const responses = booking.responses as Prisma.JsonObject | null;
  const bookingEmail = typeof responses?.email === "string" ? responses.email : null;
  if (bookingEmail !== magicLink.guest.email) {
    throw ApiError.forbidden("You do not have access to this booking");
  }

  const metadata = booking.metadata as Prisma.JsonObject | null;
  const studentProfileId = typeof metadata?.studentProfileId === "string" ? metadata.studentProfileId : "";

  await prisma.mentorQualityIncident.create({
    data: {
      studentProfileId,
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
