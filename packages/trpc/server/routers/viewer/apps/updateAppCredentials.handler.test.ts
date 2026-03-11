import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcSessionUser } from "../../../types";
import { updateAppCredentialsHandler } from "./updateAppCredentials.handler";

type MockedPrisma = {
  credential: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const { prisma }: { prisma: MockedPrisma } = vi.hoisted(() => ({
  prisma: {
    credential: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@calcom/prisma", () => ({
  prisma,
}));

describe("updateAppCredentialsHandler", () => {
  const user: Pick<NonNullable<TrpcSessionUser>, "id"> = {
    id: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("replaces credential.key with the server-validated payload only", async () => {
    prisma.credential.findFirst.mockResolvedValue({
      id: 42,
      appId: "alby",
    });
    prisma.credential.update.mockResolvedValue({
      id: 42,
    });

    const result = await updateAppCredentialsHandler({
      ctx: { user: user as NonNullable<TrpcSessionUser> },
      input: {
        credentialId: 42,
        key: {
          account_id: "acc_123",
          account_email: "user@example.com",
          account_lightning_address: "user@getalby.com",
          webhook_endpoint_id: "webhook_123",
          webhook_endpoint_secret: "secret_123",
        },
      },
    });

    expect(result).toBe(true);
    expect(prisma.credential.findFirst).toHaveBeenCalledWith({
      where: {
        id: 42,
        userId: 1,
      },
      select: {
        id: true,
        appId: true,
      },
    });
    expect(prisma.credential.update).toHaveBeenCalledWith({
      where: {
        id: 42,
      },
      select: {
        id: true,
      },
      data: {
        key: {
          account_id: "acc_123",
          account_email: "user@example.com",
          account_lightning_address: "user@getalby.com",
          webhook_endpoint_id: "webhook_123",
          webhook_endpoint_secret: "secret_123",
        },
      },
    });
  });

  it("rejects invalid app credentials before persisting credential.key", async () => {
    prisma.credential.findFirst.mockResolvedValue({
      id: 42,
      appId: "btcpayserver",
    });

    await expect(
      updateAppCredentialsHandler({
        ctx: { user: user as NonNullable<TrpcSessionUser> },
        input: {
          credentialId: 42,
          key: {
            storeId: "store_123",
            apiKey: "api_key",
            webhookSecret: "webhook_secret",
          },
        },
      })
    ).rejects.toThrow(TRPCError);

    expect(prisma.credential.update).not.toHaveBeenCalled();
  });

  it("rejects updates for apps without a dedicated server validator", async () => {
    prisma.credential.findFirst.mockResolvedValue({
      id: 42,
      appId: "google-calendar",
    });

    await expect(
      updateAppCredentialsHandler({
        ctx: { user: user as NonNullable<TrpcSessionUser> },
        input: {
          credentialId: 42,
          key: {
            access_token: "token",
          },
        },
      })
    ).rejects.toThrow("Updating credentials is not supported for app google-calendar");

    expect(prisma.credential.update).not.toHaveBeenCalled();
  });
});
