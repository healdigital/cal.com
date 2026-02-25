import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { withCors } from "../../_lib/cors";
import { emailService, guestService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const MagicLinkSchema = z.object({
  email: z.string().email(),
});

const WP_BASE_URL = process.env.THOTIS_WP_ORIGIN || "https://thotismedia.com";

async function handler(request: NextRequest) {
  const input = await parseBody(request, MagicLinkSchema);

  const result = await guestService.requestInboxLink(input.email);

  // Build the magic link pointing to WordPress, not Cal.com
  const link = `${WP_BASE_URL}/mentorat/mes-sessions/?token=${result.token}`;

  await emailService.sendMagicLink(input.email, link, "LOGIN");

  return NextResponse.json({ success: true });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
