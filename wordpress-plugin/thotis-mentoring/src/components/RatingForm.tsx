import { useState } from "react";
import { useGuestRate, useSubmitRating } from "../hooks/useGuest";
import type { Session } from "../types";
import { StarRating } from "./common/StarRating";

interface RatingFormProps {
  session: Session;
  token?: string;
  onBack?: () => void;
}

export function RatingForm({ session, token, onBack }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const guestRate = useGuestRate(token ?? "");
  const submitRating = useSubmitRating();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      if (token) {
        await guestRate.mutateAsync({
          bookingId: session.id,
          rating,
          feedback: feedback || undefined,
        });
      } else {
        await submitRating.mutateAsync({
          bookingId: session.id,
          rating,
          feedback: feedback || undefined,
          email: session.responses?.email ?? "",
        });
      }
      setSubmitted(true);
    } catch {
      // Error handled by mutation
    }
  };

  const isPending = guestRate.isPending || submitRating.isPending;
  const error = guestRate.error || submitRating.error;

  if (submitted) {
    return (
      <div className="th-rounded-xl th-border th-border-thotis-gray-200 th-bg-white th-p-8 th-text-center">
        <div className="th-mx-auto th-flex th-h-16 th-w-16 th-items-center th-justify-center th-rounded-full th-bg-green-100">
          <span className="th-text-3xl">&#10003;</span>
        </div>
        <h3 className="th-mt-4 th-font-heading th-text-lg th-font-semibold">Merci pour ton avis !</h3>
        <p className="th-mt-2 th-text-sm th-text-thotis-gray-600">
          Ton retour aide les futurs élèves à trouver le bon mentor.
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="th-mt-6 th-rounded-lg th-bg-thotis-blue th-px-6 th-py-2 th-text-sm th-text-white hover:th-bg-thotis-blue-dark">
            Retour aux sessions
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="th-rounded-xl th-border th-border-thotis-gray-200 th-bg-white th-p-6 th-space-y-5">
      <div>
        <h3 className="th-font-heading th-text-lg th-font-semibold th-text-thotis-gray-900">
          Note ta session
        </h3>
        <p className="th-text-sm th-text-thotis-gray-600">avec {session.user.name ?? "le mentor"}</p>
      </div>

      <div className="th-flex th-flex-col th-items-center th-gap-2">
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating === 0 && <p className="th-text-xs th-text-thotis-gray-400">Clique sur les étoiles</p>}
      </div>

      <div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Un commentaire ? (facultatif)"
          rows={4}
          className="th-w-full th-resize-none th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue"
        />
      </div>

      {error && (
        <p className="th-text-sm th-text-red-600">
          {error instanceof Error ? error.message : "Erreur lors de l'envoi"}
        </p>
      )}

      <div className="th-flex th-gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="th-flex-1 th-rounded-lg th-border th-border-thotis-gray-200 th-py-2.5 th-text-sm th-text-thotis-gray-700 hover:th-bg-thotis-gray-50">
            Retour
          </button>
        )}
        <button
          type="submit"
          disabled={rating === 0 || isPending}
          className="th-flex-1 th-rounded-lg th-bg-thotis-orange th-py-2.5 th-text-sm th-font-semibold th-text-white th-transition-colors hover:th-bg-thotis-orange-dark disabled:th-opacity-50">
          {isPending ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
