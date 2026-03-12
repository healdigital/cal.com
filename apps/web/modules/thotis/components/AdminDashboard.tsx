"use client";

import type { PlatformStats } from "@calcom/features/thotis/services/StatisticsService";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { type MentorStatus, ThotisAdminAuditAction } from "@calcom/prisma/enums";
import type { RouterOutputs } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, Select } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { Table } from "@calcom/ui/components/table";
import { showToast } from "@calcom/ui/components/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMentorIncidentTypeLabel } from "../lib/displayLabels";
import { AdminBookingList } from "./AdminBookingList";
import { AmbassadorManagement } from "./AmbassadorManagement";
import { ThotisErrorState } from "./ThotisAsyncState";

// --- Types & Interfaces ---

interface TrendPeriodData {
  date: string;
  count: number;
}

interface Trends {
  daily: TrendPeriodData[];
  weekly: TrendPeriodData[];
  monthly: TrendPeriodData[];
}

interface FunnelData {
  counts: Record<string, number>;
  conversion: Record<string, number>;
}

interface FieldDistributionEntry {
  name: string;
  value: number;
}

interface IncidentData {
  id: string;
  type: string;
  description: string | null;
  createdAt: string | Date;
  studentProfile: {
    university: string | null;
    user: {
      name: string | null;
    };
  } | null;
}

type AdminAuditLogData = RouterOutputs["thotis"]["admin"]["listAuditLogs"]["logs"][number];

const AUDIT_ACTION_LABELS: Record<ThotisAdminAuditAction, string> = {
  AMBASSADOR_PROVISIONED: "thotis_admin_audit_action_ambassador_provisioned",
  BOOKING_CANCELLED: "thotis_admin_audit_action_booking_cancelled",
  CSV_EXPORTED: "thotis_admin_audit_action_csv_exported",
  INCIDENT_RESOLVED: "thotis_admin_audit_action_incident_resolved",
  MENTOR_PROFILE_UPDATED: "thotis_admin_audit_action_mentor_profile_updated",
  MENTOR_SCHEDULE_UPDATED: "thotis_admin_audit_action_mentor_schedule_updated",
  MENTOR_STATUS_UPDATED: "thotis_admin_audit_action_mentor_status_updated",
  MODERATION_ACTION_TAKEN: "thotis_admin_audit_action_moderation_action_taken",
  PASSWORD_RESET_SENT: "thotis_admin_audit_action_password_reset_sent",
};

const AUDIT_STATUS_LABELS: Record<MentorStatus, string> = {
  DELISTED: "thotis_mentor_status_delisted",
  PENDING_VERIFICATION: "thotis_mentor_status_pending_verification",
  SUSPENDED: "thotis_mentor_status_suspended",
  VERIFIED: "thotis_mentor_status_verified",
};

function getAuditMetadataRecord(metadata: unknown): Record<string, unknown> | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  return metadata as Record<string, unknown>;
}

function formatEnumValue(value: unknown): string | null {
  if (typeof value !== "string" || !value.length) {
    return null;
  }

  return value.toLowerCase().replaceAll("_", " ");
}

function getAuditStatusLabel(translate: (key: string) => string, value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (value in AUDIT_STATUS_LABELS) {
    return translate(AUDIT_STATUS_LABELS[value as MentorStatus]);
  }

  return formatEnumValue(value);
}

