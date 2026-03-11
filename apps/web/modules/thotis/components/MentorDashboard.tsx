"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { useCallback, useState } from "react";
import { SessionManagementUI } from "./SessionManagementUI";
import { ThotisErrorState, ThotisLoadingState } from "./ThotisAsyncState";

type SessionTab = "upcoming" | "past" | "cancelled";

interface MentorDashboardProps {
  userId: number;
}

export const MentorDashboard = ({ userId }: MentorDashboardProps) => {
  const { t } = useLocale();
  const [sessionTab, setSessionTab] = useState<SessionTab>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleTabChange = useCallback((tab: SessionTab) => {
    setSessionTab(tab);
    setCurrentPage(1);
  }, []);

  // Fetch mentor stats (uses StudentProfile which stores mentor stats too)
  const {
    data: stats,
    error: statsError,
    isPending: isPendingStats,
    refetch: refetchStats,
  } = trpc.thotis.statistics.studentStats.useQuery({ studentId: userId }, { enabled: !!userId });

  // Fetch mentor profile
  const { data: profile } = trpc.thotis.profile.get.useQuery();

  // Fetch sessions with pagination - the response includes `total` so no separate count query needed
  const {
    data: sessionsData,
    error: sessionsError,
    isPending: isPendingSessions,
    refetch: refetchSessions,
  } = trpc.thotis.booking.mentorSessions.useQuery(
    { status: sessionTab, page: currentPage, pageSize },
    { enabled: !!userId }
  );

  // Derive upcoming count from sessions data when on the upcoming tab, or from stats
  const upcomingCount =
    sessionTab === "upcoming"
      ? (sessionsData?.total ?? 0)
      : (stats?.totalSessions ?? 0) - (stats?.completedSessions ?? 0) - (stats?.cancelledSessions ?? 0);

  if (isPendingStats) {
    return <ThotisLoadingState spinnerClassName="h-10 w-10" />;
  }

  if (statsError) {
    return <ThotisErrorState message={statsError.message} onAction={() => void refetchStats()} />;
  }

  const statCards = [
    {
      label: t("thotis_upcoming_count"),
      value: Math.max(0, upcomingCount),
      icon: "calendar" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: t("thotis_completed_count"),
      value: stats?.completedSessions ?? 0,
      icon: "check-circle" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("thotis_cancelled_count"),
      value: stats?.cancelledSessions ?? 0,
      icon: "x-circle" as const,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: t("thotis_avg_rating"),
      value: stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "N/A",
      icon: "star" as const,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-emphasis text-2xl font-bold">{t("thotis_dashboard")}</h1>
          {profile && (
            <p className="text-subtle text-sm">
              {profile.university} &middot; {profile.field}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button color="secondary" href="/thotis/mentor/settings" className="gap-2">
            <Icon name="settings" className="h-4 w-4" />
            {t("settings")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-default border-subtle rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon
                  name={card.icon === "check-circle" ? "check" : card.icon === "x-circle" ? "x" : card.icon}
                  className={`h-5 w-5 ${card.color}`}
                />
              </div>
              <div>
                <p className="text-subtle text-xs font-medium">{card.label}</p>
                <p className="text-emphasis text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session Management Section */}
      <div>
        <h2 className="text-emphasis mb-4 text-lg font-semibold">{t("thotis_manage_sessions")}</h2>

        {/* Session Tabs */}
        <div
          className="border-subtle mb-4 flex gap-0 border-b"
          role="tablist"
          aria-label={t("thotis_manage_sessions")}>
          {(["upcoming", "past", "cancelled"] as const).map((tab, index) => {
            const isActive = sessionTab === tab;
            const tabLabels: Record<SessionTab, string> = {
              upcoming: t("thotis_upcoming_sessions"),
              past: t("thotis_past_sessions"),
              cancelled: t("thotis_cancelled_count"),
            };
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab)}
                onKeyDown={(e) => {
                  const tabs: SessionTab[] = ["upcoming", "past", "cancelled"];
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    handleTabChange(tabs[(index + 1) % tabs.length]);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    handleTabChange(tabs[(index - 1 + tabs.length) % tabs.length]);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-emphasis border-b-2 border-blue-600" : "text-subtle hover:text-emphasis"
                }`}>
                {tabLabels[tab]}
                {sessionsData && isActive && sessionsData.total > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-medium text-blue-700">
                    {sessionsData.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sessions List */}
        <div role="tabpanel" aria-label={sessionTab}>
          {isPendingSessions ? (
            <ThotisLoadingState />
          ) : sessionsError ? (
            <ThotisErrorState message={sessionsError.message} onAction={() => void refetchSessions()} />
          ) : !sessionsData?.bookings || sessionsData.bookings.length === 0 ? (
            <div className="border-subtle bg-default rounded-lg border py-12 text-center">
              <Icon name="calendar" className="text-subtle mx-auto mb-3 h-10 w-10" />
              <p className="text-emphasis text-sm font-medium">{t("thotis_no_sessions_yet")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {sessionsData.bookings.map((booking) => (
                  <SessionManagementUI key={booking.id} booking={booking} isMentor />
                ))}
              </div>

              {/* Pagination */}
              {sessionsData.total > pageSize && (
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    color="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}>
                    {t("previous")}
                  </Button>
                  <span className="text-subtle text-sm">
                    {currentPage} / {Math.ceil(sessionsData.total / pageSize)}
                  </span>
                  <Button
                    color="secondary"
                    size="sm"
                    disabled={currentPage >= Math.ceil(sessionsData.total / pageSize)}
                    onClick={() => setCurrentPage((p) => p + 1)}>
                    {t("next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
