import process from "node:process";
import BookingCancellationEmail from "@calcom/emails/templates/thotis/booking-cancellation";
import BookingConfirmationEmail from "@calcom/emails/templates/thotis/booking-confirmation";
import BookingReminderEmail from "@calcom/emails/templates/thotis/booking-reminder";
import BookingRescheduledEmail from "@calcom/emails/templates/thotis/booking-rescheduled";
import FeedbackRequestEmail from "@calcom/emails/templates/thotis/feedback-request";
import MagicLinkEmail from "@calcom/emails/templates/thotis/magic-link";
import logger from "@calcom/lib/logger";
import { getTranslation } from "@calcom/lib/server/i18n";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import { ThotisGuestService } from "./ThotisGuestService";

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
  private readonly guestService: ThotisGuestService;

  constructor(guestService?: ThotisGuestService) {
    this.guestService = guestService || new ThotisGuestService();
  }

  private async shouldSendEmail(emailAddress: string) {
    const isBlocked = await this.guestService.isEmailBlocked(emailAddress);

    if (isBlocked) {
      log.info("Skipping Thotis email for unsubscribed guest", { emailAddress });
      return false;
    }

    return true;
  }

  private buildUnsubscribeLink(accessLink?: string) {
    if (!accessLink) return undefined;

    try {
      const parsedUrl = new URL(accessLink);
      const token = parsedUrl.searchParams.get("token");

      if (!token) return undefined;

      const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://app.cal.com";
      return `${webAppUrl}/api/thotis/guest/unsubscribe?token=${encodeURIComponent(token)}`;
    } catch {
      return undefined;
    }
  }

  async sendReminder(calEvent: CalendarEvent, attendee: Person) {
    if (!(await this.shouldSendEmail(attendee.email))) return;

    const email = new BookingReminderEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendFeedbackRequest(calEvent: CalendarEvent, attendee: Person, feedbackLink: string) {
    if (!(await this.shouldSendEmail(attendee.email))) return;

    const email = new FeedbackRequestEmail(
      calEvent,
      attendee,
      feedbackLink,
      this.buildUnsubscribeLink(feedbackLink)
    );
    await sendThotisEmailWithRetry(email);
  }

  async sendConfirmation(calEvent: CalendarEvent, attendee: Person, dashboardLink?: string) {
    if (!(await this.shouldSendEmail(attendee.email))) return;

    const email = new BookingConfirmationEmail(
      calEvent,
      attendee,
      undefined,
      dashboardLink,
      this.buildUnsubscribeLink(dashboardLink)
    );
    await sendThotisEmailWithRetry(email);
  }

  async sendCancellation(calEvent: CalendarEvent, attendee: Person) {
    if (!(await this.shouldSendEmail(attendee.email))) return;

    const email = new BookingCancellationEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendRescheduled(calEvent: CalendarEvent, attendee: Person) {
    if (!(await this.shouldSendEmail(attendee.email))) return;

    const email = new BookingRescheduledEmail(calEvent, attendee);
    await sendThotisEmailWithRetry(email);
  }

  async sendMagicLink(
    emailAddress: string,
    magicLink: string,
    actionType: string = "LOGIN",
    locale?: string
  ) {
    if (!(await this.shouldSendEmail(emailAddress))) return;

    const t = await getTranslation(locale ?? "fr", "common");
    const isLogin = !actionType || actionType === "LOGIN";
    const email = new MagicLinkEmail(emailAddress, magicLink, {
      actionType,
      buttonText: isLogin ? t("thotis_magic_link_login_cta") : t("thotis_magic_link_action_cta"),
      expiresNotice: t("thotis_magic_link_expires_notice"),
      ignoreNotice: t("thotis_magic_link_ignore_notice"),
      subject: isLogin ? t("thotis_magic_link_login_subject") : t("thotis_magic_link_action_subject"),
      subtitle: isLogin ? t("thotis_magic_link_login_subtitle") : t("thotis_magic_link_action_subtitle"),
      title: isLogin ? t("thotis_magic_link_login_subject") : t("thotis_magic_link_action_subject"),
      unsubscribeLabel: t("unsubscribe"),
      unsubscribeLink: this.buildUnsubscribeLink(magicLink),
    });
    await sendThotisEmailWithRetry(email);
  }
}
