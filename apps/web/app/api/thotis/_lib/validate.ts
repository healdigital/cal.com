import type { NextRequest } from "next/server";
import type { z } from "zod";

import { ApiError } from "./cors";

/**
 * Parse and validate query parameters against a Zod schema.
 */
/**
 * Sanitize Zod validation errors to avoid leaking schema internals.
 * Only returns field path and a generic message type.
 */
function formatZodErrors(issues: z.ZodIssue[]): string {
  return issues
    .map((i) => {
      const field = i.path.length > 0 ? i.path.join(".") : "input";
      return `${field}: ${i.message}`;
    })
    .join(", ");
}

export function parseQuery<T extends z.ZodTypeAny>(request: NextRequest, schema: T): z.infer<T> {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const result = schema.safeParse(params);
  if (!result.success) {
    throw ApiError.badRequest(`Invalid query parameters: ${formatZodErrors(result.error.issues)}`);
  }
  return result.data;
}

/**
 * Parse and validate a JSON request body against a Zod schema.
 */
export async function parseBody<T extends z.ZodTypeAny>(request: NextRequest, schema: T): Promise<z.infer<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest("Invalid JSON body");
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiError.badRequest(`Invalid request body: ${formatZodErrors(result.error.issues)}`);
  }
  return result.data;
}

/**
 * Extract the guest token from the X-Thotis-Guest-Token header or query param.
 */
export function getGuestToken(request: NextRequest): string {
  const token =
    request.headers.get("X-Thotis-Guest-Token") ||
    new URL(request.url).searchParams.get("token");
  if (!token) {
    throw ApiError.unauthorized("Guest token required");
  }
  return token;
}
