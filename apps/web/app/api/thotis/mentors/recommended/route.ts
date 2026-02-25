import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { withCors } from "../../_lib/cors";
import { matchingService, profileService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const IntentSchema = z.object({
  targetFields: z.array(z.string()),
  academicLevel: z.string(),
  zone: z.string().optional().nullable(),
  goals: z.array(z.string()).optional(),
});

async function handler(request: NextRequest) {
  const intent = await parseBody(request, IntentSchema);

  const profiles = await profileService.getRecommendedProfilesByIntent(intent);

  if (Array.isArray(profiles) && profiles.length > 0) {
    return NextResponse.json({ profiles });
  }

  // Fallback: get top mentors by first target field
  const fallback = await profileService.getRecommendedProfiles(intent.targetFields[0]);
  return NextResponse.json({ profiles: fallback });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
