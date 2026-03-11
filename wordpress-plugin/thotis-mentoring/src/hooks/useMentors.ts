import { useQuery } from "@tanstack/react-query";
import { type MentorSearchParams, mentorsApi } from "../api/client";

export function useMentorSearch(params: MentorSearchParams, enabled = true) {
  return useQuery({
    queryKey: [
      "mentors",
      "search",
      params.q ?? "",
      params.field ?? "",
      params.university ?? "",
      params.sort ?? "rating",
      params.page ?? 1,
      params.pageSize ?? 20,
    ] as const,
    queryFn: () => mentorsApi.search(params),
    enabled,
    staleTime: 60_000,
  });
}

export function useMentorProfile(username: string) {
  return useQuery({
    queryKey: ["mentors", "profile", username] as const,
    queryFn: () => mentorsApi.getByUsername(username),
    enabled: !!username,
    staleTime: 120_000,
  });
}

export function useTopMentors() {
  return useQuery({
    queryKey: ["mentors", "top"] as const,
    queryFn: () => mentorsApi.getTop(),
    staleTime: 300_000,
  });
}

export function useUniversities() {
  return useQuery({
    queryKey: ["mentors", "universities"] as const,
    queryFn: () => mentorsApi.getUniversities(),
    staleTime: 600_000,
  });
}
