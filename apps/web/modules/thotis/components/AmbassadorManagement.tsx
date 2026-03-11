"use client";

import type { ProvisionAmbassadorInput } from "@calcom/features/thotis/services/ThotisAdminService";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField, MentorStatus } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Label, Select, TextField } from "@calcom/ui/components/form";
import { Table } from "@calcom/ui/components/table";
import { showToast } from "@calcom/ui/components/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { EditMentorProfileModal } from "./EditMentorProfileModal";
import { MentorScheduleModal } from "./MentorScheduleModal";

const ProvisionAmbassadorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLocale();
  const { register, handleSubmit, control, reset } = useForm<ProvisionAmbassadorInput>();
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
              className="bg-default border-subtle w-full rounded-md border p-2"
              rows={3}
              {...register("bio", { required: true })}
            />
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
  const { data, isPending } = trpc.thotis.admin.listIncidents.useQuery(
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
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {isPending ? (
            <p className="text-center py-4">{t("loading")}</p>
          ) : !data?.incidents || data.incidents.length === 0 ? (
            <p className="text-center text-subtle py-4">{t("thotis_admin_no_incidents_found")}</p>
          ) : (
            data.incidents.map((incident) => (
              <div key={incident.id} className="p-3 bg-subtle rounded-md border border-subtle">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emphasis">
                    {incident.type}
                  </span>
                  <span className="text-[10px] text-muted">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-default mb-2">
                  {incident.description || t("thotis_no_description")}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      incident.resolved ? "bg-success text-inverted" : "bg-attention text-attention"
                    }`}>
                    {incident.resolved ? t("thotis_admin_resolved") : t("thotis_admin_pending")}
                  </span>
                  {incident.bookingUid && (
                    <span className="text-muted text-[10px]">Booking: {incident.bookingUid}</span>
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
  status: string;
  isPending: boolean;
}> = ({ isOpen, onClose, onConfirm, status, isPending }) => {
  const { t } = useLocale();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={t("thotis_admin_confirm_status_change", { status })} />
        <p className="py-4 text-sm text-subtle">{t("thotis_admin_confirm_status_desc")}</p>
        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            loading={isPending}
            color={status === "SUSPENDED" ? "destructive" : "primary"}>
            {t("confirm")}
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
    profileId: string;
    status: MentorStatus;
  } | null>(null);

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

  const { data } = trpc.thotis.admin.listAmbassadors.useQuery({
    page,
    pageSize,
    fieldOfStudy,
    search: debouncedSearch || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

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

  const resetPasswordMutation = trpc.thotis.admin.sendPasswordReset.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_reset_link_sent"), "success");
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
    },
  });

  const handleStatusChange = (profileId: string, newStatus: MentorStatus) => {
    setStatusConfirm({ profileId, status: newStatus });
  };

  const confirmStatusChange = () => {
    if (!statusConfirm) return;
    updateStatusMutation.mutate({ profileId: statusConfirm.profileId, status: statusConfirm.status });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t("thotis_admin_ambassadors_management")}</h2>
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

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnTitle>{t("thotis_admin_ambassador")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_field_university")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_status")}</Table.ColumnTitle>
            <Table.ColumnTitle>{t("thotis_admin_actions")}</Table.ColumnTitle>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!data?.profiles || data.profiles.length === 0 ? (
            <Table.Row>
              <td colSpan={4} className="px-6 py-10 text-center text-subtle">
                {t("thotis_no_mentors_found")}
              </td>
            </Table.Row>
          ) : (
            data.profiles.map((profile) => (
              <Table.Row key={profile.id}>
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
                    value={{ label: profile.status, value: profile.status }}
                    options={Object.values(MentorStatus).map((s) => ({ label: s, value: s }))}
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
                      onClick={() => resetPasswordMutation.mutate({ userId: profile.userId })}>
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
      {totalPages > 1 && (
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
        status={statusConfirm?.status || ""}
        isPending={updateStatusMutation.isPending}
      />
    </div>
  );
};
