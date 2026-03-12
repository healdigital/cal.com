import type { ReactElement } from "react";
import { ThotisBaseEmail } from "./ThotisBaseEmail";

export const MagicLinkEmail = (props: {
  buttonText: string;
  expiresNotice: string;
  ignoreNotice: string;
  magicLink: string;
  actionType?: string; // "LOGIN", "CANCEL", "RESCHEDULE", etc.
  recipientName?: string;
  subtitle: string;
  title: string;
  unsubscribeLabel?: string;
  unsubscribeLink?: string;
}): ReactElement => {
  return (
    <ThotisBaseEmail
      subject={props.title}
      title={props.title}
      subtitle={props.subtitle}
      headerType="checkCircle"
      unsubscribeLabel={props.unsubscribeLabel}
      unsubscribeLink={props.unsubscribeLink}>
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={props.magicLink}
          style={{
            backgroundColor: "#FF6B35", // Thotis Orange
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontFamily: "Montserrat, Inter, Roboto, sans-serif",
            fontSize: "16px",
            display: "inline-block",
          }}>
          {props.buttonText}
        </a>
      </div>
      <div style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
        <p>{props.expiresNotice}</p>
        <p>{props.ignoreNotice}</p>
      </div>
    </ThotisBaseEmail>
  );
};
