import { useQuery } from "@tanstack/react-query";
import { guestApi, sessionsApi } from "../api/client";

type SessionStatus = "upcoming" | "past" | "cancelled" | "all";

/**
 * Fetch sessions by email (for returning visitors who remember their email).
 * Pass status=undefined to disable the query.
 */
export function useSessionsByEmail(email: string, status?: SessionStatus) {
  return useQuery({
    queryKey: ["sessions", "email", email, status ?? "none"] as const,
    queryFn: () => sessionsApi.getByEmail(email, status),
    enabled: !!email && status !== undefined,
    staleTime: 30_000,
  });
}

/**
 * Fetch sessions by guest magic link token.
 * Pass status=undefined to disable the query.
 */
export function useSessionsByToken(token: string, status?: SessionStatus) {
  return useQuery({
    queryKey: ["sessions", "token", token, status ?? "none"] as const,
    queryFn: () => guestApi.getSessions(token, status),
    enabled: !!token && status !== undefined,
    staleTime: 30_000,
  });
}