function getAuditLogDetails(translate: (key: string) => string, log: AdminAuditLogData): string {
  const metadata = getAuditMetadataRecord(log.metadata);

  if (!metadata) {
    return "\u2014";
  }

  if (log.action === "AMBASSADOR_PROVISIONED") {
    return typeof metadata.email === "string" ? metadata.email : "\u2014";
  }

  if (log.action === "MENTOR_STATUS_UPDATED") {
    const previousStatus = getAuditStatusLabel(translate, metadata.previousStatus);
    const nextStatus = getAuditStatusLabel(translate, metadata.nextStatus);

    if (previousStatus && nextStatus) {
      return `${previousStatus} -> ${nextStatus}`;
    }
  }

  if (log.action === "PASSWORD_RESET_SENT") {
    return typeof metadata.email === "string" ? metadata.email : "\u2014";
  }

  if (log.action === "INCIDENT_RESOLVED") {
    return typeof metadata.incidentType === "string"
      ? getMentorIncidentTypeLabel(translate, metadata.incidentType)
      : "\u2014";
  }

  if (log.action === "MODERATION_ACTION_TAKEN") {
    const actionType = formatEnumValue(metadata.actionType);
    const reason = typeof metadata.reason === "string" ? metadata.reason : null;

    return [actionType, reason].filter(Boolean).join(" · ") || "\u2014";
  }

  if (log.action === "BOOKING_CANCELLED") {
    return typeof metadata.reason === "string" ? metadata.reason : "\u2014";
  }

  if (log.action === "MENTOR_PROFILE_UPDATED") {
    if (Array.isArray(metadata.changedFields)) {
      const changedFields = metadata.changedFields.filter(
        (value): value is string => typeof value === "string"
      );
      return changedFields.join(", ") || "\u2014";
    }
  }

  if (log.action === "MENTOR_SCHEDULE_UPDATED") {
    const slotCount =
      typeof metadata.slotCount === "number"
        ? `${metadata.slotCount} ${translate("thotis_admin_audit_slots_label")}`
        : null;
    const timeZone = typeof metadata.timeZone === "string" ? metadata.timeZone : null;

    return [slotCount, timeZone].filter(Boolean).join(" · ") || "\u2014";
  }

  if (log.action === "CSV_EXPORTED") {
    return typeof metadata.mentorCount === "number"
      ? `${metadata.mentorCount} ${translate("thotis_admin_audit_mentors_label")}`
      : "\u2014";
  }

  return "\u2014";
}

