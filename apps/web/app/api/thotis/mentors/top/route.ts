import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { withCors } from "../../_lib/cors";
import { profileService } from "../../_lib/services";

async function handler(_request: NextRequest) {
  const profiles = await profileService.getTopRatedProfiles();
  return NextResponse.json({ profiles });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
