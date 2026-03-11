"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Label, Select, TextField } from "@calcom/ui/components/form";
import { Table } from "@calcom/ui/components/table";
import { useState } from "react";
import { BookingDetailDialog } from "./BookingDetailDialog";

function StatusBadge({ status }: { status: string }) {
  const { t } = useLocale();
  const colorMap: Record<string, string> = {
    ACCEPTED: "bg-success text-inverted",
    PENDING: "bg-attention text-attention",
    CANCELLED: "bg-error text-inverted",
    REJECTED: "bg-error text-inverted",
  };

  const labelMap: Record<string, string> = {
    ACCEPTED: t("thotis_admin_status_accepted"),
    PENDING: t("thotis_admin_status_pending"),
    CANCELLED: t("thotis_admin_status_cancelled"),
    REJECTED: t("thotis_admin_status_rejected"),
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
        colorMap[status] || "bg-subtle text-subtle"
      }`}>
      {labelMap[status] || status}
    </span>
  );
}

export function AdminBookingList() {
  const { t } = useLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const pageSize = 20;

  const STATUS_OPTIONS = [
    { label: t("thotis_admin_status_all"), value: "" },
    { label: t("thotis_admin_status_accepted"), value: "ACCEPTED" },
    { label: t("thotis_admin_status_pending"), value: "PENDING" },
    { label: t("thotis_admin_status_cancelled"), value: "CANCELLED" },
  ];

  const { data, isLoading } = trpc.thotis.admin.listBookings.useQuery({
    page,
    pageSize,
    status: status || undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-emphasis text-xl">{t("thotis_admin_bookings_title")}</h2>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-48">
          <Label>{t("thotis_admin_filter_status")}</Label>
          <Select
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((o) => o.value === status)}
            onChange={(opt) => {
              setStatus(opt?.value || "");
              setPage(1);
            }}
          />
        </div>
        <div>
          <Label>{t("thotis_admin_filter_date_from")}</Label>
          <TextField
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <Label>{t("thotis_admin_filter_date_to")}</Label>
          <TextField
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {(status || dateFrom || dateTo) && (
          <Button
            color="minimal"
            size="sm"
            onClick={() => {
              setStatus("");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}>
            {t("clear_filters")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2" />
        </div>
      ) : (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.ColumnTitle>{t("thotis_admin_col_datetime")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_col_mentor")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_col_student")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_col_status")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_col_rating")}</Table.ColumnTitle>
                <Table.ColumnTitle>{t("thotis_admin_actions")}</Table.ColumnTitle>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!data?.bookings || data.bookings.length === 0 ? (
                <Table.Row>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <p className="font-medium text-emphasis">{t("thotis_admin_no_bookings")}</p>
                    <p className="mt-1 text-sm text-subtle">{t("thotis_admin_no_bookings_empty_desc")}</p>
                  </td>
                </Table.Row>
              ) : (
                data.bookings.map((booking) => (
                  <Table.Row key={booking.id}>
                    <Table.Cell>
                      <div>
                        <div className="font-medium text-default">
                          {new Date(booking.startTime).toLocaleDateString()}
                        </div>
                        <div className="text-muted text-xs">
                          {new Date(booking.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(booking.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-medium text-default">{booking.user?.name || "\u2014"}</div>
                        <div className="text-muted text-xs">{booking.user?.email || ""}</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-default text-sm">{booking.attendees?.[0]?.email || "\u2014"}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={booking.status} />
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-default">
                        {booking.sessionRating ? `${booking.sessionRating.rating}/5` : "\u2014"}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button size="sm" color="secondary" onClick={() => setSelectedBookingId(booking.id)}>
                        {t("thotis_admin_view_details")}
                      </Button>
                    </Table.Cell>
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
        </>
      )}

      <BookingDetailDialog
        bookingId={selectedBookingId}
        isOpen={!!selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
}
