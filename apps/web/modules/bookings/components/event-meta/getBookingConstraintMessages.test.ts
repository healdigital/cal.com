import { PeriodType } from "@calcom/prisma/enums";
import { describe, expect, it } from "vitest";
import { getBookingConstraintMessages } from "./getBookingConstraintMessages";

const t = (key: string, options?: Record<string, string | number>): string => {
  switch (key) {
    case "calendar_days":
      return "calendar days";
    case "business_days":
      return "business days";
    case "requires_confirmation":
      return "Requires confirmation";
    case "requires_booker_email_verification":
      return "Requires booker email verification";
    case "rescheduling_is_disabled":
      return "Rescheduling is disabled for this event";
    case "booking_constraint_cancellation_disabled":
      return "Cancellations are disabled for this event";
    case "booking_constraint_rolling_window":
      return `Book up to ${options?.days} ${options?.dayType} in advance`;
    case "booking_constraint_always_available_window":
      return `Always shows the next ${options?.days} available days`;
    case "booking_constraint_date_range":
      return `Book between ${options?.startDate} and ${options?.endDate}`;
    case "booking_constraint_reschedule_notice":
      return `Rescheduling closes ${options?.notice} before the event`;
    case "multiple_duration_timeUnit": {
      let unitLabel = "mins";

      if (options?.unit === "hour") {
        unitLabel = "hours";
      }

      return `${options?.count} ${unitLabel}`;
    }
    default:
      return key;
  }
};

describe("getBookingConstraintMessages", () => {
  it("builds the main booking constraints summary", () => {
    const messages = getBookingConstraintMessages({
      event: {
        periodType: PeriodType.ROLLING,
        periodDays: 14,
        periodCountCalendarDays: true,
        periodStartDate: null,
        periodEndDate: null,
        requiresConfirmation: true,
        requiresBookerEmailVerification: true,
        disableRescheduling: false,
        minimumRescheduleNotice: 120,
        disableCancelling: true,
      },
      language: "en",
      t,
    });

    expect(messages).toEqual([
      "Book up to 14 calendar days in advance",
      "Requires confirmation",
      "Requires booker email verification",
      "Rescheduling closes 2 hours before the event",
      "Cancellations are disabled for this event",
    ]);
  });

  it("formats date range constraints", () => {
    const messages = getBookingConstraintMessages({
      event: {
        periodType: PeriodType.RANGE,
        periodDays: null,
        periodCountCalendarDays: false,
        periodStartDate: new Date("2026-03-10T00:00:00.000Z"),
        periodEndDate: new Date("2026-03-20T00:00:00.000Z"),
        requiresConfirmation: false,
        requiresBookerEmailVerification: false,
        disableRescheduling: true,
        minimumRescheduleNotice: null,
        disableCancelling: false,
      },
      language: "en",
      t,
    });

    expect(messages[0]).toBe("Book between Mar 10, 2026 and Mar 20, 2026");
    expect(messages[1]).toBe("Rescheduling is disabled for this event");
  });

  it("formats rolling window constraints", () => {
    const messages = getBookingConstraintMessages({
      event: {
        periodType: PeriodType.ROLLING_WINDOW,
        periodDays: 5,
        periodCountCalendarDays: false,
        periodStartDate: null,
        periodEndDate: null,
        requiresConfirmation: false,
        requiresBookerEmailVerification: false,
        disableRescheduling: false,
        minimumRescheduleNotice: null,
        disableCancelling: false,
      },
      language: "en",
      t,
    });

    expect(messages).toEqual(["Always shows the next 5 available days"]);
  });
});
