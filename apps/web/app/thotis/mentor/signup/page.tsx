"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Icon } from "@calcom/ui/components/icon";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { MentorOnboarding } from "~/thotis/components/MentorOnboarding";
import { ThotisErrorState, ThotisLoadingState } from "~/thotis/components/ThotisAsyncState";

export default function MentorSignupPage(): ReactElement | null {
  const { t } = useLocale();
  const router = useRouter();

  // Check if user already has a profile - redirect if so
  const {
    data: existingProfile,
    error,
    isLoading: isCheckingProfile,
    refetch,
  } = trpc.thotis.profile.get.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (existingProfile) {
      router.replace("/thotis/dashboard");
    }
  }, [existingProfile, router]);

  // Show loading while checking existing profile
  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ThotisLoadingState className="min-h-screen" spinnerClassName="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    const isUnauthorized = error.data?.code === "UNAUTHORIZED";
    let actionLabel: string | undefined;
    let icon: "circle-alert" | "lock" = "circle-alert";
    let onAction: () => void;

    if (isUnauthorized) {
      actionLabel = t("sign_in");
      icon = "lock";
      onAction = () => {
        router.push("/auth/signin?callbackUrl=/thotis/mentor/signup");
      };
    } else {
      onAction = () => {
        void refetch();
      };
    }

    return (
      <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <ThotisErrorState
            actionLabel={actionLabel}
            icon={icon}
            message={error.message}
            onAction={onAction}
          />
        </div>
      </div>
    );
  }

  // Don't render form if profile exists (redirect is in progress)
  if (existingProfile) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/thotis")}
            className="flex items-center text-gray-500 text-sm transition-colors hover:text-gray-700">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("thotis_back_to_thotis")}
          </button>
        </div>

        <MentorOnboarding onComplete={() => router.push("/thotis/dashboard")} />
      </div>
    </div>
  );
}
