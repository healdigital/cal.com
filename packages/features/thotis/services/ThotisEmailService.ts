import BookingCancellationEmail from "@calcom/emails/templates/thotis/booking-cancellation";
import BookingConfirmationEmail from "@calcom/emails/templates/thotis/booking-confirmation";
import BookingReminderEmail from "@calcom/emails/templates/thotis/booking-reminder";
import BookingRescheduledEmail from "@calcom/emails/templates/thotis/booking-rescheduled";
import FeedbackRequestEmail from "@calcom/emails/templates/thotis/feedback-request";
import MagicLinkEmail from "@calcom/emails/templates/thotis/magic-link";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";

export class ThotisEmailService {
  async sendReminder(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingReminderEmail(calEvent, attendee);
    await email.sendEmail();
  }

  async sendFeedbackRequest(calEvent: CalendarEvent, attendee: Person, feedbackLink: string) {
    const email = new FeedbackRequestEmail(calEvent, attendee, feedbackLink);
    await email.sendEmail();
  }

  async sendConfirmation(calEvent: CalendarEvent, attendee: Person, dashboardLink?: string) {
    const email = new BookingConfirmationEmail(calEvent, attendee, undefined, dashboardLink);
    await email.sendEmail();
  }

  async sendCancellation(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingCancellationEmail(calEvent, attendee);
    await email.sendEmail();
  }

  async sendRescheduled(calEvent: CalendarEvent, attendee: Person) {
    const email = new BookingRescheduledEmail(calEvent, attendee);
    await email.sendEmail();
  }

  async sendMagicLink(emailAddress: string, magicLink: string, actionType: string = "LOGIN") {
    const email = new MagicLinkEmail(emailAddress, magicLink, actionType);
    await email.sendEmail();
  }
}
