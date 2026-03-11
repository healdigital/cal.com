"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import type { AppRouter } from "@calcom/trpc/server/routers/_app";
import { Button } from "@calcom/ui/components/button";
import { TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { ReactElement } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface GuestMagicLinkFormValues {
  email: string;
}

export function GuestMagicLinkForm(): ReactElement {
  const { i18n, t } = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestMagicLinkFormValues>();

  const mutation = trpc.thotis.guest.requestInboxLink.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      showToast(t("thotis_magic_link_sent"), "success");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      showToast(error.message, "error");
    },
  });

  const onSubmit = (data: GuestMagicLinkFormValues): void => {
    mutation.mutate({
      ...data,
      locale: i18n.language,
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 font-bold text-xl">{t("thotis_check_your_email")}</h2>
        <p className="text-gray-600">{t("thotis_magic_link_sent_desc")}</p>
        <Button className="mt-6" color="minimal" onClick={(): void => setIsSubmitted(false)}>
          {t("thotis_try_another_email")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="mb-4 font-bold text-xl">{t("thotis_guest_access")}</h2>
      <p className="mb-6 text-gray-600 text-sm">{t("thotis_guest_access_desc")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label={t("email")}
          type="email"
          placeholder="your@email.com"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-500 text-xs">{t("email_required")}</p>}
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          {t("thotis_request_magic_link")}
        </Button>
      </form>
    </div>
  );
}
