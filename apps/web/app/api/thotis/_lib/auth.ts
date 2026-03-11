import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import getIP from "@calcom/lib/getIP";
import { piiHasher } from "@calcom/lib/server/PiiHasher";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { ApiError } from "./cors";
import { guestService } from "./services";

type ThotisRateLimitIdentity = {
  email?: string;
  token?: string;
  userId?: number;
};

type AuthenticatedRequester = {
  guestAccess?: {
    guestId: string;
    magicLinkId: string;
    token: string;
  };
  requester: {
    email?: string;
    id?: number;
  };
};

function getGuestTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get("X-Thotis-Guest-Token") || new URL(request.url).searchParams.get("token");
}

async function applyRateLimit(identifier: string) {
  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier,
  });
}

export async function rateLimitThotisRoute(
  request: NextRequest,
  action: string,
  identity: ThotisRateLimitIdentity = {}
) {
  const identifiers = new Set<string>();
  const ipHash = piiHasher.hash(getIP(request));

  identifiers.add(`api:thotis:${action}:ip:${ipHash}`);

  if (identity.userId) {
    identifiers.add(`api:thotis:${action}:user:${identity.userId}`);
  }

  if (identity.email) {
    identifiers.add(`api:thotis:${action}:email:${piiHasher.hash(identity.email.toLowerCase().trim())}`);
  }

  if (identity.token) {
    identifiers.add(`api:thotis:${action}:token:${piiHasher.hash(identity.token)}`);
  }

  for (const identifier of identifiers) {
    await applyRateLimit(identifier);
  }
}

export async function requireGuestAccess(
  request: NextRequest,
  options: {
    action: string;
    bookingId?: number;
  }
) {
  const token = getGuestTokenFromRequest(request);

  if (!token) {
    throw ApiError.unauthorized("Guest token required");
  }

  await rateLimitThotisRoute(request, options.action, { token });

  const magicLink = await guestService.verifyToken(token, options.bookingId);

  return {
    magicLink,
    requester: {
      email: magicLink.guest.email,
    },
    token,
  };
}

export async function requireAuthenticatedRequester(
  request: NextRequest,
  options: {
    action: string;
    bookingId?: number;
    allowGuestToken?: boolean;
  }
): Promise<AuthenticatedRequester> {
  if (options.allowGuestToken !== false) {
    const token = getGuestTokenFromRequest(request);

    if (token) {
      const { magicLink, requester } = await requireGuestAccess(request, {
        action: options.action,
        bookingId: options.bookingId,
      });

      return {
        guestAccess: {
          guestId: magicLink.guestId,
          magicLinkId: magicLink.id,
          token,
        },
        requester,
      };
    }
  }

  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user?.id) {
    throw ApiError.unauthorized("Authentication or valid guest token required");
  }

  await rateLimitThotisRoute(request, options.action, {
    email: session.user.email ?? undefined,
    userId: session.user.id,
  });

  return {
    requester: {
      email: session.user.email ?? undefined,
      id: session.user.id,
    },
  };
}