const AdminDashboardSkeleton = () => {
  return (
    <div className="space-y-6 p-6" aria-live="polite">
      <div className="flex items-center justify-between">
        <SkeletonText className="h-8 w-56" />
        <div className="flex gap-2">
          <SkeletonText className="h-9 w-28 rounded-md" />
          <SkeletonText className="h-9 w-40 rounded-md" />
          <SkeletonText className="h-9 w-28 rounded-md" />
          <SkeletonText className="ml-4 h-9 w-28 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-md border border-subtle bg-default p-4">
            <SkeletonText className="h-4 w-24" />
            <SkeletonText className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-md border border-subtle bg-default p-4">
            <SkeletonText className="mb-4 h-6 w-40" />
            <SkeletonText className="h-64 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="rounded-md border border-subtle bg-default p-4">
        <SkeletonText className="mb-4 h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="grid grid-cols-6 gap-3">
              {Array.from({ length: 6 }, (_, cellIndex) => (
                <SkeletonText key={cellIndex} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatsOverview = ({ stats }: { stats: PlatformStats | undefined }) => {
  const { t } = useLocale();

  const completionRate = stats?._sum?.totalSessions
    ? Math.round(((stats._sum.completedSessions || 0) / stats._sum.totalSessions) * 100)
    : 0;

  const cards = [
    {
      label: t("thotis_total_mentors"),
      value: stats?._count?.id || 0,
    },
    {
      label: t("thotis_total_sessions"),
      value: stats?._sum?.totalSessions || 0,
    },
    {
      label: t("thotis_completion_rate"),
      value: `${completionRate}%`,
    },
    {
      label: t("thotis_avg_platform_rating"),
      value: stats?._avg?.averageRating?.toFixed(1) || "N/A",
    },
  ];

  return (
    <div className="space-y-4">
      {(stats?.dataQuality?.issues?.length ?? 0) > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-attention bg-attention p-3 text-attention text-sm">
          <span>⚠️</span>
          <div>
            <strong>{t("thotis_data_quality_warning")}:</strong>
            <ul className="ml-5 list-disc">
              {stats?.dataQuality?.issues?.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-md border border-subtle bg-default p-4">
            <p className="font-medium text-sm text-subtle">{card.label}</p>
            <p className="mt-2 font-bold text-2xl text-emphasis">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SessionTrendsChart = ({ trends }: { trends: Trends | undefined }) => {
  const { t } = useLocale();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const rawData = trends?.[period] || [];
  const data = rawData.map((d: TrendPeriodData) => ({
    date:
      period === "daily"
        ? new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : d.date,
    count: d.count,
  }));

  return (
    <div className="rounded-md border border-subtle bg-default p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-emphasis text-lg">{t(`thotis_session_trends_${period}`)}</h3>
        <div className="flex gap-1 rounded-md bg-subtle p-1">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              color={period === p ? "primary" : "minimal"}
              onClick={() => setPeriod(p)}
              className="px-2 py-1 text-xs">
              {t(`thotis_period_${p}`)}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#292929"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const FunnelChart = ({ funnel }: { funnel: FunnelData | undefined }) => {
  const { t } = useLocale();
  const data = [
    { name: t("thotis_funnel_viewed"), count: funnel?.counts?.profile_viewed || 0 },
    { name: t("thotis_funnel_started"), count: funnel?.counts?.booking_started || 0 },
    { name: t("thotis_funnel_confirmed"), count: funnel?.counts?.booking_confirmed || 0 },
    { name: t("thotis_funnel_completed"), count: funnel?.counts?.session_completed || 0 },
  ];

  return (
    <div className="rounded-md border border-subtle bg-default p-4">
      <h3 className="mb-4 font-semibold text-emphasis text-lg">{t("thotis_conversion_funnel")}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#292929" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-subtle p-2">
          <p className="font-medium text-default">{t("thotis_conv_started")}</p>
          <p className="font-bold text-emphasis">
            {funnel?.conversion?.profile_to_booking_started?.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-md bg-subtle p-2">
          <p className="font-medium text-default">{t("thotis_conv_confirmed")}</p>
          <p className="font-bold text-emphasis">
            {funnel?.conversion?.booking_started_to_confirmed?.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

const FieldDistributionChart = ({ distribution }: { distribution: PlatformStats | undefined }) => {
  const { t } = useLocale();
  const data: FieldDistributionEntry[] =
    distribution?.fieldDistribution?.map((d: { field: string; _count: { id: number } }) => ({
      name: d.field,
      value: d._count.id,
    })) || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  return (
    <div className="rounded-md border border-subtle bg-default p-4">
      <h3 className="mb-4 font-semibold text-emphasis text-lg">{t("thotis_field_distribution")}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value">
              {data.map((_entry: FieldDistributionEntry, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/** Profile shape used by the MentorList table */
interface MentorListProfile {
  id: string;
  university: string | null;
  field: string | null;
  totalSessions: number | null;
  completedSessions: number | null;
  averageRating: unknown; // Prisma Decimal, coerced via Number()
  user: {
    name: string | null;
  };
}

const MentorList = ({ profiles }: { profiles: MentorListProfile[] }) => {
  const { t } = useLocale();
  const columns = [
    { Header: t("thotis_admin_col_mentor"), accessor: "mentorName" },
    { Header: t("thotis_header_university"), accessor: "university" },
    { Header: t("thotis_header_field"), accessor: "field" },
    { Header: t("thotis_header_sessions"), accessor: "totalSessions" },
    { Header: t("thotis_header_rating"), accessor: "averageRating" },
    {
      Header: t("thotis_header_completion"),
      accessor: (row: MentorListProfile) => {
        const total = row.totalSessions || 0;
        const completed = row.completedSessions || 0;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return `${rate}%`;
      },
    },
  ];

  return (
    <div className="rounded-md border border-subtle bg-default p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-emphasis text-lg">{t("thotis_mentor_performance")}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              {columns.map((col, idx) => (
                <Table.ColumnTitle key={idx}>{col.Header}</Table.ColumnTitle>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {profiles.map((profile: MentorListProfile) => (
              <Table.Row key={profile.id}>
                <Table.Cell>{profile.user.name || "\u2014"}</Table.Cell>
                <Table.Cell>{profile.university}</Table.Cell>
                <Table.Cell>{profile.field}</Table.Cell>
                <Table.Cell>{profile.totalSessions}</Table.Cell>
                <Table.Cell>{Number(profile.averageRating)?.toFixed(1) || "-"}</Table.Cell>
                <Table.Cell>
                  {(profile.totalSessions || 0) > 0
                    ? Math.round(((profile.completedSessions || 0) / (profile.totalSessions || 1)) * 100) +
                      "%"
                    : "0%"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

const RecentIncidents = () => {
  const { t } = useLocale();
  const router = useRouter();
  const {
    data: incidentsData,
    error,
    isPending,
    refetch,
  } = trpc.thotis.admin.listIncidents.useQuery({
    page: 1,
    pageSize: 5,
    resolved: false,
  });

  if (isPending) {
    return (
      <div className="h-full rounded-md border border-subtle bg-default p-4" aria-live="polite">
        <SkeletonText className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-md border border-subtle bg-subtle p-3">
              <div className="mb-2 flex items-start justify-between">
                <SkeletonText className="h-4 w-24" />
                <SkeletonText className="h-3 w-16" />
              </div>
              <SkeletonText className="mb-2 h-3 w-full" />
              <SkeletonText className="mb-3 h-3 w-5/6" />
              <div className="flex justify-between">
                <SkeletonText className="h-3 w-20" />
                <SkeletonText className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ThotisErrorState
        className="h-full"
        message={error.message}
        onAction={() => void refetch()}
        title={t("thotis_admin_error")}
      />
    );
  }

  const incidents = incidentsData?.incidents || [];

  return (
    <div className="h-full rounded-md border border-subtle bg-default p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-emphasis text-lg">{t("thotis_recent_incidents")}</h3>
        <Button size="sm" color="minimal" href="/thotis/admin/incidents" className="text-xs">
          {t("thotis_view_all")}
        </Button>
      </div>
      <div className="space-y-3">
        {incidents.length === 0 ? (
          <p className="py-8 text-center text-sm text-subtle">{t("thotis_no_recent_incidents")}</p>
        ) : (
          incidents.map((incident: IncidentData) => (
            <button
              key={incident.id}
              type="button"
              onClick={() => router.push("/thotis/admin/incidents")}
              className="w-full cursor-pointer rounded-md border border-subtle bg-subtle p-3 text-left transition-colors hover:border-emphasis">
              <div className="mb-1 flex items-start justify-between">
                <span className="font-bold text-emphasis text-xs uppercase tracking-wider">
                  {getMentorIncidentTypeLabel(t, incident.type)}
                </span>
                <span className="text-[10px] text-muted">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mb-2 line-clamp-2 text-default text-xs italic">
                &ldquo;{incident.description || t("thotis_no_description")}&rdquo;
              </p>
              <div className="flex justify-between text-[10px] text-muted">
                <span>{incident.studentProfile?.university}</span>
                <span className="font-medium text-emphasis">{incident.studentProfile?.user?.name}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const AdminAuditLog = () => {
  const { t } = useLocale();
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<ThotisAdminAuditAction | "">("");
  const pageSize = 20;
  const { data, error, isPending } = trpc.thotis.admin.listAuditLogs.useQuery({
    action: action || undefined,
    page,
    pageSize,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const actionOptions = [
    { label: t("thotis_admin_audit_action_all"), value: "" },
    ...Object.values(ThotisAdminAuditAction).map((value) => ({
      label: t(AUDIT_ACTION_LABELS[value]),
      value,
    })),
  ];

  if (error) {
    return <ThotisErrorState message={error.message} title={t("thotis_admin_audit_log_title")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-semibold text-emphasis text-xl">{t("thotis_admin_audit_log_title")}</h2>
          <p className="text-sm text-subtle">{t("thotis_admin_audit_log_description")}</p>
        </div>
        <div className="w-full max-w-xs">
          <Label>{t("thotis_admin_audit_filter_action")}</Label>
          <Select
            options={actionOptions}
            value={actionOptions.find((option) => option.value === action)}
            onChange={(option) => {
              setAction((option?.value as ThotisAdminAuditAction | "") || "");
              setPage(1);
            }}
          />
        </div>
      </div>

      {isPending ? (
        <div className="flex justify-center py-10" aria-live="polite">
          <div className="h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2" />
        </div>
      ) : (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.ColumnTitle>{t("thotis_admin_audit_col_time")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_audit_col_admin")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_audit_col_action")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_audit_col_resource")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_audit_col_details")}</Table.ColumnTitle>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!data?.logs.length ? (
                <Table.Row>
                  <td colSpan={5} className="px-6 py-10 text-center text-subtle">
                    {t("thotis_admin_audit_empty")}
                  </td>
                </Table.Row>
              ) : (
                data.logs.map((log) => (
                  <Table.Row key={log.id}>
                    <Table.Cell>{new Date(log.createdAt).toLocaleString()}</Table.Cell>
                    <Table.Cell>{log.adminUserName || log.adminUserEmail || log.adminUserId}</Table.Cell>
                    <Table.Cell>{t(AUDIT_ACTION_LABELS[log.action])}</Table.Cell>
                    <Table.Cell>{log.resourceDisplayName || log.resourceId}</Table.Cell>
                    <Table.Cell>{getAuditLogDetails(t, log)}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                color="minimal"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}>
                {t("thotis_admin_previous")}
              </Button>
              <span className="text-sm text-subtle">
                {page} / {totalPages} ({t("total")}: {data?.total})
              </span>
              <Button
                color="minimal"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}>
                {t("thotis_admin_next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --- Main Component ---

export const AdminDashboard = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"insights" | "ambassadors" | "audit" | "bookings">("insights");
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const {
    data: stats,
    error: statsError,
    isPending: isPendingStats,
    refetch: refetchStats,
  } = trpc.thotis.statistics.platformStats.useQuery();
  const {
    data: searchData,
    error: profilesError,
    isPending: isPendingProfiles,
    refetch: refetchProfiles,
  } = trpc.thotis.profile.search.useQuery({
    page: 1,
    pageSize: 50,
  });

  const handleExportCSV = async () => {
    if (isExportingCsv) return;

    setIsExportingCsv(true);

    try {
      const response = await fetch("/api/thotis/admin/export");

      if (!response.ok) {
        let message = t("thotis_admin_export_failed");

        try {
          const errorBody = (await response.json()) as { error?: string };
          if (typeof errorBody.error === "string" && errorBody.error.length > 0) {
            message = errorBody.error;
          }
        } catch {
          // Ignore invalid error payloads and fall back to the translated message.
        }

        throw new Error(message);
      }

      const csvBlob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "thotis_platform_stats.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("thotis_admin_export_failed");
      showToast(`${t("thotis_admin_error")}: ${message}`, "error");
    } finally {
      setIsExportingCsv(false);
    }
  };

  if (isPendingStats || isPendingProfiles) {
    return <AdminDashboardSkeleton />;
  }

  if (statsError || profilesError) {
    return (
      <ThotisErrorState
        message={statsError?.message ?? profilesError?.message}
        onAction={() => {
          void refetchStats();
          void refetchProfiles();
        }}
        title={t("thotis_admin_error")}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-emphasis">{t("thotis_admin_dashboard")}</h1>
        <div className="flex gap-2">
          <Button
            color={activeTab === "insights" ? "primary" : "minimal"}
            onClick={() => setActiveTab("insights")}>
            {t("thotis_tab_insights")}
          </Button>
          <Button
            color={activeTab === "ambassadors" ? "primary" : "minimal"}
            onClick={() => setActiveTab("ambassadors")}>
            {t("thotis_tab_ambassadors")}
          </Button>
          <Button
            color={activeTab === "bookings" ? "primary" : "minimal"}
            onClick={() => setActiveTab("bookings")}>
            {t("thotis_tab_bookings")}
          </Button>
          <Button color={activeTab === "audit" ? "primary" : "minimal"} onClick={() => setActiveTab("audit")}>
            {t("thotis_tab_audit")}
          </Button>
          {/* CSV export only visible on insights tab */}
          {activeTab === "insights" && (
            <div className="ml-4 border-l pl-4">
              <Button color="secondary" onClick={handleExportCSV} loading={isExportingCsv}>
                {t("thotis_export_csv")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "insights" && (
        <>
          <StatsOverview stats={stats} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SessionTrendsChart trends={stats?.trends} />
            <RecentIncidents />
            <FunnelChart funnel={stats?.funnel} />
            <FieldDistributionChart distribution={stats} />
          </div>

          <MentorList profiles={searchData?.profiles || []} />
        </>
      )}
      {activeTab === "ambassadors" && <AmbassadorManagement />}
      {activeTab === "bookings" && <AdminBookingList />}
      {activeTab === "audit" && <AdminAuditLog />}
    </div>
  );
};
