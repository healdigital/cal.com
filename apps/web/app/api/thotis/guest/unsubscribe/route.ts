import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireGuestAccess } from "../../_lib/auth";
import { guestService } from "../../_lib/services";

function buildHtmlResponse(title: string, description: string, status: number) {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f3f4f6;color:#111827;">
    <main style="max-width:560px;margin:72px auto;padding:32px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;text-align:center;">
      <h1 style="margin:0 0 12px;font-size:28px;">${title}</h1>
      <p style="margin:0;font-size:16px;line-height:1.5;color:#4b5563;">${description}</p>
    </main>
  </body>
</html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { magicLink } = await requireGuestAccess(request, {
      action: "guest-unsubscribe",
    });

    await guestService.unsubscribeGuest(magicLink.guestId);
    await guestService.logAccess(
      magicLink.guestId,
      "guest/unsubscribe",
      "UNSUBSCRIBE",
      magicLink.bookingId ? String(magicLink.bookingId) : null,
      true
    );

    return buildHtmlResponse(
      "Email preferences updated",
      "You will no longer receive Thotis mentoring emails at this address.",
      200
    );
  } catch {
    return buildHtmlResponse(
      "Unable to unsubscribe",
      "This unsubscribe link is invalid or has expired. Request a new magic link if you still need help.",
      400
    );
  }
}
