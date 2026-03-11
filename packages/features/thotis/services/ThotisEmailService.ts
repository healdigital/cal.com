import BookingCancellationEmail from "@calcom/emails/templates/thotis/booking-cancellation";
import BookingConfirmationEmail from "@calcom/emails/templates/thotis/booking-confirmation";
import BookingReminderEmail from "@calcom/emails/templates/thotis/booking-reminder";
import BookingRescheduledEmail from "@calcom/emails/templates/thotis/booking-rescheduled";
import FeedbackRequestEmail from "@calcom/emails/templates/thotis/feedback-request";
import MagicLinkEmail from "@calcom/emails/templates/thotis/magic-link";
import logger from "@calcom/lib/logger";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";

const log = logger.getSubLogger({ prefix: ["ThotisEmailService"] });

const RETRYABLE_EMAIL_ERROR_CODES = new Set([
  "ECONNABORTED",
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "EPIPE",
  "ESOCKET",
  "ETIMEDOUT",
]);

const RETRYABLE_EMAIL_MESSAGE_PATTERNS = [
  "connection reset",
  "network",
  "rate limit",
  "socket",
  "temporarily unavailable",
  "timeout",
  "timed out",
  "too many requests",
];

type RetryableEmail = {
  name?: string;
  sendEmail: () => Promise<unknown>;
};

function isRetryableEmailError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = "code" in error && typeof error.code === "string" ? error.code : null;
  if (code && RETRYABLE_EMAIL_ERROR_CODES.has(code)) {
    return true;
  }

  const message = error.message.toLowerCase();
  return RETRYABLE_EMAIL_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern));
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function sendThotisEmailWithRetry(
  email: RetryableEmail,
  options?: { initialDelayMs?: number; maxAttempts?: number }
): Promise<void> {
  const maxAttempts = options?.maxAttempts ?? 3;
  const initialDelayMs = options?.initialDelayMs ?? 250;
  const emailName = email.name || email.constructor?.name || "ThotisEmail";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await email.sendEmail();
      return;
    } catch (error) {
      const shouldRetry = attempt < maxAttempts && isRetryableEmailError(error);

      log.warn("Thotis email send failed", {
        attempt,
        emailName,
        error,
        willRetry: shouldRetry,
      });

      if (!shouldRetry) {
        throw error;
      }

      await wait(initialDelayMs * 2 ** (attempt - 1));
    }
  }
}

export class ThotisEmailService {
  async sendReminder(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingReminderEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendFeedbackRequest(calEvent: CalendarEvent, attendee: Person, feedbackLink: string) {
    const email = new FeedbackRequestEmail(calEvent, attendee, feedbackLink);
    await sendThotisEmailWithRetry(email);
  }

  async sendConfirmation(calEvent: CalendarEvent, attendee: Person, dashboardLink?: string) {
    const email = new BookingConfirmationEmail(calEvent, attendee, undefined, dashboardLink);
    await sendThotisEmailWithRetry(email);
  }

  async sendCancellation(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingCancellationEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendRescheduled(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingRescheduledEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendMagicLink(emailAddress: string, magicLink: string, actionType: string = "LOGIN") {
    const email = new MagicLinkEmail(emailAddress, magicLink, actionType);
    await sendThotisEmailWithRetry(email);
  }
}
