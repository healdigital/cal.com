"use client";

import {
  DEFAULT_SCHEDULE_CONFIG,
  type ProvisionAmbassadorInput,
} from "@calcom/features/thotis/lib/adminConfig";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField, MentorStatus } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Checkbox, Label, Select, TextField } from "@calcom/ui/components/form";
import { Table } from "@calcom/ui/components/table";
import { showToast } from "@calcom/ui/components/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getMentorIncidentTypeLabel, getMentorStatusLabel, getShortWeekdayLabel } from "../lib/displayLabels";
import { EditMentorProfileModal } from "./EditMentorProfileModal";
import { MentorScheduleModal } from "./MentorScheduleModal";
import { ThotisErrorState, ThotisLoadingState } from "./ThotisAsyncState";

function hasValidTimeRange(startTime: string, endTime: string): boolean {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  return endHours * 60 + endMinutes > startHours * 60 + startMinutes;
}

const ProvisionAmbassadorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useLocale();
  const { register, handleSubmit, control, reset } = useForm<ProvisionAmbassadorInput>();
  const [showScheduleConfig, setShowScheduleConfig] = useState(false);
  const utils = trpc.useUtils();

  const mutation = trpc.thotis.admin.createAmbassador.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_created_success"), "success");
      utils.thotis.admin.listAmbassadors.invalidate();
      reset();
      onClose();
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
    },
  });

  const onSubmit = (data: ProvisionAmbassadorInput) => {
    if (
      data.schedule?.startTime &&
      data.schedule?.endTime &&
      !hasValidTimeRange(data.schedule.startTime, data.schedule.endTime)
    ) {
      showToast(t("thotis_admin_schedule_time_range_error"), "error");
      return;
    }

    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={t("thotis_admin_provision_new_ambassador")} />
        <form className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <TextField label={t("thotis_admin_full_name")} {...register("name", { required: true })} />
          <TextField
            label={t("thotis_admin_email")}
            type="email"
            {...register("email", { required: true })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="fieldOfStudy"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>{t("thotis_admin_field")}</Label>
                  <Select
                    options={Object.values(AcademicField).map((f) => ({ label: f, value: f }))}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                </div>
              )}
            />
            <TextField
              label={t("thotis_admin_study_year")}
              type="number"
              {...register("yearOfStudy", { required: true, valueAsNumber: true })}
            />
          </div>

          <TextField label={t("thotis_admin_university")} {...register("university", { required: true })} />
          <TextField label={t("thotis_admin_degree")} {...register("degree", { required: true })} />

          <div className="space-y-1">
            <Label>{t("thotis_admin_bio")}</Label>
            <textarea
              className="w-full rounded-md border border-subtle bg-default p-2"
              rows={3}
              {...register("bio", { required: true })}
            />
          </div>

          <div className="rounded-md border border-subtle">
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 font-medium text-emphasis text-sm hover:bg-subtle"
              onClick={() => setShowScheduleConfig((prev) => !prev)}>
              {t("thotis_admin_schedule_config")}
              <span className="text-subtle text-xs">{showScheduleConfig ? "−" : "+"}</span>
            </button>

            {showScheduleConfig && (
              <div className="space-y-3 border-subtle border-t px-3 pt-2 pb-3">
                <p className="text-subtle text-xs">{t("thotis_admin_default_schedule_note")}</p>

                <div className="space-y-1">
                  <Label>{t("thotis_admin_schedule_days")}</Label>
                  <Controller
                    name="schedule.days"
                    control={control}
                    defaultValue={DEFAULT_SCHEDULE_CONFIG.days}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const selected = (field.value ?? DEFAULT_SCHEDULE_CONFIG.days).includes(dayIndex);
                          return (
                            <button
                              key={dayIndex}
                              type="button"
                              onClick={() => {
                                const current = field.value ?? DEFAULT_SCHEDULE_CONFIG.days;
                                const next = selected
                                  ? current.filter((d: number) => d !== dayIndex)
                                  : [...current, dayIndex].sort();
                                field.onChange(next);
                              }}
                              className={`rounded-md px-2.5 py-1 font-medium text-xs transition-colors ${
                                selected
                                  ? "bg-brand-default text-brand"
                                  : "bg-subtle text-subtle hover:bg-emphasis/10"
                              }`}>
                              {getShortWeekdayLabel(i18n.language, dayIndex)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label={t("start_time")}
                    type="time"
                    defaultValue={DEFAULT_SCHEDULE_CONFIG.startTime}
                    {...register("schedule.startTime")}
                  />
                  <TextField
                    label={t("end_time")}
                    type="time"
                    defaultValue={DEFAULT_SCHEDULE_CONFIG.endTime}
                    {...register("schedule.endTime")}
                  />
                </div>

                <TextField
                  label={t("thotis_admin_timezone")}
                  defaultValue={DEFAULT_SCHEDULE_CONFIG.timeZone}
                  {...register("schedule.timeZone")}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={onClose} color="secondary">
              {t("cancel")}
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {t("thotis_admin_create_account")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const IncidentsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  profileId: string | null;
  name: string | null;
}> = ({ isOpen, onClose, profileId, name }) => {
  const { t } = useLocale();
  const { data, error, isPending, refetch } = trpc.thotis.admin.listIncidents.useQuery(
    {
      studentProfileId: profileId || undefined,
      resolved: undefined, // Show all
    },
    { enabled: !!profileId && isOpen }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={`${t("thotis_admin_incidents_for")} ${name}`} />
        <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
          {isPending ? (
            <ThotisLoadingState className="py-6" />
          ) : error ? (
            <ThotisErrorState
              className="px-4 py-6"
              message={error.message}
              onAction={() => void refetch()}
              title={t("thotis_admin_error")}
            />
          ) : !data?.incidents || data.incidents.length === 0 ? (
            <p className="py-4 text-center text-subtle">{t("thotis_admin_no_incidents_found")}</p>
          ) : (
            data.incidents.map((incident) => (
              <div key={incident.id} className="rounded-md border border-subtle bg-subtle p-3">
                <div className="mb-1 flex items-start justify-between">
                  <span className="font-bold text-emphasis text-xs uppercase tracking-wider">
                    {getMentorIncidentTypeLabel(t, incident.type)}
                  </span>
                  <span className="text-[10px] text-muted">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-2 text-default text-sm">
                  {incident.description || t("thotis_no_description")}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span
                    role="status"
                    className={`rounded-full px-2 py-0.5 ${
                      incident.resolved ? "bg-success text-inverted" : "bg-attention text-attention"
                    }`}>
                    {incident.resolved ? t("thotis_admin_resolved") : t("thotis_admin_pending")}
                  </span>
                  {incident.bookingUid && (
                    <span className="text-[10px] text-muted">Booking: {incident.bookingUid}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Confirmation dialog for status changes */
const StatusConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: MentorStatus | null;
  targetCount: number;
  isPending: boolean;
}> = ({ isOpen, onClose, onConfirm, status, targetCount, isPending }) => {
  const { t } = useLocale();
  const statusLabel = status ? getMentorStatusLabel(t, status) : "";
  const isBulkAction = targetCount > 1;
  const title = isBulkAction
    ? t("thotis_admin_confirm_bulk_status_change", { count: targetCount, status: statusLabel })
    : t("thotis_admin_confirm_status_change", { status: statusLabel });
  const description = isBulkAction
    ? t("thotis_admin_confirm_bulk_status_desc", { count: targetCount })
    : t("thotis_admin_confirm_status_desc");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={title} />
        <p className="py-4 text-sm text-subtle">{description}</p>
        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            loading={isPending}
            color={status === MentorStatus.SUSPENDED ? "destructive" : "primary"}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ResetPasswordConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  identifier?: string;
  targetCount: number;
  isPending: boolean;
}> = ({ isOpen, onClose, onConfirm, identifier, targetCount, isPending }) => {
  const { t } = useLocale();
  const isBulkAction = targetCount > 1;
  const title = isBulkAction
    ? t("thotis_admin_confirm_bulk_reset_password_title")
    : t("thotis_admin_confirm_reset_password_title");
  const description = isBulkAction
    ? t("thotis_admin_confirm_bulk_reset_password_desc", { count: targetCount })
    : t("thotis_admin_confirm_reset_password_desc", { identifier });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={title} />
        <p className="py-4 text-sm text-subtle">{description}</p>
        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={onConfirm} loading={isPending}>
            {t("thotis_admin_confirm_reset_password_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AmbassadorManagement: React.FC = () => {
  const { t } = useLocale();
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [fieldOfStudy, setFieldOfStudy] = useState<AcademicField | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedAmbassador, setSelectedAmbassador] = useState<{ id: string; name: string } | null>(null);
  const [editProfile, setEditProfile] = useState<{
    id: string;
    bio: string | null;
    university: string | null;
    degree: string | null;
    field: string | null;
    expertise: string[];
    currentYear: number | null;
  } | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<{ userId: number; name: string } | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{
    profileIds: string[];
    status: MentorStatus;
  } | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<{
    identifier?: string;
    targetCount: number;
    userIds: number[];
  } | null>(null);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  // Debounce search input (300ms)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const utils = trpc.useUtils();

  const { data, error, isLoading, refetch } = trpc.thotis.admin.listAmbassadors.useQuery({
    page,
    pageSize,
    fieldOfStudy,
    search: debouncedSearch || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const visibleProfileIds = data?.profiles?.map((profile) => profile.id) ?? [];
  const selectedProfiles = data?.profiles?.filter((profile) => selectedProfileIds.includes(profile.id)) ?? [];
  const selectedUserIds = selectedProfiles.map((profile) => profile.userId);
  const allVisibleProfilesSelected =
    visibleProfileIds.length > 0 &&
    visibleProfileIds.every((profileId) => selectedProfileIds.includes(profileId));
  const someVisibleProfilesSelected =
    visibleProfileIds.length > 0 &&
    visibleProfileIds.some((profileId) => selectedProfileIds.includes(profileId));

  const updateStatusMutation = trpc.thotis.admin.updateStatus.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_status_updated_success"), "success");
      utils.thotis.admin.listAmbassadors.invalidate();
      setStatusConfirm(null);
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
      setStatusConfirm(null);
    },
  });

  const bulkUpdateStatusMutation = trpc.thotis.admin.bulkUpdateStatus.useMutation({
    onSuccess: (result) => {
      showToast(t("thotis_admin_bulk_status_updated_success", { count: result.updatedCount }), "success");
      utils.thotis.admin.listAmbassadors.invalidate();
      setSelectedProfileIds([]);
      setStatusConfirm(null);
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
      setStatusConfirm(null);
    },
  });

  const resetPasswordMutation = trpc.thotis.admin.sendPasswordReset.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_reset_link_sent"), "success");
      setResetPasswordTarget(null);
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
      setResetPasswordTarget(null);
    },
  });

  const bulkResetPasswordMutation = trpc.thotis.admin.bulkSendPasswordReset.useMutation({
    onSuccess: (result) => {
      showToast(t("thotis_admin_bulk_reset_link_sent", { count: result.sentCount }), "success");
      setSelectedProfileIds([]);
      setResetPasswordTarget(null);
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
      setResetPasswordTarget(null);
    },
  });

  const handleStatusChange = (profileId: string, newStatus: MentorStatus) => {
    setStatusConfirm({ profileIds: [profileId], status: newStatus });
  };

  const handleBulkStatusChange = (newStatus: MentorStatus) => {
    if (!selectedProfileIds.length) return;
    setStatusConfirm({ profileIds: selectedProfileIds, status: newStatus });
  };

  const confirmStatusChange = () => {
    if (!statusConfirm) return;
    if (statusConfirm.profileIds.length === 1) {
      updateStatusMutation.mutate({ profileId: statusConfirm.profileIds[0], status: statusConfirm.status });
      return;
    }

    bulkUpdateStatusMutation.mutate({
      profileIds: statusConfirm.profileIds,
      status: statusConfirm.status,
    });
  };

  const handleBulkPasswordReset = () => {
    if (!selectedUserIds.length) return;
    setResetPasswordTarget({
      targetCount: selectedUserIds.length,
      userIds: selectedUserIds,
    });
  };

  const confirmResetPassword = () => {
    if (!resetPasswordTarget) return;
    if (resetPasswordTarget.userIds.length === 1) {
      resetPasswordMutation.mutate({ userId: resetPasswordTarget.userIds[0] });
      return;
    }

    bulkResetPasswordMutation.mutate({ userIds: resetPasswordTarget.userIds });
  };

  const toggleProfileSelection = (profileId: string, checked: boolean) => {
    setSelectedProfileIds((current) => {
      if (checked) {
        return current.includes(profileId) ? current : [...current, profileId];
      }

      return current.filter((id) => id !== profileId);
    });
  };

  const toggleAllVisibleProfiles = (checked: boolean) => {
    setSelectedProfileIds((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...visibleProfileIds]));
      }

      return current.filter((id) => !visibleProfileIds.includes(id));
    });
  };

  useEffect(() => {
    setSelectedProfileIds((current) => current.filter((id) => visibleProfileIds.includes(id)));
  }, [visibleProfileIds]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-xl">{t("thotis_admin_ambassadors_management")}</h2>
          {data?.total !== undefined && (
            <p className="text-sm text-subtle">
              {t("thotis_admin_total_ambassadors", { count: data.total })}
            </p>
          )}
        </div>
        <Button color="primary" onClick={() => setIsProvisionModalOpen(true)}>
          {t("thotis_admin_add_ambassador")}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-64">
          <TextField
            placeholder={t("thotis_admin_search_placeholder")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select
            options={Object.values(AcademicField).map((f) => ({ label: f, value: f }))}
            onChange={(option) => {
              setFieldOfStudy(option?.value);
              setPage(1);
            }}
            placeholder={t("thotis_admin_filter_field")}
          />
        </div>
      </div>

      {selectedProfileIds.length > 0 && !isLoading && !error ? (
        <div className="flex items-center justify-between rounded-md border border-subtle bg-subtle px-4 py-3">
          <span className="text-default text-sm">
            {t("thotis_admin_selected_ambassadors", { count: selectedProfileIds.length })}
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="secondary" onClick={() => handleBulkStatusChange(MentorStatus.VERIFIED)}>
              {t("verify")}
            </Button>
            <Button
              size="sm"
              color="destructive"
              onClick={() => handleBulkStatusChange(MentorStatus.SUSPENDED)}>
              {t("thotis_admin_suspend_mentor")}
            </Button>
            <Button size="sm" color="secondary" onClick={handleBulkPasswordReset}>
              {t("thotis_admin_reset_password")}
            </Button>
            <Button size="sm" color="minimal" onClick={() => setSelectedProfileIds([])}>
              {t("thotis_admin_clear_selection")}
            </Button>
          </div>
        </div>
      ) : null}

      {isLoading ? <ThotisLoadingState /> : null}
      {error ? (
        <ThotisErrorState
          message={error.message}
          onAction={() => void refetch()}
          title={t("thotis_admin_error")}
        />
      ) : null}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnTitle>
              <Checkbox
                aria-label={t("select_all")}
                checked={
                  allVisibleProfilesSelected ? true : someVisibleProfilesSelected ? "indeterminate" : false
                }
                onCheckedChange={(value) => toggleAllVisibleProfiles(value === true)}
              />
            </Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_ambassador")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_field_university")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_status")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_actions")}</Table.ColumnTitle>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading || error ? null : !data?.profiles || data.profiles.length === 0 ? (
            <Table.Row>
              <td colSpan={5} className="px-6 py-10 text-center text-subtle">
                {t("thotis_no_mentors_found")}
              </td>
            </Table.Row>
          ) : (
            data.profiles.map((profile) => (
              <Table.Row key={profile.id}>
                <Table.Cell>
                  <Checkbox
                    aria-label={t("select_row")}
                    checked={selectedProfileIds.includes(profile.id)}
                    onCheckedChange={(value) => toggleProfileSelection(profile.id, value === true)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <div className="font-medium text-default">{profile.user.name}</div>
                    <div className="text-muted text-sm">{profile.user.email}</div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <div className="text-default">{profile.field}</div>
                    <div className="text-muted text-xs">{profile.university}</div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={{
                      label: getMentorStatusLabel(t, profile.status),
                      value: profile.status,
                    }}
                    options={Object.values(MentorStatus).map((status) => ({
                      label: getMentorStatusLabel(t, status),
                      value: status,
                    }))}
                    onChange={(option) => {
                      if (option && option.value !== profile.status) {
                        handleStatusChange(profile.id, option.value);
                      }
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={() =>
                        setEditProfile({
                          id: profile.id,
                          bio: profile.bio,
                          university: profile.university,
                          degree: profile.degree,
                          field: profile.field,
                          expertise: profile.expertise,
                          currentYear: profile.currentYear,
                        })
                      }>
                      {t("thotis_admin_edit_profile")}
                    </Button>
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={() =>
                        setScheduleTarget({ userId: profile.userId, name: profile.user.name || "" })
                      }>
                      {t("thotis_admin_schedule")}
                    </Button>
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={() =>
                        setResetPasswordTarget({
                          identifier: profile.user.name || profile.user.email,
                          targetCount: 1,
                          userIds: [profile.userId],
                        })
                      }>
                      {t("thotis_admin_reset_password")}
                    </Button>
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={() =>
                        setSelectedAmbassador({ id: profile.id, name: profile.user.name || "" })
                      }>
                      {t("thotis_admin_view_incidents")}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Pagination */}
      {!error && !isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            color="minimal"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {t("thotis_admin_previous")}
          </Button>
          <span className="text-sm text-subtle">
            {page} / {totalPages} ({data?.total} total)
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

      <ProvisionAmbassadorModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
      />

      <IncidentsModal
        isOpen={!!selectedAmbassador}
        onClose={() => setSelectedAmbassador(null)}
        profileId={selectedAmbassador?.id || null}
        name={selectedAmbassador?.name || null}
      />

      <EditMentorProfileModal
        isOpen={!!editProfile}
        onClose={() => setEditProfile(null)}
        profile={editProfile}
      />

      <MentorScheduleModal
        isOpen={!!scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        mentorUserId={scheduleTarget?.userId || null}
        mentorName={scheduleTarget?.name || null}
      />

      <StatusConfirmDialog
        isOpen={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={confirmStatusChange}
        status={statusConfirm?.status || null}
        targetCount={statusConfirm?.profileIds.length || 0}
        isPending={updateStatusMutation.isPending || bulkUpdateStatusMutation.isPending}
      />

      <ResetPasswordConfirmDialog
        isOpen={!!resetPasswordTarget}
        onClose={() => setResetPasswordTarget(null)}
        onConfirm={confirmResetPassword}
        identifier={resetPasswordTarget?.identifier}
        targetCount={resetPasswordTarget?.targetCount || 0}
        isPending={resetPasswordMutation.isPending || bulkResetPasswordMutation.isPending}
      />
    </div>
  );
};
