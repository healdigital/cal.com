import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import prisma from "@calcom/prisma";

import { ApiError, withCors } from "../../_lib/cors";
import { guestService } from "../../_lib/services";
import { getGuestToken, parseQuery } from "../../_lib/validate";

const QuerySchema = z.object({
  bookingId: z.coerce.number(),
});

async function handler(request: NextRequest) {
  const token = getGuestToken(request);
  const params = parseQuery(request, QuerySchema);

  const magicLink = await guestService.verifyToken(token);

  // Verify the guest has access to this booking
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    select: {
      id: true,
      responses: true,
      thotisSessionSummary: {
        select: {
          content: true,
          nextSteps: true,
          createdAt: true,
        },
      },
      thotisSessionResources: {
        select: {
          type: true,
          title: true,
          url: true,
        },
      },
    },
  });

  if (!booking) {
    throw ApiError.notFound("Booking not found");
  }

  // Check email matches
  const responses = booking.responses as Record<string, unknown> | null;
  const bookingEmail = typeof responses?.email === "string" ? responses.email : null;
  if (bookingEmail !== magicLink.guest.email) {
    throw ApiError.forbidden("You do not have access to this booking");
  }

  await guestService.logAccess(magicLink.guestId, "guest/post-session", "VIEW", String(params.bookingId), true);

  return NextResponse.json({
    summary: booking.thotisSessionSummary,
    resources: booking.thotisSessionResources,
  });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
