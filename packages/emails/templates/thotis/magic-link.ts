import renderEmail from "../../src/renderEmail";
import BaseEmail from "../_base-email";

interface MagicLinkEmailContent {
  actionType?: string;
  buttonText: string;
  expiresNotice: string;
  ignoreNotice: string;
  subject: string;
  subtitle: string;
  title: string;
}

export default class MagicLinkEmail extends BaseEmail {
  magicLink: string;
  email: string;
  content: MagicLinkEmailContent;

  constructor(email: string, magicLink: string, content: MagicLinkEmailContent) {
    super();
    this.email = email;
    this.magicLink = magicLink;
    this.content = content;
    this.name = "SEND_MAGIC_LINK";
  }

  protected async getNodeMailerPayload(): Promise<Record<string, unknown>> {
    return {
      to: this.email,
      from: `Thotis <${this.getMailerOptions().from}>`,
      subject: this.content.subject,
      html: await this.getHtml(this.email, this.magicLink, this.content),
      text: "",
    };
  }

  protected async getHtml(
    email: string,
    magicLink: string,
    content: Omit<MagicLinkEmailContent, "subject">
  ): Promise<string> {
    return await renderEmail("MagicLinkEmail", {
      buttonText: content.buttonText,
      expiresNotice: content.expiresNotice,
      ignoreNotice: content.ignoreNotice,
      magicLink,
      actionType: content.actionType,
      recipientName: email, // Could be improved if we have name
      subtitle: content.subtitle,
      title: content.title,
    });
  }
}
