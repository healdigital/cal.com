import { createHash, randomBytes } from "node:crypto";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import logger from "@calcom/lib/logger";
import prisma from "@calcom/prisma";
import type { PrismaClient } from "@calcom/prisma/client";

const log = logger.getSubLogger({ prefix: ["ThotisGuestService"] });

export class ThotisGuestService {
  private readonly TOKEN_TTL_MINUTES = 15;
  private readonly prismaClient: Pick<
    PrismaClient,
    "thotisGuestAccessLog" | "thotisGuestIdentity" | "thotisMagicLinkToken"
  >;

  constructor(deps?: {
    prismaClient?: Pick<
      PrismaClient,
      "thotisGuestAccessLog" | "thotisGuestIdentity" | "thotisMagicLinkToken"
    >;
  }) {
    this.prismaClient = deps?.prismaClient || prisma;
  }

  /**
   * Handles rate limiting and token generation.
   */
  async requestInboxLink(email: string, bookingId?: number, ttlMinutes: number = this.TOKEN_TTL_MINUTES) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find or create guest identity
    let guest = await this.prismaClient.thotisGuestIdentity.findUnique({
      where: { normalizedEmail },
    });

    if (!guest) {
      guest = await this.prismaClient.thotisGuestIdentity.create({
        data: {
          email,
          normalizedEmail,
        },
      });
    }

    if (guest.blocked) {
      throw new ErrorWithCode(ErrorCode.Forbidden, "Access denied");
    }

    // 2. Rate limiting (anti-abuse)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check count in last hour
    const recentRequests = await this.prismaClient.thotisMagicLinkToken.count({
      where: {
        guestId: guest.id,
        createdAt: { gte: oneHourAgo },
      },
    });

    // Limit to 3 magic links per hour (Strict anti-abuse)
    if (recentRequests >= 3) {
      throw new ErrorWithCode(
        ErrorCode.BadRequest,
        "Maximum number of magic links per hour reached. Please check your inbox or try again later."
      );
    }

    // Secondary check: prevent spamming every few seconds
    if (now.getTime() - guest.lastRequestAt.getTime() < 30 * 1000) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Please wait 30 seconds before requesting another link");
    }

    // Update last request
    await this.prismaClient.thotisGuestIdentity.update({
      where: { id: guest.id },
      data: { lastRequestAt: now },
    });

    const tokenRaw = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(tokenRaw).digest("hex");
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    // 4. Store Token
    await this.prismaClient.thotisMagicLinkToken.create({
      data: {
        tokenHash,
        guestId: guest.id,
        bookingId, // Optional scope
        expiresAt,
      },
    });

    // 5. Audit Log
    await this.logAccess(guest.id, "requestInboxLink", "CREATE_TOKEN", null, true);

    // 6. Return raw token for internal use (e.g. cron jobs)
    // Security: This token MUST NOT be returned to the client in public TRPC routes.
    // Only log email (never the token itself) to avoid leaking secrets in logs
    log.debug("Magic link generated", { email: normalizedEmail, expiresAt: expiresAt.toISOString() });

    return { success: true, token: tokenRaw };
  }

  /**
   * Verify a token and return the guest.
   */
  async verifyToken(tokenRaw: string, bookingId?: number) {
    const tokenHash = createHash("sha256").update(tokenRaw).digest("hex");

    const magicLink = await this.prismaClient.thotisMagicLinkToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        tokenHash: true,
        guestId: true,
        expiresAt: true,
        usedAt: true,
        invalidated: true,
        bookingId: true,
        createdAt: true,
        guest: {
          select: {
            id: true,
            email: true,
            normalizedEmail: true,
            blocked: true,
          },
        },
      },
    });

    if (!magicLink) {
      throw new ErrorWithCode(ErrorCode.Unauthorized, "Invalid token");
    }

    if (magicLink.invalidated || magicLink.usedAt || magicLink.expiresAt < new Date()) {
      throw new ErrorWithCode(ErrorCode.Unauthorized, "Token expired or used");
    }

    // Enforce booking scope if the token was restricted to a specific booking
    if (magicLink.bookingId && bookingId && magicLink.bookingId !== bookingId) {
      throw new ErrorWithCode(ErrorCode.Forbidden, "This link is restricted to another session");
    }

    return magicLink;
  }

  /**
   * Mark token as used (optional, if we want one-time use for login vs session access).
   * For "session access", maybe valid for 15 mins is enough.
   * But for "actions" like cancel, maybe we invalidate after?
   * Requirement: "invalidation token après usage sensible (annulation/replanif)"
   */
  async invalidateToken(tokenId: string) {
    await this.prismaClient.thotisMagicLinkToken.update({
      where: { id: tokenId },
      data: { invalidated: true, usedAt: new Date() },
    });
  }

  async logAccess(
    guestId: string | null,
    endpoint: string,
    action: string,
    resourceId: string | null = null,
    success: boolean = true
  ) {
    await this.prismaClient.thotisGuestAccessLog.create({
      data: {
        guestId,
        endpoint,
        action,
        resourceId,
        success,
      },
    });
  }
}
