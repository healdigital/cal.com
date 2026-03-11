"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { ReactElement } from "react";
import { ThotisErrorState } from "~/thotis/components/ThotisAsyncState";

export default function ThotisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <ThotisErrorState message={error.message} onAction={reset} title={t("thotis_something_wrong")} />
      </div>
    </div>
  );
}
