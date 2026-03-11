"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { TextField } from "@calcom/ui/components/form";
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

function formatTime(dateVal: Date | string): string {
  const d = new Date(dateVal);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function MentorScheduleModal({ isOpen, onClose, mentorUserId, mentorName }: MentorScheduleModalProps) {
  const { i18n, t } = useLocale();
  const utils = trpc.useUtils();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const { data: schedule, isLoading } = trpc.thotis.admin.getMentorSchedule.useQuery(
    { mentorUserId: mentorUserId! },
    { enabled: !!mentorUserId && isOpen }
  );

  useEffect(() => {
    if (schedule?.availability && schedule.availability.length > 0) {
      setSlots(
        schedule.availability.map((a) => ({
          days: a.days,
          startTime: formatTime(a.startTime),
          endTime: formatTime(a.endTime),
        }))
      );
    } else if (schedule && !schedule.hasSchedule) {
      setSlots([{ days: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "17:00" }]);
    }
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
    updateMutation.mutate({
      mentorUserId,
      availability: validSlots,
      timeZone: schedule?.timeZone || undefined,
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
    setSlots((prev) => [...prev, { days: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "17:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={`${t("thotis_admin_schedule_title")} \u2014 ${mentorName || ""}`} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2" />
          </div>
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto py-4">
            {schedule?.timeZone && (
              <p className="text-subtle text-xs">
                {t("thotis_admin_timezone")}: <span className="font-medium">{schedule.timeZone}</span>
              </p>
            )}

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
