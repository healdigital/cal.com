import type {
  BookingResult,
  MentorProfile,
  OrientationIntent,
  PaginatedResult,
  PostSessionData,
  ScoredMentor,
  Session,
  SessionRating,
  TimeSlot,
} from "../types";

function getApiUrl(): string {
  return window.thotisConfig?.apiUrl ?? "https://meet.heal-digital.com/api/thotis";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers ?? {}) as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && "error" in body) {
        const errorField = (body as { error: unknown }).error;
        if (typeof errorField === "string") {
          message = errorField;
        }
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function withToken(token: string): Record<string, string> {
  return { "X-Thotis-Guest-Token": token };
}

// ─── Mentors ─────────────────────────────────────────────

export interface MentorSearchParams {
  q?: string;
  field?: string;
  university?: string;
  minRating?: number;
  page?: number;
  pageSize?: number;
  sort?: "rating" | "popularity" | "newest";
}

export const mentorsApi = {
  search: (params: MentorSearchParams) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.field) qs.set("field", params.field);
    if (params.university) qs.set("university", params.university);
    if (params.minRating) qs.set("minRating", String(params.minRating));
    if (params.page) qs.set("page", String(params.page));
    if (params.pageSize) qs.set("pageSize", String(params.pageSize));
    if (params.sort) qs.set("sort", params.sort);
    return request<PaginatedResult<MentorProfile>>(`/mentors?${qs.toString()}`);
  },

  getByUsername: (username: string) =>
    request<{ profile: MentorProfile }>(`/mentors/${encodeURIComponent(username)}`),

  getTop: () => request<{ profiles: MentorProfile[] }>("/mentors/top"),

  getRecommended: (intent: OrientationIntent) =>
    request<{ profiles: ScoredMentor[] }>("/mentors/recommended", {
      method: "POST",
      body: JSON.stringify(intent),
    }),

  getUniversities: () => request<{ universities: string[] }>("/universities"),
};

// ─── Booking ─────────────────────────────────────────────

export const bookingApi = {
  getAvailability: (profileId: string, start: string, end: string) =>
    request<{ slots: TimeSlot[] }>(
      `/availability?profileId=${profileId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    ),

  create: (data: {
    studentProfileId: string;
    dateTime: string;
    prospectiveStudent: { name: string; email: string; question?: string };
  }) =>
    request<BookingResult>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancel: (data: { bookingId: number; reason: string; email: string }) =>
    request<{ success: boolean }>("/bookings/cancel", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  reschedule: (data: { bookingId: number; newDateTime: string; email: string }) =>
    request<BookingResult>("/bookings/reschedule", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Sessions ────────────────────────────────────────────

export const sessionsApi = {
  getByEmail: (email: string, status?: string) => {
    const qs = new URLSearchParams({ email });
    if (status) qs.set("status", status);
    return request<{ sessions: Session[] }>(`/sessions?${qs.toString()}`);
  },
};

// ─── Ratings ─────────────────────────────────────────────

export const ratingsApi = {
  submit: (data: { bookingId: number; rating: number; feedback?: string; email: string }) =>
    request<{ rating: SessionRating }>("/ratings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByBooking: (bookingId: number) =>
    request<{ rating: SessionRating | null }>(`/ratings?bookingId=${bookingId}`),
};

// ─── Guest ───────────────────────────────────────────────

export const guestApi = {
  requestMagicLink: (email: string) =>
    request<{ success: boolean }>("/guest/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  getSessions: (token: string, status?: string) => {
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    return request<{ sessions: Session[] }>(`/guest/sessions?${qs.toString()}`, {
      headers: withToken(token),
    });
  },

  cancel: (token: string, data: { bookingId: number; reason: string }) =>
    request<{ success: boolean }>("/guest/cancel", {
      method: "POST",
      body: JSON.stringify(data),
      headers: withToken(token),
    }),

  rate: (token: string, data: { bookingId: number; rating: number; feedback?: string }) =>
    request<{ rating: SessionRating }>("/guest/rate", {
      method: "POST",
      body: JSON.stringify(data),
      headers: withToken(token),
    }),

  report: (token: string, data: { bookingId: number; type: string; description?: string }) =>
    request<{ success: boolean }>("/guest/report", {
      method: "POST",
      body: JSON.stringify(data),
      headers: withToken(token),
    }),

  getPostSession: (token: string, bookingId: number) =>
    request<PostSessionData>(`/guest/post-session?bookingId=${bookingId}`, {
      headers: withToken(token),
    }),
};

// ─── Intent ──────────────────────────────────────────────

export const intentApi = {
  submitAndGetRecommendations: (intent: OrientationIntent) =>
    request<{ intent: OrientationIntent; recommendations: ScoredMentor[] }>("/intent", {
      method: "POST",
      body: JSON.stringify(intent),
    }),
};

// ─── Analytics ───────────────────────────────────────────

export const analyticsApi = {
  track: (data: {
    eventType: string;
    profileId?: string;
    bookingId?: number;
    field?: string;
    metadata?: Record<string, unknown>;
  }) =>
    request<{ success: boolean }>("/analytics", {
      method: "POST",
      body: JSON.stringify({ ...data, source: "wordpress" }),
    }),
};
