import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import renderEmail from "../../src/renderEmail";
import BaseEmail from "../_base-email";

export default class FeedbackRequestEmail extends BaseEmail {
  calEvent: CalendarEvent;
  attendee: Person;
  feedbackLink: string;
  unsubscribeLink?: string;

  constructor(calEvent: CalendarEvent, attendee: Person, feedbackLink: string, unsubscribeLink?: string) {
    super();
    this.calEvent = calEvent;
    this.attendee = attendee;
    this.feedbackLink = feedbackLink;
    this.unsubscribeLink = unsubscribeLink;
    this.name = "SEND_FEEDBACK_REQUEST";
  }

  protected async getNodeMailerPayload(): Promise<Record<string, unknown>> {
    const t = this.attendee.language.translate;

    return {
      to: `${this.attendee.name} <${this.attendee.email}>`,
      from: `${this.calEvent.organizer.name} <${this.getMailerOptions().from}>`,
      subject: t("thotis_feedback_request_subject", {
        defaultValue: "How was your session with {{name}}?",
        name: this.calEvent.organizer.name,
      }),
      html: await this.getHtml(this.calEvent, this.attendee, this.feedbackLink),
      text: "", // Needed but simple
    };
  }

  protected async getHtml(calEvent: CalendarEvent, attendee: Person, feedbackLink: string) {
    return await renderEmail("FeedbackRequestEmail", {
      calEvent,
      attendee,
      feedbackLink: feedbackLink,
      unsubscribeLink: this.unsubscribeLink,
    });
  }
}
