import type { BookerEvent } from "@calcom/features/bookings/types";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useMemo } from "react";
import { EventMetaBlock } from "./Details";
import { getBookingConstraintMessages } from "./getBookingConstraintMessages";

type BookingConstraintsProps = {
  event: Pick<
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
  className?: string;
};

export const BookingConstraints = ({ event, className }: BookingConstraintsProps): JSX.Element | null => {
  const { i18n, t } = useLocale();

  const messages = useMemo(
    () =>
      getBookingConstraintMessages({
        event,
        language: i18n.language,
        t,
      }),
    [event, i18n.language, t]
  );

  if (!messages.length) return null;

  return (
    <EventMetaBlock
      icon="info"
      className={className}
      contentClassName="max-w-full space-y-2"
      data-testid="event-booking-constraints">
      <p className="font-medium text-subtle text-xs uppercase tracking-[0.08em]">
        {t("booking_constraints")}
      </p>
      <div className="space-y-1 text-sm leading-5">
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </EventMetaBlock>
  );
};
