import process from "node:process";
import { getLocaleFromRequest } from "@calcom/features/auth/lib/getLocaleFromRequest";
import { thotisEmailSchema } from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitThotisRoute } from "../../_lib/auth";
import { withCors } from "../../_lib/cors";
import { emailService, guestService } from "../../_lib/services";
import { parseBody } from "../../_lib/validate";

const MagicLinkSchema = z
  .object({
    email: thotisEmailSchema,
    locale: z.string().optional(),
  })
  .strict();

const WP_BASE_URL: string = process.env.THOTIS_WP_ORIGIN || "https://thotismedia.com";
type RouteHandler = (request: NextRequest, context?: unknown) => Promise<NextResponse>;

async function handler(request: NextRequest): Promise<NextResponse> {
  const input = await parseBody(request, MagicLinkSchema);
  await rateLimitThotisRoute(request, "guest-magic-link", {
    email: input.email,
  });

  const result = await guestService.requestInboxLink(input.email);
  const locale =
    input.locale ?? (await getLocaleFromRequest(buildLegacyRequest(await headers(), await cookies())));

  // Build the magic link pointing to WordPress, not Cal.com
  const link = `${WP_BASE_URL}/mentorat/mes-sessions/?token=${result.token}`;

  await emailService.sendMagicLink(input.email, link, "LOGIN", locale);

  return NextResponse.json({ success: true });
}

export const POST: RouteHandler = withCors(handler);
export const OPTIONS: RouteHandler = withCors(
  async (): Promise<NextResponse> => new NextResponse(null, { status: 204 })
);
