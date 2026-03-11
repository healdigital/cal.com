"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";

interface ThotisLoadingStateProps {
  className?: string;
  label?: string;
  spinnerClassName?: string;
}

export const ThotisLoadingState = ({
  className,
  label,
  spinnerClassName,
}: ThotisLoadingStateProps) => {
  const { t } = useLocale();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className ?? "py-12"}`}
      role="status"
      aria-label={label ?? t("loading")}>
      <div
        className={`h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emphasis ${
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

export const ThotisErrorState = ({
  actionLabel,
  className,
  icon = "circle-alert",
  message,
  onAction,
  title,
}: ThotisErrorStateProps) => {
  const { t } = useLocale();

  return (
    <div
      className={`rounded-lg border border-subtle bg-default px-6 py-10 text-center ${className ?? ""}`}
      role="alert">
      <Icon name={icon} className="mx-auto mb-3 h-10 w-10 text-subtle" />
      <h3 className="mb-2 text-lg font-bold text-emphasis">{title ?? t("thotis_something_wrong")}</h3>
      {message ? <p className="mx-auto max-w-md text-sm text-subtle">{message}</p> : null}
      {onAction ? (
        <div className="mt-5">
          <Button color="secondary" onClick={onAction}>
            {actionLabel ?? t("retry")}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
