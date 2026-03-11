import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BookingWidget } from "./components/BookingWidget";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { GuestAccessForm } from "./components/GuestAccessForm";
import { LandingPage } from "./components/LandingPage";
import { MentorGrid } from "./components/MentorGrid";
import { MentorProfile } from "./components/MentorProfile";
import { RatingForm } from "./components/RatingForm";
import { SessionsDashboard } from "./components/SessionsDashboard";
import "./styles/thotis.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </QueryClientProvider>
    </StrictMode>
  );
}

type MountConfig = {
  id: string;
  render: (el: HTMLElement) => React.ReactNode;
};

const mounts: MountConfig[] = [
  {
    id: "thotis-landing",
    render: () => <LandingPage />,
  },
  {
    id: "thotis-mentors",
    render: (el) => {
      const field = el.dataset.field ?? "";
      return <MentorGrid initialField={field} />;
    },
  },
  {
    id: "thotis-mentor-profile",
    render: (el) => {
      const username = el.dataset.username ?? "";
      if (!username) return <p className="th-text-red-600">Profil introuvable</p>;
      return <MentorProfile username={username} />;
    },
  },
  {
    id: "thotis-sessions",
    render: (el) => {
      const token = el.dataset.token ?? "";
      return <SessionsDashboard token={token || undefined} />;
    },
  },
  {
    id: "thotis-rating",
    render: (el) => {
      const uid = el.dataset.uid ?? "";
      const token = el.dataset.token ?? "";
      if (!uid) return <p className="th-text-red-600">Session introuvable</p>;

      // For standalone rating, we build a minimal session object from what we know
      return (
        <RatingForm
          session={{
            id: 0,
            uid,
            title: "Session de mentorat",
            startTime: "",
            endTime: "",
            status: "ACCEPTED",
            metadata: null,
            responses: null,
            user: { id: 0, name: null, username: null, email: "" },
          }}
          token={token || undefined}
        />
      );
    },
  },
  {
    id: "thotis-booking",
    render: (el) => {
      const profileId = el.dataset.profileId ?? "";
      const mentorName = el.dataset.mentorName ?? "le mentor";
      if (!profileId) return null;
      return <BookingWidget profileId={profileId} mentorName={mentorName} />;
    },
  },
  {
    id: "thotis-guest-access",
    render: () => <GuestAccessForm />,
  },
];

function init() {
  for (const mount of mounts) {
    const container = document.getElementById(mount.id);
    if (!container) continue;

    const component = mount.render(container);
    if (!component) continue;

    const root = createRoot(container);
    root.render(<Providers>{component}</Providers>);
  }
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
