import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import { TRPCError } from "@trpc/server";
import type { TrpcSessionUser } from "../../../types";
import type { TUpdateAppCredentialsInputSchema } from "./updateAppCredentials.schema";

type UpdateAppCredentialsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateAppCredentialsInputSchema;
};

type AppCredentialsValidator = ({
  input,
}: {
  input: TUpdateAppCredentialsInputSchema;
}) => Promise<unknown> | unknown;

const toInputJsonObject = (value: unknown): Prisma.InputJsonObject => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Credential key must be a JSON object",
    });
  }

  return value as Prisma.InputJsonObject;
};

type AppCredentialsValidatorGetter = () => Promise<AppCredentialsValidator>;

const getPaypalValidator = async (): Promise<AppCredentialsValidator> => {
  const { default: validator } = await import("@calcom/paypal/lib/updateAppCredentials.validator");
  return validator as AppCredentialsValidator;
};

const getAlbyValidator = async (): Promise<AppCredentialsValidator> => {
  const { albyCredentialKeysSchema } = await import("@calcom/alby/lib/albyCredentialKeysSchema");
  return ({ input }: { input: TUpdateAppCredentialsInputSchema }): Prisma.InputJsonObject =>
    albyCredentialKeysSchema.strict().parse(input.key) as Prisma.InputJsonObject;
};

const getBtcPayServerValidator = async (): Promise<AppCredentialsValidator> => {
  const { btcpayCredentialKeysSchema } = await import("@calcom/btcpayserver/lib/btcpayCredentialKeysSchema");
  return ({ input }: { input: TUpdateAppCredentialsInputSchema }): Prisma.InputJsonObject =>
    btcpayCredentialKeysSchema.strict().parse(input.key) as Prisma.InputJsonObject;
};

const getHitPayValidator = async (): Promise<AppCredentialsValidator> => {
  const { hitpayCredentialKeysSchema } = await import("@calcom/hitpay/lib/hitpayCredentialKeysSchema");
  return ({ input }: { input: TUpdateAppCredentialsInputSchema }): Prisma.InputJsonObject =>
    hitpayCredentialKeysSchema.strict().parse(input.key) as Prisma.InputJsonObject;
};

const validators: Record<string, AppCredentialsValidatorGetter> = {
  paypal: getPaypalValidator,
  alby: getAlbyValidator,
  btcpayserver: getBtcPayServerValidator,
  hitpay: getHitPayValidator,
};

export const handleCustomValidations = async ({
  input,
  appId,
}: UpdateAppCredentialsOptions & { appId: string }): Promise<Prisma.InputJsonObject> => {
  const { key } = input;
  const validatorGetter = validators[appId as keyof typeof validators];
  if (!validatorGetter) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Updating credentials is not supported for app ${appId}`,
    });
  }

  try {
    const validator = await validatorGetter();
    return toInputJsonObject(await validator({ input: { ...input, key } }));
  } catch (error) {
    const message = "Validation failed";
    if (error instanceof Error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }
};

export const updateAppCredentialsHandler = async ({
  ctx,
  input,
}: UpdateAppCredentialsOptions): Promise<boolean> => {
  const { user } = ctx;

  // Find user credential
  const credential = await prisma.credential.findFirst({
    where: {
      id: input.credentialId,
      userId: user.id,
    },
    select: {
      id: true,
      appId: true,
    },
  });
  // Check if credential exists
  if (!credential) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Could not find credential ${input.credentialId}`,
    });
  }

  const validatedKeys = await handleCustomValidations({ ctx, input, appId: credential.appId || "" });

  const updated = await prisma.credential.update({
    where: {
      id: credential.id,
    },
    select: {
      id: true,
    },
    data: {
      key: validatedKeys,
    },
  });

  return !!updated;
};

export type { UpdateAppCredentialsOptions };
