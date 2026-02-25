"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";

interface BookingDetailSheetProps {
  bookingId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailSheet({ bookingId, isOpen, onClose }: BookingDetailSheetProps) {
  const { t } = useLocale();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const utils = trpc.useUtils();

  const { data: booking, isLoading } = trpc.thotis.admin.getBookingDetails.useQuery(
    { bookingId: bookingId! },
    { enabled: !!bookingId && isOpen }
  );

  const cancelMutation = trpc.thotis.admin.cancelBooking.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_booking_cancelled"), "success");
      utils.thotis.admin.listBookings.invalidate();
      utils.thotis.admin.getBookingDetails.invalidate();
      setShowCancelConfirm(false);
      setCancelReason("");
      onClose();
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
    },
  });

  const handleCancel = () => {
    if (!bookingId || !cancelReason.trim()) return;
    cancelMutation.mutate({ bookingId, reason: cancelReason });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={t("thotis_admin_booking_details")} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-t-2 border-b-2" />
          </div>
        ) : !booking ? (
          <p className="py-4 text-center text-subtle">{t("thotis_admin_no_bookings")}</p>
        ) : (
          <div className="max-h-[70vh] space-y-6 overflow-y-auto py-4">
            {/* Booking info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-emphasis text-sm">{booking.title}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-subtle">{t("date")}:</span>{" "}
                  <span className="text-default">{new Date(booking.startTime).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-subtle">{t("time")}:</span>{" "}
                  <span className="text-default">
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div>
                  <span className="text-subtle">{t("status")}:</span>{" "}
                  <span
                    className={`font-medium ${booking.status === "CANCELLED" ? "text-red-600" : "text-green-600"}`}>
                    {booking.status}
                  </span>
                </div>
                {booking.location && (
                  <div>
                    <span className="text-subtle">{t("location")}:</span>{" "}
                    <span className="text-default">{booking.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mentor info */}
            <div className="rounded-md border border-subtle p-3">
              <h4 className="mb-1 font-semibold text-subtle text-xs uppercase">
                {t("thotis_admin_col_mentor")}
              </h4>
              <p className="font-medium text-default">{booking.user?.name || "\u2014"}</p>
              <p className="text-muted text-sm">{booking.user?.email || ""}</p>
            </div>

            {/* Student info */}
            {booking.attendees && booking.attendees.length > 0 && (
              <div className="rounded-md border border-subtle p-3">
                <h4 className="mb-1 font-semibold text-subtle text-xs uppercase">
                  {t("thotis_admin_col_student")}
                </h4>
                {booking.attendees.map((att) => (
                  <div key={att.id}>
                    <p className="font-medium text-default">{att.name || "\u2014"}</p>
                    <p className="text-muted text-sm">{att.email}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Session Summary */}
            {booking.thotisSessionSummary && (
              <div className="rounded-md border border-subtle p-3">
                <h4 className="mb-1 font-semibold text-subtle text-xs uppercase">
                  {t("thotis_admin_session_summary")}
                </h4>
                <p className="whitespace-pre-wrap text-default text-sm">
                  {booking.thotisSessionSummary.content}
                </p>
                {booking.thotisSessionSummary.nextSteps && (
                  <p className="mt-2 text-muted text-sm">
                    <strong>{t("next_steps")}:</strong> {booking.thotisSessionSummary.nextSteps}
                  </p>
                )}
              </div>
            )}

            {/* Rating */}
            {booking.sessionRating && (
              <div className="rounded-md border border-subtle p-3">
                <h4 className="mb-1 font-semibold text-subtle text-xs uppercase">
                  {t("thotis_admin_session_rating")}
                </h4>
                <p className="text-default">
                  {"\u2605".repeat(booking.sessionRating.rating)}
                  {"\u2606".repeat(5 - booking.sessionRating.rating)} ({booking.sessionRating.rating}/5)
                </p>
                {booking.sessionRating.feedback && (
                  <p className="mt-1 text-muted text-sm">{booking.sessionRating.feedback}</p>
                )}
              </div>
            )}

            {/* Incidents */}
            {booking.mentorQualityIncidents && booking.mentorQualityIncidents.length > 0 && (
              <div className="rounded-md border border-subtle p-3">
                <h4 className="mb-1 font-semibold text-subtle text-xs uppercase">
                  {t("thotis_admin_session_incidents")}
                </h4>
                {booking.mentorQualityIncidents.map((inc) => (
                  <div key={inc.id} className="flex items-center justify-between py-1">
                    <span className="text-default text-sm">{inc.type}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        inc.resolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                      {inc.resolved ? t("resolved") : t("unresolved")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Cancellation reason */}
            {booking.cancellationReason && (
              <div className="rounded-md border border-subtle bg-red-50 p-3">
                <h4 className="mb-1 font-semibold text-red-600 text-xs uppercase">
                  {t("thotis_admin_cancel_reason")}
                </h4>
                <p className="text-red-700 text-sm">{booking.cancellationReason}</p>
              </div>
            )}

            {/* Cancel action */}
            {booking.status !== "CANCELLED" && !showCancelConfirm && (
              <Button color="destructive" className="w-full" onClick={() => setShowCancelConfirm(true)}>
                {t("thotis_admin_cancel_booking")}
              </Button>
            )}

            {showCancelConfirm && (
              <div className="space-y-3 rounded-md border border-subtle bg-red-50 p-3">
                <p className="font-medium text-red-700 text-sm">{t("thotis_admin_confirm_cancel")}</p>
                <TextField
                  label={t("thotis_admin_cancel_reason")}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                />
                <div className="flex gap-2">
                  <Button
                    color="destructive"
                    size="sm"
                    loading={cancelMutation.isPending}
                    disabled={!cancelReason.trim()}
                    onClick={handleCancel}>
                    {t("confirm")}
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason("");
                    }}>
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} color="secondary">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
