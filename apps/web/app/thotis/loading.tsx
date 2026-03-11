import type { ReactElement } from "react";
import { ThotisLoadingState } from "~/thotis/components/ThotisAsyncState";

export default function ThotisLoading(): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <ThotisLoadingState className="min-h-screen" spinnerClassName="h-10 w-10" />
    </div>
  );
}
