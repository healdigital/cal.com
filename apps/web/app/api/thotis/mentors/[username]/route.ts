import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiError, withCors } from "../../_lib/cors";
import { profileService } from "../../_lib/services";

async function handler(_request: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;

  if (!username) {
    throw ApiError.badRequest("Username is required");
  }

  const profile = await profileService.getProfileByUsername(username);

  if (!profile) {
    throw ApiError.notFound(`Mentor "${username}" not found`);
  }

  return NextResponse.json({ profile });
}

export const GET = withCors(handler as Parameters<typeof withCors>[0]);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
