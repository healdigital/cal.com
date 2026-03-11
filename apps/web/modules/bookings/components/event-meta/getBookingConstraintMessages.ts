import type { BookerEvent } from "@calcom/features/bookings/types";

type BookingConstraintEvent = Pick<
  BookerEvent,
  | "disableCancelling"
  | "disableRescheduling"
  | "minimumRescheduleNotice"
  | "periodCountCalendarDays"
  | "periodDays"
  | "periodEndDate"
  | "periodStartDate"
  | "periodType"
  | "requiresBookerEmailVerification"
  | "requiresConfirmation"
>;

type Translate = (key: string, options?: Record<string, string | number>) => string;

const PERIOD_TYPE = {
  RANGE: "RANGE",
  ROLLING: "ROLLING",
  ROLLING_WINDOW: "ROLLING_WINDOW",
} as const;

const formatConstraintDate = (date: Date | string, language: string): string | null => {
  const normalizedDate = new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) return null;

  return new Intl.DateTimeFormat(language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(normalizedDate);
};

const getRescheduleNoticeLabel = (minutes: number, t: Translate): string => {
  if (minutes >= 60 && minutes % 60 === 0) {
    return t("multiple_duration_timeUnit", {
      count: minutes / 60,
      unit: "hour",
    });
  }

  return t("multiple_duration_timeUnit", {
    count: minutes,
    unit: "minute",
  });
};

export const getBookingConstraintMessages = ({
  event,
  language,
  t,
}: {
  event: BookingConstraintEvent;
  language: string;
  t: Translate;
}): string[] => {
  const messages: string[] = [];

  if (event.periodType === PERIOD_TYPE.ROLLING && event.periodDays) {
    let dayTypeKey = "business_days";

    if (event.periodCountCalendarDays) {
      dayTypeKey = "calendar_days";
    }

    messages.push(
      t("booking_constraint_rolling_window", {
        days: event.periodDays,
        dayType: t(dayTypeKey),
      })
    );
  }

  if (event.periodType === PERIOD_TYPE.ROLLING_WINDOW && event.periodDays) {
    messages.push(
      t("booking_constraint_always_available_window", {
        days: event.periodDays,
      })
    );
  }

  if (event.periodType === PERIOD_TYPE.RANGE) {
    let startDate: string | null = null;
    let endDate: string | null = null;

    if (event.periodStartDate) {
      startDate = formatConstraintDate(event.periodStartDate, language);
    }

    if (event.periodEndDate) {
      endDate = formatConstraintDate(event.periodEndDate, language);
    }

    if (startDate && endDate) {
      messages.push(
        t("booking_constraint_date_range", {
          startDate,
          endDate,
        })
      );
    } else if (startDate) {
      messages.push(
        t("booking_constraint_from_date", {
          startDate,
        })
      );
    } else if (endDate) {
      messages.push(
        t("booking_constraint_until_date", {
          endDate,
        })
      );
    }
  }

  if (event.requiresConfirmation) {
    messages.push(t("requires_confirmation"));
  }

  if (event.requiresBookerEmailVerification) {
    messages.push(t("requires_booker_email_verification"));
  }

  if (event.disableRescheduling) {
    messages.push(t("rescheduling_is_disabled"));
  } else if (event.minimumRescheduleNotice) {
    messages.push(
      t("booking_constraint_reschedule_notice", {
        notice: getRescheduleNoticeLabel(event.minimumRescheduleNotice, t),
      })
    );
  }

  if (event.disableCancelling) {
    messages.push(t("booking_constraint_cancellation_disabled"));
  }

  return messages;
};
