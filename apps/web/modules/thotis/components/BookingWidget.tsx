"use client";

import process from "node:process";
import type { Dayjs } from "@calcom/dayjs";
import dayjs from "@calcom/dayjs";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePersistedBookingState } from "../hooks/usePersistedBookingState";

/**
 * Thotis Branding Constants
 */
const BRANDING = {
  colors: {
    primary: "#004E89", // Thotis Blue
    secondary: "#FF6B35", // Thotis Orange
  },
  fonts: {
    primary: "Montserrat, sans-serif",
    secondary: "Inter, sans-serif",
  },
};

/** Derive the parent frame origin from document.referrer for secure postMessage. */
function getParentOrigin(): string {
  try {
    if (typeof document !== "undefined" && document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch {
    // Invalid referrer URL — fall back to configured app URL
  }
  // Never use wildcard "*" — restrict to the configured webapp origin
  return process.env.NEXT_PUBLIC_WEBAPP_URL || (typeof window !== "undefined" ? window.location.origin : "");
}

/** Strip HTML tags and limit length to prevent XSS from URL params */
function sanitizeInput(value: string, maxLength = 200): string {
  return value
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

type BookingFormValues = {
  name: string;
  email: string;
  notes: string;
};

type WidgetStep = "loading" | "date" | "time" | "form" | "confirming" | "success" | "error";

interface BookingWidgetProps {
  studentProfileId?: string;
  initialStep?: WidgetStep;
}

export const BookingWidget = ({ studentProfileId, initialStep = "date" }: BookingWidgetProps) => {
  const { t, i18n } = useLocale();
  const bookingFormSchema = z.object({
    name: z.string().min(1, t("thotis_name_required")).max(200),
    email: z.string().min(1, t("thotis_email_required")).email(t("thotis_valid_email")),
    notes: z.string().max(1000).optional().default(""),
  });

  // Use persisted state hook
  const {
    step,
    selectedDate,
    selectedSlot,
    bookingDetails,
    formValues,
    setStep,
    setSelectedDate,
    setSelectedSlot,
    setBookingDetails,
    setFormValues,
    clearState,
  } = usePersistedBookingState(studentProfileId);

  const [errorString, setErrorString] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: formValues,
  });

  // Pre-fetch 14-day availability to show indicators on date buttons
  const overviewRange = useMemo(() => {
    const start = dayjs().add(1, "day").startOf("day").toDate();
    const end = dayjs().add(14, "day").endOf("day").toDate();
    return { start, end };
  }, []);

  const { data: overviewAvailability } = trpc.thotis.booking.getAvailability.useQuery(
    {
      studentProfileId: studentProfileId || "",
      start: overviewRange.start,
      end: overviewRange.end,
    },
    { enabled: !!studentProfileId }
  );

  // Build a set of dates that have at least one available slot
  const datesWithSlots = useMemo(() => {
    if (!overviewAvailability) return new Set<string>();
    const dates = new Set<string>();
    for (const slot of overviewAvailability) {
      if (slot.available) {
        dates.add(dayjs(slot.start).format("YYYY-MM-DD"));
      }
    }
    return dates;
  }, [overviewAvailability]);

  // Compute date range for the selected date
  const dateRange = useMemo(() => {
    if (!selectedDate) return null;
    const start = selectedDate.startOf("day").toDate();
    const end = selectedDate.endOf("day").toDate();
    return { start, end };
  }, [selectedDate]);

  // Fetch real availability from backend for the selected date
  const { data: availabilityData, isPending: isPendingSlots } = trpc.thotis.booking.getAvailability.useQuery(
    {
      studentProfileId: studentProfileId || "",
      start: dateRange?.start || new Date(),
      end: dateRange?.end || new Date(),
    },
    {
      enabled: !!studentProfileId && !!dateRange,
    }
  );

  // Filter to only available slots
  const availableSlots = useMemo(() => {
    if (!availabilityData) return [];
    return availabilityData.filter((slot) => slot.available);
  }, [availabilityData]);

  // PostMessage Handling
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        window.parent.postMessage(
          { type: "THOTIS_RESIZE", height: entry.contentRect.height },
          getParentOrigin()
        );
      }
    });

    const container = document.getElementById("thotis-widget-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, [step]);

  // URL Param Pre-filling (sanitized to prevent XSS) and restore persisted values
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const name = params.get("name");
      const email = params.get("email");

      // URL params take precedence
      if (name) {
        const sanitized = sanitizeInput(name);
        setValue("name", sanitized);
        setFormValues({ name: sanitized });
      } else if (formValues.name) {
        setValue("name", formValues.name);
      }

      if (email) {
        const sanitized = sanitizeInput(email);
        setValue("email", sanitized);
        setFormValues({ email: sanitized });
      } else if (formValues.email) {
        setValue("email", formValues.email);
      }

      if (formValues.notes) {
        setValue("notes", formValues.notes);
      }
    }
  }, [setValue, formValues, setFormValues]);

  // Mutation
  const createBookingMutation = trpc.thotis.booking.createSession.useMutation({
    onSuccess: (data) => {
      setBookingDetails({
        bookingId: data.bookingId,
        googleMeetLink: data.googleMeetLink,
      });
      setStep("success");
      window.parent.postMessage(
        {
          type: "THOTIS_BOOKING_SUCCESS",
          bookingId: data.bookingId,
          googleMeetLink: data.googleMeetLink,
        },
        getParentOrigin()
      );

      // Clear persisted state after successful booking
      setTimeout(() => clearState(), 5000);
    },
    onError: (error) => {
      setErrorString(error.message);
      setStep("error");
    },
  });

  const trackEvent = trpc.thotis.analytics.track.useMutation();
  const isPendingBooking = createBookingMutation.isPending;

  const onSubmit = (data: BookingFormValues) => {
    if (!selectedSlot || !studentProfileId) return;

    // Persist form values before submitting
    setFormValues(data);

    setStep("confirming");
    createBookingMutation.mutate({
      studentProfileId,
      dateTime: new Date(selectedSlot),
      locale: i18n.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      prospectiveStudent: {
        name: data.name,
        email: data.email,
        question: data.notes,
      },
    });
  };

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("time");
  };

  const handleSlotSelect = (slotIso: string) => {
    setSelectedSlot(slotIso);
    setStep("form");

    // Track Postgres Analytics
    if (studentProfileId) {
      trackEvent.mutate({
        eventType: ThotisAnalyticsEventType.booking_started,
        profileId: studentProfileId,
        metadata: {
          slotTime: slotIso,
        },
      });
    }
  };

  // Generate next 14 days for date selection.
  // All days are shown — the backend availability API determines which have slots.
  const selectableDates = useMemo(() => {
    const dates: Dayjs[] = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(dayjs().add(i, "day"));
    }
    return dates;
  }, []);

  return (
    <div
      id="thotis-widget-container"
      className="flex min-h-[400px] min-w-[320px] flex-col rounded-lg bg-white p-4 shadow-sm font-sans"
      style={{ fontFamily: BRANDING.fonts.secondary }}>
      {/* Header with Logo */}
      <div className="mb-6 flex items-center justify-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: BRANDING.colors.primary, fontFamily: BRANDING.fonts.primary }}>
          THOTIS <span className="ml-2 text-sm font-normal text-gray-500">{t("thotis_mentoring")}</span>
        </h1>
      </div>

      <div className="mb-6 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
        {t("thotis_booking_widget_notice")}
      </div>

      <div aria-live="polite">
        {step === "date" && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-center text-lg font-semibold">{t("thotis_select_date")}</h2>
            <div className="grid grid-cols-3 gap-2">
              {selectableDates.map((date) => {
                const localizedDate = date.locale(i18n.language);
                const dateKey = localizedDate.format("YYYY-MM-DD");
                const hasSlots = datesWithSlots.size === 0 || datesWithSlots.has(dateKey);
                const isSelected = selectedDate?.format("YYYY-MM-DD") === dateKey;
                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => handleDateChange(date)}
                    disabled={datesWithSlots.size > 0 && !hasSlots}
                    aria-label={`${localizedDate.format("dddd, MMMM D")}${
                      hasSlots ? "" : ` - ${t("thotis_no_slots_available")}`
                    }`}
                    className={`rounded-lg border px-3 py-3 text-center transition-colors ${
                      !hasSlots && datesWithSlots.size > 0
                        ? "cursor-not-allowed border-gray-100 opacity-40"
                        : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                    style={{
                      borderColor: isSelected ? BRANDING.colors.primary : undefined,
                    }}>
                    <div className="text-xs font-medium text-gray-500">{localizedDate.format("ddd")}</div>
                    <div
                      className={`text-lg font-bold ${hasSlots || datesWithSlots.size === 0 ? "text-gray-900" : "text-gray-400"}`}>
                      {localizedDate.format("D")}
                    </div>
                    <div className="text-xs text-gray-500">{localizedDate.format("MMM")}</div>
                    {hasSlots && datesWithSlots.size > 0 && (
                      <div
                        className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-green-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === "time" && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center">
              <button
                type="button"
                aria-label={t("thotis_back")}
                onClick={() => setStep("date")}
                className="mr-2 text-sm text-gray-500 hover:text-gray-700">
                &larr; {t("thotis_back")}
              </button>
              <h2 className="flex-1 text-center text-lg font-semibold">{t("thotis_select_time")}</h2>
            </div>

            {selectedDate && (
              <p className="mb-3 text-center text-sm text-gray-500">
                {selectedDate.locale(i18n.language).format("dddd, MMMM D, YYYY")}
              </p>
            )}

            {isPendingSlots ? (
              <div className="flex items-center justify-center py-10">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-b-2"
                  style={{ borderColor: BRANDING.colors.primary }}
                />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">{t("thotis_no_slots_available")}</p>
              </div>
            ) : (
              <div className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto">
                {availableSlots.map((slot) => {
                  const slotTime = dayjs(slot.start);
                  return (
                    <Button
                      key={slotTime.toISOString()}
                      onClick={() => handleSlotSelect(slotTime.toISOString())}
                      className="w-full justify-center"
                      style={{ borderColor: BRANDING.colors.primary, color: BRANDING.colors.primary }}
                      color="secondary"
                      data-testid="available-slot">
                      {slotTime.format("HH:mm")}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in space-y-4">
            <div className="mb-4 flex items-center">
              <button
                type="button"
                aria-label={t("thotis_back")}
                onClick={() => setStep("time")}
                className="mr-2 text-sm text-gray-500 hover:text-gray-700">
                &larr; {t("thotis_back")}
              </button>
              <h2 className="flex-1 text-center text-lg font-semibold">{t("thotis_your_details")}</h2>
            </div>

            {selectedDate && selectedSlot && (
              <div className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm text-blue-800">
                {selectedDate.locale(i18n.language).format("ddd, MMM D")} &middot;{" "}
                {dayjs(selectedSlot).locale(i18n.language).format("HH:mm")} -{" "}
                {dayjs(selectedSlot).add(15, "minute").format("HH:mm")}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t("your_name")}
              </label>
              <input
                id="name"
                {...register("name")}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span id="name-error" className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                {t("thotis_notes_optional")}
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center text-white"
              style={{ backgroundColor: BRANDING.colors.secondary }}
              data-testid="confirm-booking">
              {t("thotis_confirm_booking")}
            </Button>
          </form>
        )}

        {step === "confirming" && (
          <div className="flex flex-col items-center justify-center py-10">
            <div
              className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"
              style={{ borderColor: BRANDING.colors.primary }}
            />
            <p className="mt-4 text-gray-600">{t("thotis_booking_your_session")}</p>
          </div>
        )}

        {step === "success" && (
          <div className="animate-fade-in flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold">{t("thotis_booking_confirmed_title")}</h2>
            <p className="mb-6 text-gray-600">{t("thotis_check_email")}</p>

            {bookingDetails.googleMeetLink && (
              <a
                href={bookingDetails.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                style={{ backgroundColor: BRANDING.colors.primary }}
                data-testid="meet-link">
                {t("thotis_join_google_meet")}
              </a>
            )}

            <button
              type="button"
              onClick={clearState}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700">
              {t("thotis_book_another")}
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="animate-fade-in flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold">{t("thotis_something_wrong")}</h2>
            <p className="mb-6 text-gray-600">{errorString || t("booking_fail")}</p>
            <Button onClick={() => setStep("date")} color="secondary">
              {t("thotis_try_again")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
