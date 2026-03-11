"use client";

import { OrientationIntentForm } from "@calcom/features/thotis/components/OrientationIntentForm";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ReactElement } from "react";

export default function ThotisLandingPage(): ReactElement {
  const { t } = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const upsertIntent = trpc.thotis.intent.upsert.useMutation();

  const handleFindMentors = (): void => {
    router.push("/thotis/mentors");
  };

  const handleBecomeMentor = (): void => {
    const signupUrl = "/thotis/mentor/signup";
    if (session) {
      router.push(signupUrl);
    } else {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(signupUrl)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Thotis</span>
            </div>
            <div className="flex gap-3">
              {session ? (
                <>
                  {session.user?.role === "ADMIN" && (
                    <Button color="minimal" onClick={() => router.push("/thotis/admin")} className="gap-2">
                      <Icon name="settings" className="h-4 w-4" />
                      {t("thotis_admin_dashboard")}
                    </Button>
                  )}
                  <Button
                    color="minimal"
                    onClick={() => router.push("/thotis/my-sessions")}
                    className="gap-2">
                    <Icon name="calendar" className="h-4 w-4" />
                    {t("thotis_my_sessions")}
                  </Button>
                  <Button onClick={() => router.push("/thotis/dashboard")} className="gap-2">
                    <Icon name="users" className="h-4 w-4" />
                    {t("thotis_dashboard")}
                  </Button>
                </>
              ) : (
                <>
                  <Button color="minimal" onClick={() => router.push("/auth/signin")}>
                    {t("sign_in")}
                  </Button>
                  <Button onClick={() => router.push("/auth/signup")}>{t("get_started")}</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {t("thotis_hero_title_prefix")}
              <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                {" "}
                {t("thotis_hero_title_highlight")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{t("thotis_hero_subtitle")}</p>
          </div>

          <OrientationIntentForm
            isPending={upsertIntent.isPending}
            onSubmit={async (data) => {
              console.log("Intent data:", data);

              // 1. Save to localStorage for both guest and logged-in users
              localStorage.setItem("thotis_orientation_intent", JSON.stringify(data));

              // 2. Persist to DB if logged in
              if (session) {
                try {
                  await upsertIntent.mutateAsync({
                    targetFields: data.targetFields,
                    academicLevel: data.academicLevel,
                    zone: data.zone,
                    goals: data.goals,
                    scheduleConstraints: data.scheduleConstraints,
                  });
                } catch (error) {
                  console.error("Failed to persist intent:", error);
                }
              }

              // 3. Direct navigation after persistence
              // We no longer pass field/level in params, the mentors page will use the intent
              router.push("/thotis/mentors");
            }}
          />

          <div className="mt-16 border-t border-gray-200 pt-8">
            <p className="mb-4 text-center text-sm font-medium text-gray-600">{t("thotis_booking_notice")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                {t("thotis_session_length_badge")}
              </span>
              <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                {t("thotis_timezone_badge")}
              </span>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                {t("thotis_notice_badge")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("thotis_how_it_works")}</h2>
            <p className="text-xl text-gray-600">{t("thotis_how_it_works_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="search" className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("thotis_find_a_mentor")}</h3>
              <p className="text-gray-600">{t("thotis_find_a_mentor_desc")}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="calendar" className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("thotis_book_a_session")}</h3>
              <p className="text-gray-600">{t("thotis_book_a_session_desc")}</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="video" className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("thotis_join_and_ask")}</h3>
              <p className="text-gray-600">{t("thotis_join_and_ask_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">{t("thotis_ready_to_start")}</h2>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">{t("thotis_ready_to_start_desc")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              color="secondary"
              onClick={handleFindMentors}
              className="gap-2 border-white text-white">
              <Icon name="search" className="h-5 w-5" />
              {t("thotis_find_mentors")}
            </Button>
            <Button
              size="lg"
              onClick={handleBecomeMentor}
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
              <Icon name="star" className="h-5 w-5" />
              {t("thotis_become_mentor")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Thotis. {t("thotis_footer_rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
