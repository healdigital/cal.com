import { format, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import type { Session } from "../types";

interface SessionCardProps {
  session: Session;
  token?: string;
  onCancel?: (session: Session) => void;
  onRate?: (session: Session) => void;
}

export function SessionCard({ session, token, onCancel, onRate }: SessionCardProps) {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const isSessionPast = isPast(end);
  const isCancelled = session.status === "CANCELLED";
  const hasSummary = !!session.thotisSessionSummary;
  const wpUrl = window.thotisConfig?.wpUrl ?? "";

  const statusColors: Record<string, string> = {
    PENDING: "th-bg-yellow-100 th-text-yellow-800",
    ACCEPTED: "th-bg-green-100 th-text-green-800",
    CANCELLED: "th-bg-red-100 th-text-red-800",
    REJECTED: "th-bg-thotis-gray-100 th-text-thotis-gray-800",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Confirmée",
    CANCELLED: "Annulée",
    REJECTED: "Refusée",
  };

  return (
    <div className="th-rounded-lg th-border th-border-thotis-gray-200 th-bg-white th-p-5">
      <div className="th-flex th-items-start th-justify-between">
        <div>
          <h4 className="th-font-heading th-font-semibold th-text-thotis-gray-900">{session.title}</h4>
          <p className="th-text-sm th-text-thotis-gray-600">avec {session.user.name ?? "Mentor"}</p>
        </div>
        <span
          className={`th-rounded-full th-px-2.5 th-py-0.5 th-text-xs th-font-medium ${statusColors[session.status] ?? ""}`}>
          {statusLabels[session.status] ?? session.status}
        </span>
      </div>

      <div className="th-mt-3 th-flex th-items-center th-gap-4 th-text-sm th-text-thotis-gray-600">
        <span>{format(start, "EEEE d MMMM yyyy", { locale: fr })}</span>
        <span>
          {format(start, "HH:mm")} — {format(end, "HH:mm")}
        </span>
      </div>

      {session.responses?.question && (
        <p className="th-mt-2 th-text-sm th-italic th-text-thotis-gray-500">
          &ldquo;{session.responses.question}&rdquo;
        </p>
      )}

      {/* Actions */}
      <div className="th-mt-4 th-flex th-flex-wrap th-gap-2">
        {/* Cancel (only upcoming, not cancelled) */}
        {!isSessionPast && !isCancelled && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(session)}
            className="th-rounded th-border th-border-red-200 th-px-3 th-py-1.5 th-text-xs th-text-red-600 hover:th-bg-red-50">
            Annuler
          </button>
        )}

        {/* Rate (past, not cancelled, not already rated) */}
        {isSessionPast && !isCancelled && onRate && (
          <button
            type="button"
            onClick={() => onRate(session)}
            className="th-rounded th-bg-thotis-orange th-px-3 th-py-1.5 th-text-xs th-font-medium th-text-white hover:th-bg-thotis-orange-dark">
            Noter cette session
          </button>
        )}

        {/* View summary */}
        {hasSummary && (
          <a
            href={`${wpUrl}/mentorat/mes-sessions/?view=${session.uid}${token ? `&token=${token}` : ""}`}
            className="th-rounded th-border th-border-thotis-blue th-px-3 th-py-1.5 th-text-xs th-text-thotis-blue hover:th-bg-blue-50">
            Voir le compte-rendu
          </a>
        )}
      </div>
    </div>
  );
}
