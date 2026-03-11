"use client";

import process from "node:process";
import { ENDPOINTS } from "@calcom/trpc/react/shared";
import { httpBatchLink, httpLink, loggerLink, splitLink } from "@trpc/client";
import superjson from "superjson";
import { getEndpointPath } from "./resolve-endpoint";
import { trpc } from "./trpc";

function getTrpcUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/trpc";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }

  return `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/trpc`;
}

const url = getTrpcUrl();

type LinkContext = {
  op: {
    path: string;
  } & Record<string, unknown>;
} & Record<string, unknown>;

function resolveEndpoint<TContext extends LinkContext, TResult>(
  links: Record<string, (ctx: TContext) => TResult>
): (ctx: TContext) => TResult {
  return (ctx: TContext): TResult => {
    const { endpoint, path } = getEndpointPath(ctx.op.path);
    return links[endpoint]({ ...ctx, op: { ...ctx.op, path } });
  };
}

export const trpcClient = trpc.createClient({
  links: [
    // adds pretty logs to your console in development and logs errors in production
    loggerLink({
      enabled: (opts) =>
        (typeof process.env.NEXT_PUBLIC_LOGGER_LEVEL === "number" &&
          process.env.NEXT_PUBLIC_LOGGER_LEVEL >= 0) ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    splitLink({
      // check for context property `skipBatch`
      condition: (op) => !!op.context.skipBatch,
      // when condition is true, use normal request
      true: (runtime) => {
        const links = Object.fromEntries(
          ENDPOINTS.map((endpoint) => [
            endpoint,
            httpLink({
              url: `${url}/${endpoint}`,
            })(runtime),
          ])
        );
        return resolveEndpoint(links);
      },
      // when condition is false, use batch request
      false: (runtime) => {
        const links = Object.fromEntries(
          ENDPOINTS.map((endpoint) => [
            endpoint,
            httpBatchLink({
              url: `${url}/${endpoint}`,
            })(runtime),
          ])
        );
        return resolveEndpoint(links);
      },
    }),
  ],
  transformer: superjson,
});
