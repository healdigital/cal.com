"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Icon } from "@calcom/ui/components/icon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { MentorOnboarding } from "~/thotis/components/MentorOnboarding";

export default function MentorSignupPage() {
  const { t } = useLocale();
  const router = useRouter();

  // Check if user already has a profile - redirect if so
  const { data: existingProfile, isLoading: isCheckingProfile } = trpc.thotis.profile.get.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (existingProfile) {
      router.replace("/thotis/mentor-dashboard");
    }
  }, [existingProfile, router]);

  // Show loading while checking existing profile
  if (isCheckingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
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
            className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("thotis_back_to_thotis")}
          </button>
        </div>

        <MentorOnboarding onComplete={() => router.push("/thotis/mentor-dashboard")} />
      </div>
    </div>
  );
}
