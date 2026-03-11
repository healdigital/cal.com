import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../api/client";

export function useAvailability(profileId: string, date: Date | null) {
  const start = date ? startOfDay(date).toISOString() : "";
  const end = date ? endOfDay(date).toISOString() : "";

  return useQuery({
    queryKey: ["availability", profileId, start],
    queryFn: () => bookingApi.getAvailability(profileId, start, end),
    enabled: !!profileId && !!date,
    staleTime: 30_000,
  });
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
