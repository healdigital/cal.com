import { useState } from "react";

import { useRequestMagicLink } from "../hooks/useGuest";

interface GuestAccessFormProps {
  onTokenReceived?: (token: string) => void;
}

export function GuestAccessForm({ onTokenReceived }: GuestAccessFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const requestLink = useRequestMagicLink();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;

    try {
      await requestLink.mutateAsync(email);
      setSent(true);
    } catch {
      // Error handled by mutation
    }
  };

  if (sent) {
    return (
      <div className="th-rounded-lg th-border th-border-green-200 th-bg-green-50 th-p-6 th-text-center">
        <p className="th-font-medium th-text-green-800">Lien envoyé !</p>
        <p className="th-mt-2 th-text-sm th-text-green-700">
          Vérifie ta boîte mail ({email}). Le lien est valable 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="th-space-y-3">
      <p className="th-text-sm th-font-medium th-text-thotis-gray-700">
        Recevoir un lien magique par email
      </p>
      <div className="th-flex th-gap-2">
        <label htmlFor="guest-email" className="th-sr-only">Email</label>
        <input
          id="guest-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton-email@exemple.fr"
          required
          className="th-flex-1 th-rounded-lg th-border th-border-thotis-gray-200 th-px-4 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue"
        />
        <button
          type="submit"
          disabled={requestLink.isPending}
          className="th-rounded-lg th-bg-thotis-blue th-px-5 th-py-2.5 th-text-sm th-font-medium th-text-white hover:th-bg-thotis-blue-dark disabled:th-opacity-50"
        >
          {requestLink.isPending ? "..." : "Envoyer"}
        </button>
      </div>
      {requestLink.error && (
        <p className="th-text-xs th-text-red-600">
          {requestLink.error instanceof Error ? requestLink.error.message : "Erreur"}
        </p>
      )}
    </form>
  );
}
