"use client";

import { DEFAULT_SCHEDULE_CONFIG } from "@calcom/features/thotis/services/ThotisAdminService";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { IntlSupportedTimeZones } from "@calcom/lib/timeZones";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Label, Select, TextField } from "@calcom/ui/components/form";
import { SkeletonText } from "@calcom/ui/components/skeleton";
import { showToast } from "@calcom/ui/components/toast";
import { useEffect, useState } from "react";
import { getShortWeekdayLabel } from "../lib/displayLabels";

interface AvailabilitySlot {
  days: number[];
  startTime: string;
  endTime: string;
}

interface MentorScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorUserId: number | null;
  mentorName: string | null;
}

type TimeZoneOption = {
  label: string;
  value: string;
};

const TIME_ZONE_OPTIONS: TimeZoneOption[] = IntlSupportedTimeZones.map((timeZone) => ({
  label: timeZone.replaceAll("_", " "),
  value: timeZone,
}));

function ScheduleModalSkeleton() {
  return (
    <div className="space-y-4 py-4" aria-live="polite">
      <SkeletonText className="h-4 w-40" />
      <SkeletonText className="h-10 w-full rounded-md" />
      <div className="rounded-md border border-subtle p-3">
        <div className="mb-3 flex items-center justify-between">
          <SkeletonText className="h-4 w-20" />
          <SkeletonText className="h-8 w-16 rounded-md" />
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {Array.from({ length: 7 }, (_, dayIndex) => (
            <SkeletonText key={dayIndex} className="h-7 w-10 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonText className="h-10 w-full rounded-md" />
          <SkeletonText className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

function hasValidTimeRange(startTime: string, endTime: string): boolean {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  return endHours * 60 + endMinutes > startHours * 60 + startMinutes;
}

function formatTime(dateVal: Date | string): string {
  const d = new Date(dateVal);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function MentorScheduleModal({ isOpen, onClose, mentorUserId, mentorName }: MentorScheduleModalProps) {
  const { i18n, t } = useLocale();
  const utils = trpc.useUtils();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [timeZone, setTimeZone] = useState(DEFAULT_SCHEDULE_CONFIG.timeZone);

  const { data: schedule, isLoading } = trpc.thotis.admin.getMentorSchedule.useQuery(
    { mentorUserId: mentorUserId! },
    { enabled: !!mentorUserId && isOpen }
  );

  useEffect(() => {
    if (!schedule) return;

    setTimeZone(schedule.timeZone || DEFAULT_SCHEDULE_CONFIG.timeZone);

    if (schedule.availability && schedule.availability.length > 0) {
      setSlots(
        schedule.availability.map((a) => ({
          days: a.days,
          startTime: formatTime(a.startTime),
          endTime: formatTime(a.endTime),
        }))
      );
      return;
    }

    setSlots([
      {
        days: DEFAULT_SCHEDULE_CONFIG.days,
        startTime: DEFAULT_SCHEDULE_CONFIG.startTime,
        endTime: DEFAULT_SCHEDULE_CONFIG.endTime,
      },
    ]);
  }, [schedule]);

  const updateMutation = trpc.thotis.admin.updateMentorSchedule.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_schedule_updated"), "success");
      utils.thotis.admin.getMentorSchedule.invalidate();
      onClose();
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
    },
  });

  const handleSave = () => {
    if (!mentorUserId) return;
    const validSlots = slots.filter((s) => s.days.length > 0 && s.startTime && s.endTime);

    if (validSlots.some((slot) => !hasValidTimeRange(slot.startTime, slot.endTime))) {
      showToast(t("thotis_admin_schedule_time_range_error"), "error");
      return;
    }

    updateMutation.mutate({
      mentorUserId,
      availability: validSlots,
      timeZone,
    });
  };

  const toggleDay = (slotIndex: number, day: number) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== slotIndex) return slot;
        const days = slot.days.includes(day)
          ? slot.days.filter((d) => d !== day)
          : [...slot.days, day].sort();
        return { ...slot, days };
      })
    );
  };

  const updateSlotTime = (slotIndex: number, field: "startTime" | "endTime", value: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === slotIndex ? { ...slot, [field]: value } : slot)));
  };

  const addSlot = () => {
    setSlots((prev) => [
      ...prev,
      {
        days: DEFAULT_SCHEDULE_CONFIG.days,
        startTime: DEFAULT_SCHEDULE_CONFIG.startTime,
        endTime: DEFAULT_SCHEDULE_CONFIG.endTime,
      },
    ]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={`${t("thotis_admin_schedule_title")} \u2014 ${mentorName || ""}`} />

        {isLoading ? (
          <ScheduleModalSkeleton />
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto py-4">
            <div className="space-y-1">
              <Label>{t("thotis_admin_timezone")}</Label>
              <Select<TimeZoneOption>
                isSearchable
                options={TIME_ZONE_OPTIONS}
                value={TIME_ZONE_OPTIONS.find((option) => option.value === timeZone) ?? null}
                onChange={(option) => setTimeZone(option?.value || DEFAULT_SCHEDULE_CONFIG.timeZone)}
              />
            </div>

            {slots.map((slot, index) => (
              <div key={index} className="space-y-3 rounded-md border border-subtle p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-xs uppercase">
                    {t("thotis_admin_slot_number", { number: index + 1 })}
                  </span>
                  {slots.length > 1 && (
                    <Button size="sm" color="destructive" onClick={() => removeSlot(index)}>
                      {t("thotis_admin_remove_slot")}
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => (
                    <button
                      key={dayIndex}
                      type="button"
                      aria-pressed={slot.days.includes(dayIndex)}
                      aria-label={getShortWeekdayLabel(i18n.language, dayIndex)}
                      onClick={() => toggleDay(index, dayIndex)}
                      className={`rounded-md px-2.5 py-1 font-medium text-xs transition-colors ${
                        slot.days.includes(dayIndex)
                          ? "bg-brand-default text-brand"
                          : "bg-subtle text-subtle hover:bg-emphasis/10"
                      }`}>
                      {getShortWeekdayLabel(i18n.language, dayIndex)}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label={t("start_time")}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlotTime(index, "startTime", e.target.value)}
                  />
                  <TextField
                    label={t("end_time")}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlotTime(index, "endTime", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button color="secondary" size="sm" className="w-full" onClick={addSlot}>
              + {t("thotis_admin_add_slot")}
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} loading={updateMutation.isPending}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
