import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../_lib/cors";
import { analyticsService } from "../_lib/services";
import { parseBody } from "../_lib/validate";

const TrackSchema = z.object({
  eventType: z.nativeEnum(ThotisAnalyticsEventType),
  profileId: z.string().optional(),
  bookingId: z.number().optional(),
  field: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, TrackSchema);

  await analyticsService.track({
    ...input,
    source: input.source ?? "wordpress",
  });

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
