import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = (process.env.THOTIS_WP_ORIGIN || "https://thotismedia.com")
  .split(",")
  .map((o) => o.trim());

function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Thotis-Guest-Token",
    "Access-Control-Max-Age": "86400",
  };
}

type RouteHandler = (request: NextRequest, context?: unknown) => Promise<NextResponse>;

/**
 * Wraps a Next.js route handler with CORS support for the WordPress frontend.
 * Handles OPTIONS preflight requests automatically.
 */
export function withCors(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: unknown) => {
    const headers = getCorsHeaders(request);

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers });
    }

    try {
      const response = await handler(request, context);
      for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      const status = error instanceof ApiError ? error.status : 500;
      const res = NextResponse.json({ error: message }, { status });
      for (const [key, value] of Object.entries(headers)) {
        res.headers.set(key, value);
      }
      return res;
    }
  };
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static tooManyRequests(message: string) {
    return new ApiError(429, message);
  }
}
