import { useState } from "react";

import { useSessionsByEmail, useSessionsByToken } from "../hooks/useSessions";
import type { Session } from "../types";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { GuestAccessForm } from "./GuestAccessForm";
import { RatingForm } from "./RatingForm";
import { SessionCard } from "./SessionCard";
import { LoadingSpinner } from "./common/LoadingSpinner";

type TabId = "upcoming" | "past" | "cancelled";

function safeGetItem(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage full or disabled — silently ignore
  }
}

interface SessionsDashboardProps {
  token?: string;
}

export function SessionsDashboard({ token: initialToken }: SessionsDashboardProps) {
  const [tab, setTab] = useState<TabId>("upcoming");
  const [token, setToken] = useState(initialToken ?? "");
  const [email, setEmail] = useState(() => safeGetItem("thotis_email"));
  const [ratingSession, setRatingSession] = useState<Session | null>(null);

  // Determine access method: token takes priority over email
  const hasToken = !!token;
  const hasEmail = !hasToken && !!email;

  // Only enable the relevant query to prevent race conditions
  const tokenQuery = useSessionsByToken(token, hasToken ? tab : undefined);
  const emailQuery = useSessionsByEmail(email, hasEmail ? tab : undefined);

  const activeQuery = hasToken ? tokenQuery : emailQuery;
  const sessions = activeQuery.data?.sessions ?? [];

  // Handle cancel
  const handleCancel = (session: Session) => {
    if (!confirm(`Annuler la session avec ${session.user.name ?? "le mentor"} ?`)) return;
    const cancelUrl = hasToken
      ? `${window.thotisConfig?.wpUrl}/mentorat/mes-sessions/?action=cancel&booking=${session.id}&token=${token}`
      : `${window.thotisConfig?.wpUrl}/mentorat/mes-sessions/?action=cancel&booking=${session.id}`;
    window.location.href = cancelUrl;
  };

  // If no access method, show guest form
  if (!hasToken && !hasEmail) {
    return (
      <div className="th-space-y-6">
        <div className="th-text-center">
          <h2 className="th-font-heading th-text-2xl th-font-bold th-text-thotis-gray-900">
            Mes sessions de mentorat
          </h2>
          <p className="th-mt-2 th-text-thotis-gray-600">
            Entre ton email pour accéder à tes sessions, ou demande un lien magique.
          </p>
        </div>

        <div className="th-mx-auto th-max-w-md th-space-y-4">
          <div>
            <label htmlFor="thotis-email-input" className="th-sr-only">Email de réservation</label>
            <input
              id="thotis-email-input"
              type="email"
              placeholder="Ton email de réservation"
              className="th-w-full th-rounded-lg th-border th-border-thotis-gray-200 th-px-4 th-py-3 th-text-sm th-outline-none focus:th-border-thotis-blue"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.includes("@")) {
                    safeSetItem("thotis_email", val);
                    setEmail(val);
                  }
                }
              }}
            />
            <p className="th-mt-1 th-text-xs th-text-thotis-gray-500">
              Appuie sur Entrée pour accéder à tes sessions
            </p>
          </div>

          <div className="th-flex th-items-center th-gap-3">
            <hr className="th-flex-1 th-border-thotis-gray-200" />
            <span className="th-text-xs th-text-thotis-gray-400">ou</span>
            <hr className="th-flex-1 th-border-thotis-gray-200" />
          </div>

          <GuestAccessForm onTokenReceived={(t) => setToken(t)} />
        </div>
      </div>
    );
  }

  // Rating modal wrapped in ErrorBoundary
  if (ratingSession) {
    return (
      <div className="th-mx-auto th-max-w-md">
        <ErrorBoundary
          fallback={
            <div className="th-rounded-lg th-border th-border-red-200 th-bg-red-50 th-p-6 th-text-center">
              <p className="th-text-red-700 th-font-medium">Erreur lors du chargement du formulaire</p>
              <button
                type="button"
                onClick={() => setRatingSession(null)}
                className="th-mt-4 th-rounded th-bg-thotis-blue th-px-4 th-py-2 th-text-sm th-text-white hover:th-bg-thotis-blue-dark"
              >
                Retour aux sessions
              </button>
            </div>
          }
        >
          <RatingForm
            session={ratingSession}
            token={token}
            onBack={() => setRatingSession(null)}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="th-space-y-6">
      <h2 className="th-font-heading th-text-2xl th-font-bold th-text-thotis-gray-900">
        Mes sessions
      </h2>

      {/* Tabs */}
      <div className="th-flex th-gap-1 th-rounded-lg th-bg-thotis-gray-100 th-p-1" role="tablist" aria-label="Filtrer les sessions">
        {(["upcoming", "past", "cancelled"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`th-flex-1 th-rounded-md th-py-2 th-text-sm th-font-medium th-transition-colors ${
              tab === t
                ? "th-bg-white th-text-thotis-blue th-shadow-sm"
                : "th-text-thotis-gray-600 hover:th-text-thotis-gray-900"
            }`}
          >
            {t === "upcoming" && "À venir"}
            {t === "past" && "Passées"}
            {t === "cancelled" && "Annulées"}
          </button>
        ))}
      </div>

      {/* Loading */}
      {activeQuery.isPending && <LoadingSpinner />}

      {/* Error */}
      {activeQuery.error && (
        <div className="th-rounded-lg th-border th-border-red-200 th-bg-red-50 th-p-4 th-text-center">
          <p className="th-text-sm th-text-red-600">
            Erreur lors du chargement des sessions.
          </p>
          <button
            type="button"
            onClick={() => activeQuery.refetch()}
            className="th-mt-2 th-rounded th-bg-thotis-blue th-px-4 th-py-1.5 th-text-xs th-text-white hover:th-bg-thotis-blue-dark"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Empty */}
      {!activeQuery.isPending && !activeQuery.error && sessions.length === 0 && (
        <div className="th-py-12 th-text-center">
          <p className="th-text-thotis-gray-500">Aucune session {tab === "upcoming" ? "à venir" : tab === "past" ? "passée" : "annulée"}</p>
          {tab === "upcoming" && (
            <a
              href={`${window.thotisConfig?.wpUrl}/mentorat/mentors/`}
              className="th-mt-4 th-inline-block th-rounded-lg th-bg-thotis-orange th-px-6 th-py-2.5 th-text-sm th-font-medium th-text-white hover:th-bg-thotis-orange-dark"
            >
              Trouver un mentor
            </a>
          )}
        </div>
      )}

      {/* Sessions list */}
      <div className="th-space-y-3">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            token={token}
            onCancel={handleCancel}
            onRate={(s) => setRatingSession(s)}
          />
        ))}
      </div>
    </div>
  );
}
