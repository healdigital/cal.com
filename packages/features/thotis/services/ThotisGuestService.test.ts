import { createHash } from "node:crypto";
import { ErrorCode } from "@calcom/lib/errorCodes";
import type { PrismaClient } from "@calcom/prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThotisGuestService } from "./ThotisGuestService";

type GuestPrismaMock = Pick<
  PrismaClient,
  "thotisGuestAccessLog" | "thotisGuestIdentity" | "thotisMagicLinkToken"
>;

const createPrismaMock = (): GuestPrismaMock =>
  ({
    thotisGuestAccessLog: {
      create: vi.fn(),
    },
    thotisGuestIdentity: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    thotisMagicLinkToken: {
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  }) as unknown as GuestPrismaMock;

describe("ThotisGuestService", () => {
  let prismaMock: GuestPrismaMock;
  let service: ThotisGuestService;

  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
    service = new ThotisGuestService({ prismaClient: prismaMock });
  });

  it("creates a guest identity, stores the hashed token, and logs the access", async () => {
    const lastRequestAt = new Date(Date.now() - 60 * 1000);

    vi.mocked(prismaMock.thotisGuestIdentity.findUnique).mockResolvedValue(null);
    vi.mocked(prismaMock.thotisGuestIdentity.create).mockResolvedValue({
      blocked: false,
      email: "Student@example.com",
      id: "guest-1",
      lastRequestAt,
      normalizedEmail: "student@example.com",
    });
    vi.mocked(prismaMock.thotisMagicLinkToken.count).mockResolvedValue(0);

    const result = await service.requestInboxLink("Student@example.com", 42, 30);

    expect(result.success).toBe(true);
    expect(result.token).toHaveLength(64);
    expect(prismaMock.thotisGuestIdentity.create).toHaveBeenCalledWith({
      data: {
        email: "Student@example.com",
        normalizedEmail: "student@example.com",
      },
    });
    expect(prismaMock.thotisGuestIdentity.update).toHaveBeenCalledWith({
      data: { lastRequestAt: expect.any(Date) },
      where: { id: "guest-1" },
    });
    expect(prismaMock.thotisMagicLinkToken.create).toHaveBeenCalledWith({
      data: {
        bookingId: 42,
        expiresAt: expect.any(Date),
        guestId: "guest-1",
        tokenHash: createHash("sha256").update(result.token).digest("hex"),
      },
    });
    expect(prismaMock.thotisGuestAccessLog.create).toHaveBeenCalledWith({
      data: {
        action: "CREATE_TOKEN",
        endpoint: "requestInboxLink",
        guestId: "guest-1",
        resourceId: null,
        success: true,
      },
    });
  });

  it("rejects blocked guests", async () => {
    vi.mocked(prismaMock.thotisGuestIdentity.findUnique).mockResolvedValue({
      blocked: true,
      email: "student@example.com",
      id: "guest-1",
      lastRequestAt: new Date(Date.now() - 60 * 1000),
      normalizedEmail: "student@example.com",
    });

    await expect(service.requestInboxLink("student@example.com")).rejects.toMatchObject({
      code: ErrorCode.Forbidden,
    });
  });

  it("rejects guests who exceeded the hourly magic-link limit", async () => {
    vi.mocked(prismaMock.thotisGuestIdentity.findUnique).mockResolvedValue({
      blocked: false,
      email: "student@example.com",
      id: "guest-1",
      lastRequestAt: new Date(Date.now() - 60 * 1000),
      normalizedEmail: "student@example.com",
    });
    vi.mocked(prismaMock.thotisMagicLinkToken.count).mockResolvedValue(3);

    await expect(service.requestInboxLink("student@example.com")).rejects.toMatchObject({
      code: ErrorCode.BadRequest,
    });
  });

  it("rejects repeated requests within 30 seconds", async () => {
    vi.mocked(prismaMock.thotisGuestIdentity.findUnique).mockResolvedValue({
      blocked: false,
      email: "student@example.com",
      id: "guest-1",
      lastRequestAt: new Date(),
      normalizedEmail: "student@example.com",
    });
    vi.mocked(prismaMock.thotisMagicLinkToken.count).mockResolvedValue(0);

    await expect(service.requestInboxLink("student@example.com")).rejects.toMatchObject({
      code: ErrorCode.BadRequest,
    });
  });

  it("verifies a valid token", async () => {
    const tokenRaw = "valid-token";
    const tokenHash = createHash("sha256").update(tokenRaw).digest("hex");

    vi.mocked(prismaMock.thotisMagicLinkToken.findUnique).mockResolvedValue({
      bookingId: 5,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 1000),
      guest: {
        blocked: false,
        email: "student@example.com",
        id: "guest-1",
        normalizedEmail: "student@example.com",
      },
      guestId: "guest-1",
      id: "token-1",
      invalidated: false,
      tokenHash,
      usedAt: null,
    });

    const result = await service.verifyToken(tokenRaw, 5);

    expect(result.id).toBe("token-1");
    expect(prismaMock.thotisMagicLinkToken.findUnique).toHaveBeenCalledWith({
      select: expect.any(Object),
      where: { tokenHash },
    });
  });

  it("rejects expired or already-used tokens", async () => {
    vi.mocked(prismaMock.thotisMagicLinkToken.findUnique).mockResolvedValue({
      bookingId: null,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1_000),
      guest: {
        blocked: false,
        email: "student@example.com",
        id: "guest-1",
        normalizedEmail: "student@example.com",
      },
      guestId: "guest-1",
      id: "token-1",
      invalidated: false,
      tokenHash: "expired",
      usedAt: null,
    });

    await expect(service.verifyToken("expired-token")).rejects.toMatchObject({
      code: ErrorCode.Unauthorized,
    });
  });

  it("rejects token usage for another booking scope", async () => {
    vi.mocked(prismaMock.thotisMagicLinkToken.findUnique).mockResolvedValue({
      bookingId: 5,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 1000),
      guest: {
        blocked: false,
        email: "student@example.com",
        id: "guest-1",
        normalizedEmail: "student@example.com",
      },
      guestId: "guest-1",
      id: "token-1",
      invalidated: false,
      tokenHash: "scoped",
      usedAt: null,
    });

    await expect(service.verifyToken("scoped-token", 7)).rejects.toMatchObject({
      code: ErrorCode.Forbidden,
    });
  });

  it("invalidates tokens after sensitive actions", async () => {
    await service.invalidateToken("token-1");

    expect(prismaMock.thotisMagicLinkToken.update).toHaveBeenCalledWith({
      data: { invalidated: true, usedAt: expect.any(Date) },
      where: { id: "token-1" },
    });
  });

  it("writes guest access logs explicitly when asked", async () => {
    await service.logAccess("guest-1", "studentSessions", "READ_SESSIONS", "booking-1", false);

    expect(prismaMock.thotisGuestAccessLog.create).toHaveBeenCalledWith({
      data: {
        action: "READ_SESSIONS",
        endpoint: "studentSessions",
        guestId: "guest-1",
        resourceId: "booking-1",
        success: false,
      },
    });
  });
});
