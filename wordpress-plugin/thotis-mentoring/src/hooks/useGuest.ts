import { useMutation, useQueryClient } from "@tanstack/react-query";

import { guestApi, ratingsApi } from "../api/client";

export function useRequestMagicLink() {
  return useMutation({
    mutationFn: (email: string) => guestApi.requestMagicLink(email),
  });
}

export function useGuestCancel(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { bookingId: number; reason: string }) => guestApi.cancel(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useGuestRate(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { bookingId: number; rating: number; feedback?: string }) =>
      guestApi.rate(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useSubmitRating() {
  return useMutation({
    mutationFn: ratingsApi.submit,
  });
}

export function useGuestReport(token: string) {
  return useMutation({
    mutationFn: (data: { bookingId: number; type: string; description?: string }) =>
      guestApi.report(token, data),
  });
}
