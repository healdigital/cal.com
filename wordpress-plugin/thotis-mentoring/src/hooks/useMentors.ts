import { useQuery } from "@tanstack/react-query";

import { type MentorSearchParams, mentorsApi } from "../api/client";

export function useMentorSearch(params: MentorSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["mentors", "search", params],
    queryFn: () => mentorsApi.search(params),
    enabled,
    staleTime: 60_000,
  });
}

export function useMentorProfile(username: string) {
  return useQuery({
    queryKey: ["mentors", "profile", username],
    queryFn: () => mentorsApi.getByUsername(username),
    enabled: !!username,
    staleTime: 120_000,
  });
}

export function useTopMentors() {
  return useQuery({
    queryKey: ["mentors", "top"],
    queryFn: () => mentorsApi.getTop(),
    staleTime: 300_000,
  });
}

export function useUniversities() {
  return useQuery({
    queryKey: ["mentors", "universities"],
    queryFn: () => mentorsApi.getUniversities(),
    staleTime: 600_000,
  });
}
