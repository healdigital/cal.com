import type { Prisma } from "@calcom/prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../_lib/cors";
import { matchingService, profileService } from "../_lib/services";
import { parseBody } from "../_lib/validate";

const IntentSchema = z.object({
  targetFields: z.array(z.string()).min(1),
  academicLevel: z.string(),
  zone: z.string().optional().nullable(),
  goals: z.array(z.string()).optional(),
  scheduleConstraints: z.record(z.string(), z.unknown()).optional(),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, IntentSchema);

  // Store the intent temporarily and return recommendations
  // Intent is stored in localStorage on the WP side (no auth required)
  const profiles = await profileService.getRecommendedProfilesByIntent(input);

  return NextResponse.json({
    intent: input,
    recommendations: profiles,
  });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
