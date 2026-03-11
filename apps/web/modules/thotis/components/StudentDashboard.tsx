"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { useState } from "react";
import { SessionManagementUI } from "./SessionManagementUI";
import { StudentOnboarding } from "./StudentOnboarding";
import { StudentSettings } from "./StudentSettings";

const RequestLinkInline = (): ReactElement => {
  const { i18n, t } = useLocale();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const mutation = trpc.thotis.guest.requestInboxLink.useMutation({
    onSuccess: () => setSuccess(true),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email) return;
    mutation.mutate({ email, locale: i18n.language });
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-green-800 text-sm">
        <p className="font-semibold">{t("thotis_link_sent")}</p>
        <p>{t("thotis_check_email_for_link")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
      <Label htmlFor="guest-email" className="sr-only">
        {t("email")}
      </Label>
      <div className="flex gap-2">
        <TextField
          id="guest-email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
          placeholder={t("email_placeholder")}
          required
          containerClassName="flex-1"
        />
        <Button type="submit" loading={mutation.isPending}>
          {t("thotis_send_link")}
        </Button>
      </div>
    </form>
  );
};

interface StudentDashboardProps {
  email: string;
  token?: string;
}

export const StudentDashboard = ({ email, token }: StudentDashboardProps): ReactElement => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled" | "settings">("upcoming");
  const utils = trpc.useUtils();

  // Authenticated User Data
  const { data: me } = trpc.viewer.me.get.useQuery(undefined, { enabled: !token });

  // Guest Query
  const {
    data: guestSessions,
    isPending: isPendingGuest,
    error: guestError,
  } = trpc.thotis.guest.getSessionsByToken.useQuery(
    { token: token!, status: activeTab === "settings" ? "upcoming" : activeTab },
    { enabled: !!token }
  );

  // Authenticated Student Query
  const {
    data: studentSessions,
    isPending: isPendingStudent,
    error: studentError,
  } = trpc.thotis.booking.studentSessions.useQuery(
    { status: activeTab === "settings" ? "upcoming" : activeTab },
    { enabled: !token && !!email && activeTab !== "settings" }
  );

  const isPending = token ? isPendingGuest : isPendingStudent;
  const sessions = token ? guestSessions : studentSessions;
  const error = token ? guestError : studentError;

  const handleActionComplete = (): void => {
    if (token) {
      void utils.thotis.guest.getSessionsByToken.invalidate();
    } else {
      void utils.thotis.booking.studentSessions.invalidate();
    }
  };

  // Check Onboarding status
  const { data: intent, isPending: isPendingIntent } = trpc.thotis.intent.get.useQuery(undefined, {
    enabled: !token && !!email,
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  // If authenticated and no intent found, show onboarding unless they closed it/finished it
  const isNewStudent = !token && !isPendingIntent && !intent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-emphasis">{t("thotis_my_sessions")}</h1>
          <p className="text-sm text-subtle">{email}</p>
        </div>
        {!token && (
          <Button color="secondary" href="/thotis/dashboard" className="gap-2">
            <Icon name="external-link" className="h-4 w-4" />
            {t("thotis_dashboard")}
          </Button>
        )}
      </div>

      {isNewStudent || showOnboarding ? (
        <StudentOnboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <>
          {/* Tabs */}
          <div role="tablist" className="flex gap-0 border-subtle border-b">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "upcoming"}
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "upcoming"
                  ? "border-blue-600 border-b-2 text-emphasis"
                  : "text-subtle hover:text-emphasis"
              }`}>
              {t("thotis_upcoming_sessions")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "past"}
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "past"
                  ? "border-blue-600 border-b-2 text-emphasis"
                  : "text-subtle hover:text-emphasis"
              }`}>
              {t("thotis_past_sessions")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "cancelled"}
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "cancelled"
                  ? "border-blue-600 border-b-2 text-emphasis"
                  : "text-subtle hover:text-emphasis"
              }`}>
              {t("thotis_cancelled_sessions")}
            </button>
            {!token && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "settings"
                    ? "border-blue-600 border-b-2 text-emphasis"
                    : "text-subtle hover:text-emphasis"
                }`}>
                {t("settings")}
              </button>
            )}
          </div>

          {activeTab === "settings" && me ? (
            <StudentSettings user={{ id: me.id, name: me.name, email: me.email }} />
          ) : isPending ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-subtle bg-default py-12 text-center">
              <Icon
                name={
                  token && (error.data?.code === "UNAUTHORIZED" || error.data?.code === "FORBIDDEN")
                    ? "lock"
                    : "circle-alert"
                }
                className="mx-auto mb-3 h-10 w-10 text-subtle"
              />
              <h3 className="mb-2 font-bold text-emphasis text-lg">
                {token && (error.data?.code === "UNAUTHORIZED" || error.data?.code === "FORBIDDEN")
                  ? t("thotis_token_expired_title")
                  : t("thotis_something_wrong")}
              </h3>
              {token && (error.data?.code === "UNAUTHORIZED" || error.data?.code === "FORBIDDEN") ? (
                <div className="space-y-4">
                  <p className="mx-auto max-w-md text-sm text-subtle">
                    {t("thotis_token_expired_description")}
                  </p>
                  <RequestLinkInline />
                </div>
              ) : (
                <p className="text-sm text-subtle">{error.message}</p>
              )}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="rounded-lg border border-subtle bg-default py-12 text-center">
              <Icon name="calendar" className="mx-auto mb-3 h-10 w-10 text-subtle" />
              <p className="font-medium text-emphasis text-sm">
                {activeTab === "upcoming"
                  ? t("thotis_no_upcoming_sessions")
                  : activeTab === "past"
                    ? t("thotis_no_past_sessions")
                    : t("thotis_no_cancelled_sessions")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <SessionManagementUI
                  key={session.id}
                  booking={session}
                  isMentor={false}
                  onActionComplete={handleActionComplete}
                  token={token}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
