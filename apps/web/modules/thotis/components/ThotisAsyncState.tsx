"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import type { ReactElement } from "react";

interface ThotisLoadingStateProps {
  className?: string;
  label?: string;
  spinnerClassName?: string;
}

const ThotisLoadingState = ({
  className,
  label,
  spinnerClassName,
}: ThotisLoadingStateProps): ReactElement => {
  const { t } = useLocale();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className ?? "py-12"}`}
      role="status"
      aria-label={label ?? t("loading")}>
      <div
        className={`h-8 w-8 animate-spin rounded-full border-emphasis border-t-2 border-b-2 ${
          spinnerClassName ?? ""
        }`}
      />
      <p className="text-center text-sm text-subtle">{label ?? t("loading")}</p>
    </div>
  );
};

interface ThotisErrorStateProps {
  actionLabel?: string;
  className?: string;
  icon?: "circle-alert" | "lock";
  message?: string;
  onAction?: () => void;
  title?: string;
}

const ThotisErrorState = ({
  actionLabel,
  className,
  icon = "circle-alert",
  message,
  onAction,
  title,
}: ThotisErrorStateProps): ReactElement => {
  const { t } = useLocale();
  let messageContent: ReactElement | null = null;
  let actionContent: ReactElement | null = null;

  if (message) {
    messageContent = <p className="mx-auto max-w-md text-sm text-subtle">{message}</p>;
  }

  if (onAction) {
    actionContent = (
      <div className="mt-5">
        <Button color="secondary" onClick={onAction}>
          {actionLabel ?? t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-subtle bg-default px-6 py-10 text-center ${className ?? ""}`}
      role="alert">
      <Icon name={icon} className="mx-auto mb-3 h-10 w-10 text-subtle" />
      <h3 className="mb-2 font-bold text-emphasis text-lg">{title ?? t("thotis_something_wrong")}</h3>
      {messageContent}
      {actionContent}
    </div>
  );
};

export { ThotisErrorState, ThotisLoadingState };
