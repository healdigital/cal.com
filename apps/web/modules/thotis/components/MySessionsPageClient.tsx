"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Icon } from "@calcom/ui/components/icon";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ReactElement } from "react";
import { Suspense } from "react";
import { GuestMagicLinkForm } from "~/thotis/components/GuestMagicLinkForm";
import { StudentDashboard } from "~/thotis/components/StudentDashboard";

function MySessionsContent(): ReactElement {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const token = searchParams?.get("token");
  const displayEmail = session?.user?.email;

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    );
  }

  const isGuest = !displayEmail;
  const hasToken = !!token;

  if (isGuest && !hasToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <GuestMagicLinkForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <button
            type="button"
            onClick={(): void => router.push("/thotis")}
            className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("thotis_back_to_home")}
          </button>
        </div>

        <StudentDashboard email={displayEmail || ""} token={token || undefined} />
      </div>
    </div>
  );
}

export function MySessionsPageClient(): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
        </div>
      }>
      <MySessionsContent />
    </Suspense>
  );
}
