import { useQuery } from "@tanstack/react-query";

import { guestApi, sessionsApi } from "../api/client";

type SessionStatus = "upcoming" | "past" | "cancelled" | "all";

/**
 * Fetch sessions by email (for returning visitors who remember their email).
 */
export function useSessionsByEmail(email: string, status?: SessionStatus) {
  return useQuery({
    queryKey: ["sessions", "email", email, status],
    queryFn: () => sessionsApi.getByEmail(email, status),
    enabled: !!email,
    staleTime: 30_000,
  });
}

/**
 * Fetch sessions by guest magic link token.
 */
export function useSessionsByToken(token: string, status?: SessionStatus) {
  return useQuery({
    queryKey: ["sessions", "token", token, status],
    queryFn: () => guestApi.getSessions(token, status),
    enabled: !!token,
    staleTime: 30_000,
  });
}
