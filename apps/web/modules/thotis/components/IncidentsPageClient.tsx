"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { MentorIncidentType } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Label, Select } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import { Table } from "@calcom/ui/components/table";
import { showToast } from "@calcom/ui/components/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMentorIncidentTypeLabel } from "../lib/displayLabels";

interface Incident {
  id: string;
  type: string;
  description?: string | null;
  resolved: boolean;
  createdAt: string | Date;
  studentProfileId: string;
}

const RESOLVED_OPTIONS = [
  { label: "thotis_admin_status_all", value: "" },
  { label: "thotis_admin_resolved_only", value: "true" },
  { label: "thotis_admin_unresolved_only", value: "false" },
];

const INCIDENT_TYPE_OPTIONS = [
  "NO_SHOW",
  "LATE_ARRIVAL",
  "INAPPROPRIATE_BEHAVIOR",
  "POOR_QUALITY",
  "OTHER",
] as const satisfies readonly MentorIncidentType[];

/** Custom confirmation dialog for suspension (replaces window.confirm) */
function SuspendConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const { t } = useLocale();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={t("thotis_admin_confirm_suspend_title")} />
        <p className="py-4 text-sm text-subtle">{t("thotis_admin_confirm_suspend_desc")}</p>
        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={onConfirm} loading={isPending} color="destructive">
            {t("thotis_admin_suspend_confirm_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function IncidentsPageClient() {
  const { t } = useLocale();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filters
  const [typeFilter, setTypeFilter] = useState<MentorIncidentType | "">("");
  const [resolvedFilter, setResolvedFilter] = useState<string>("");

  // Suspension confirm state
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);

  const {
    data: incidentsData,
    isLoading,
    error,
    refetch,
  } = trpc.thotis.admin.listIncidents.useQuery({
    page,
    pageSize,
    type: typeFilter || undefined,
    resolved: resolvedFilter === "" ? undefined : resolvedFilter === "true",
  });

  const moderationMutation = trpc.thotis.admin.takeModerationAction.useMutation({
    onSuccess: () => {
      showToast(t("thotis_moderation_action_success"), "success");
      setSuspendTarget(null);
      refetch();
    },
    onError: (err) => {
      showToast(err.message, "error");
      setSuspendTarget(null);
    },
  });

  const resolveMutation = trpc.thotis.admin.resolveIncident.useMutation({
    onSuccess: () => {
      showToast(t("thotis_incident_resolved_success"), "success");
      refetch();
    },
    onError: (err) => {
      showToast(err.message, "error");
    },
  });

  const handleSuspendConfirm = () => {
    if (!suspendTarget) return;
    moderationMutation.mutate({
      studentProfileId: suspendTarget,
      actionType: "SUSPENSION",
      updateStatusTo: "SUSPENDED",
      reason: t("thotis_admin_suspension_reason_incident"),
    });
  };

  // Extract unique incident types for the filter dropdown
  const typeOptions: { label: string; value: MentorIncidentType | "" }[] = [
    { label: t("thotis_admin_all_types"), value: "" },
    ...INCIDENT_TYPE_OPTIONS.map((type) => ({
      label: getMentorIncidentTypeLabel(t, type),
      value: type,
    })),
  ];

  const totalPages = incidentsData ? Math.ceil((incidentsData.total || 0) / pageSize) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-live="polite">
        <div className="h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 font-bold text-2xl text-emphasis">{t("error")}</h1>
        <p className="mb-6 text-subtle">{error.message}</p>
        <Button onClick={() => router.back()}>{t("back")}</Button>
      </div>
    );
  }

  const incidents = incidentsData?.incidents || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/thotis/admin")}
            className="mb-2 flex items-center text-sm text-subtle hover:text-emphasis">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("back")}
          </button>
          <h1 className="font-bold text-2xl text-emphasis">{t("thotis_all_incidents")}</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="w-48">
          <Label>{t("thotis_admin_filter_type")}</Label>
          <Select
            options={typeOptions}
            value={typeOptions.find((o) => o.value === typeFilter)}
            onChange={(opt) => {
              setTypeFilter((opt?.value || "") as MentorIncidentType | "");
              setPage(1);
            }}
          />
        </div>
        <div className="w-48">
          <Label>{t("thotis_admin_filter_resolved")}</Label>
          <Select
            options={RESOLVED_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
            value={RESOLVED_OPTIONS.map((o) => ({ ...o, label: t(o.label) })).find(
              (o) => o.value === resolvedFilter
            )}
            onChange={(opt) => {
              setResolvedFilter(opt?.value ?? "");
              setPage(1);
            }}
          />
        </div>
        {(typeFilter || resolvedFilter) && (
          <Button
            color="minimal"
            size="sm"
            onClick={() => {
              setTypeFilter("");
              setResolvedFilter("");
              setPage(1);
            }}>
            {t("clear_filters")}
          </Button>
        )}
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnTitle>{t("type")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("description")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("status")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("date")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("actions")}</Table.ColumnTitle>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {incidents.length === 0 ? (
            <Table.Row>
              <td colSpan={5} className="px-6 py-10 text-center">
                <p className="font-medium text-emphasis">{t("thotis_admin_no_incidents_empty")}</p>
                <p className="mt-1 text-sm text-subtle">{t("thotis_admin_no_incidents_empty_desc")}</p>
              </td>
            </Table.Row>
          ) : (
            incidents.map((incident: Incident) => (
              <Table.Row key={incident.id}>
                <Table.Cell>
                  <span className="font-medium text-emphasis">
                    {getMentorIncidentTypeLabel(t, incident.type)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="max-w-md truncate text-subtle" title={incident.description ?? undefined}>
                    {incident.description}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span
                    role="status"
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                      incident.resolved ? "bg-success text-inverted" : "bg-error text-inverted"
                    }`}>
                    {incident.resolved ? t("resolved") : t("unresolved")}
                  </span>
                </Table.Cell>
                <Table.Cell>{new Date(incident.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-2">
                    {!incident.resolved && (
                      <Button
                        size="sm"
                        color="secondary"
                        aria-label={t("thotis_admin_resolve_incident")}
                        loading={
                          resolveMutation.isPending && resolveMutation.variables?.incidentId === incident.id
                        }
                        onClick={() => resolveMutation.mutate({ incidentId: incident.id })}>
                        {t("thotis_admin_resolve_incident")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="secondary"
                      aria-label={t("thotis_admin_warn_mentor")}
                      loading={
                        moderationMutation.isPending &&
                        moderationMutation.variables?.studentProfileId === incident.studentProfileId &&
                        moderationMutation.variables?.actionType === "WARNING"
                      }
                      onClick={() =>
                        moderationMutation.mutate({
                          studentProfileId: incident.studentProfileId,
                          actionType: "WARNING",
                          reason: t("thotis_admin_moderation_reason_incident"),
                        })
                      }>
                      {t("thotis_admin_warn_mentor")}
                    </Button>
                    <Button
                      size="sm"
                      color="destructive"
                      aria-label={t("thotis_admin_suspend_mentor")}
                      onClick={() => setSuspendTarget(incident.studentProfileId)}>
                      {t("thotis_admin_suspend_mentor")}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            color="minimal"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {t("thotis_admin_previous")}
          </Button>
          <span className="text-sm text-subtle">
            {page} / {totalPages} ({incidentsData?.total || 0} total)
          </span>
          <Button
            color="minimal"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}>
            {t("thotis_admin_next")}
          </Button>
        </div>
      )}

      {/* Suspension confirmation dialog */}
      <SuspendConfirmDialog
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        isPending={moderationMutation.isPending}
      />
    </div>
  );
}
