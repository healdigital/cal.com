/** Matches the AcademicField enum from Prisma */
export type AcademicField =
  | "DROIT"
  | "ECONOMIE_GESTION"
  | "SCIENCES_POLITIQUES"
  | "INFORMATIQUE"
  | "INGENIERIE"
  | "SANTE"
  | "SCIENCES"
  | "LETTRES_LANGUES"
  | "ARTS"
  | "COMMUNICATION"
  | "SPORT"
  | "AUTRE";

export interface MentorUser {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
}

export interface MentorProfile {
  id: string;
  userId: number;
  university: string;
  degree: string;
  field: AcademicField;
  currentYear: number;
  bio: string;
  profilePhotoUrl: string | null;
  linkedInUrl: string | null;
  expertise: string[];
  isActive: boolean;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "SUSPENDED" | "DELISTED";
  averageRating: number | null;
  totalRatings: number;
  totalSessions: number;
  completedSessions: number;
  user: MentorUser;
}

export interface ScoredMentor extends MentorProfile {
  matchScore?: number;
  matchReasons?: string[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface BookingResult {
  bookingId: number;
  googleMeetLink: string;
  calendarEventId: string;
  confirmationSent: boolean;
}

export interface Session {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "CANCELLED" | "REJECTED";
  metadata: Record<string, unknown> | null;
  responses: {
    email?: string;
    name?: string;
    question?: string;
  } | null;
  user: MentorUser;
  thotisSessionSummary?: {
    content: string;
    nextSteps: string | null;
    createdAt: string;
  } | null;
}

export interface SessionRating {
  id: string;
  bookingId: number;
  rating: number;
  feedback: string | null;
  createdAt: string;
}

export interface PostSessionData {
  summary: {
    content: string;
    nextSteps: string | null;
    createdAt: string;
  } | null;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
}

export interface OrientationIntent {
  targetFields: string[];
  academicLevel: string;
  zone?: string | null;
  goals?: string[];
}

export interface PaginatedResult<T> {
  profiles: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** WordPress global injected via wp_localize_script */
export interface ThotisConfig {
  apiUrl: string;
  wpUrl: string;
  locale: string;
  nonce: string;
}

declare global {
  interface Window {
    thotisConfig?: ThotisConfig;
  }
}
