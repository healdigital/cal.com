import process from "node:process";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import type { TFunction } from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThotisEmailService } from "./ThotisEmailService";
import type { ThotisGuestService } from "./ThotisGuestService";

const emailMocks = vi.hoisted(() => {
  const bookingCancellationSendEmail = vi.fn().mockResolvedValue(undefined);
  const bookingConfirmationSendEmail = vi.fn().mockResolvedValue(undefined);
  const bookingReminderSendEmail = vi.fn().mockResolvedValue(undefined);
  const bookingRescheduledSendEmail = vi.fn().mockResolvedValue(undefined);
  const feedbackRequestSendEmail = vi.fn().mockResolvedValue(undefined);
  const magicLinkSendEmail = vi.fn().mockResolvedValue(undefined);

  type MockEmailInstance = {
    name: string;
    sendEmail: () => Promise<void>;
  };

  return {
    BookingCancellationEmailMock: vi.fn(function BookingCancellationEmailMock(this: MockEmailInstance) {
      this.name = "BookingCancellationEmail";
      this.sendEmail = bookingCancellationSendEmail;
    }),
    BookingConfirmationEmailMock: vi.fn(function BookingConfirmationEmailMock(this: MockEmailInstance) {
      this.name = "BookingConfirmationEmail";
      this.sendEmail = bookingConfirmationSendEmail;
    }),
    BookingReminderEmailMock: vi.fn(function BookingReminderEmailMock(this: MockEmailInstance) {
      this.name = "BookingReminderEmail";
      this.sendEmail = bookingReminderSendEmail;
    }),
    BookingRescheduledEmailMock: vi.fn(function BookingRescheduledEmailMock(this: MockEmailInstance) {
      this.name = "BookingRescheduledEmail";
      this.sendEmail = bookingRescheduledSendEmail;
    }),
    FeedbackRequestEmailMock: vi.fn(function FeedbackRequestEmailMock(this: MockEmailInstance) {
      this.name = "FeedbackRequestEmail";
      this.sendEmail = feedbackRequestSendEmail;
    }),
    MagicLinkEmailMock: vi.fn(function MagicLinkEmailMock(this: MockEmailInstance) {
      this.name = "MagicLinkEmail";
      this.sendEmail = magicLinkSendEmail;
    }),
    bookingCancellationSendEmail,
    bookingConfirmationSendEmail,
    bookingReminderSendEmail,
    bookingRescheduledSendEmail,
    feedbackRequestSendEmail,
    magicLinkSendEmail,
  };
});

vi.mock("@calcom/emails/templates/thotis/booking-cancellation", () => ({
  default: emailMocks.BookingCancellationEmailMock,
}));

vi.mock("@calcom/emails/templates/thotis/booking-confirmation", () => ({
  default: emailMocks.BookingConfirmationEmailMock,
}));

vi.mock("@calcom/emails/templates/thotis/booking-reminder", () => ({
  default: emailMocks.BookingReminderEmailMock,
}));

vi.mock("@calcom/emails/templates/thotis/booking-rescheduled", () => ({
  default: emailMocks.BookingRescheduledEmailMock,
}));

vi.mock("@calcom/emails/templates/thotis/feedback-request", () => ({
  default: emailMocks.FeedbackRequestEmailMock,
}));

vi.mock("@calcom/emails/templates/thotis/magic-link", () => ({
  default: emailMocks.MagicLinkEmailMock,
}));

vi.mock("@calcom/lib/server/i18n", () => ({
  getTranslation: vi.fn().mockResolvedValue((key: string) => key),
}));

const translate = ((key: string) => key) as unknown as TFunction;

function createPerson(overrides?: Partial<Person>): Person {
  return {
    email: "guest@example.com",
    language: { locale: "fr", translate },
    name: "Guest Student",
    timeZone: "Europe/Paris",
    ...overrides,
  };
}

function createCalendarEvent(attendee: Person): CalendarEvent {
  return {
    attendees: [attendee],
    endTime: "2026-03-12T10:15:00.000Z",
    organizer: createPerson({
      email: "mentor@example.com",
      name: "Mentor",
    }),
    startTime: "2026-03-12T10:00:00.000Z",
    title: "Thotis mentoring session",
    type: "thotis",
  };
}

describe("ThotisEmailService", () => {
  let guestServiceMock: ThotisGuestService;
  let service: ThotisEmailService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_WEBAPP_URL = "https://app.cal.local";

    guestServiceMock = {
      isEmailBlocked: vi.fn().mockResolvedValue(false),
    } as unknown as ThotisGuestService;

    service = new ThotisEmailService(guestServiceMock);
  });

  it("adds an unsubscribe link to magic-link emails when the token is present", async () => {
    await service.sendMagicLink(
      "guest@example.com",
      "https://app.cal.local/thotis/my-sessions?token=magic-token",
      "LOGIN",
      "fr"
    );

    expect(emailMocks.MagicLinkEmailMock).toHaveBeenCalledWith(
      "guest@example.com",
      "https://app.cal.local/thotis/my-sessions?token=magic-token",
      expect.objectContaining({
        unsubscribeLabel: "unsubscribe",
        unsubscribeLink: "https://app.cal.local/api/thotis/guest/unsubscribe?token=magic-token",
      })
    );
    expect(emailMocks.magicLinkSendEmail).toHaveBeenCalledTimes(1);
  });

  it("derives the unsubscribe link from the guest feedback access link", async () => {
    const attendee = createPerson();
    const calEvent = createCalendarEvent(attendee);

    await service.sendFeedbackRequest(
      calEvent,
      attendee,
      "https://app.cal.local/thotis/review?token=feedback-token"
    );

    expect(emailMocks.FeedbackRequestEmailMock).toHaveBeenCalledWith(
      calEvent,
      attendee,
      "https://app.cal.local/thotis/review?token=feedback-token",
      "https://app.cal.local/api/thotis/guest/unsubscribe?token=feedback-token"
    );
    expect(emailMocks.feedbackRequestSendEmail).toHaveBeenCalledTimes(1);
  });

  it("skips confirmation emails for blocked guests", async () => {
    const attendee = createPerson();
    const calEvent = createCalendarEvent(attendee);

    vi.mocked(guestServiceMock.isEmailBlocked).mockResolvedValue(true);

    await service.sendConfirmation(
      calEvent,
      attendee,
      "https://app.cal.local/thotis/my-sessions?token=booking-token"
    );

    expect(guestServiceMock.isEmailBlocked).toHaveBeenCalledWith("guest@example.com");
    expect(emailMocks.BookingConfirmationEmailMock).not.toHaveBeenCalled();
    expect(emailMocks.bookingConfirmationSendEmail).not.toHaveBeenCalled();
  });
});
