"use client";

import type { OrientationIntentData } from "@calcom/features/thotis/components/OrientationIntentForm";
import { OrientationIntentForm } from "@calcom/features/thotis/components/OrientationIntentForm";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Form, Label, Switch, TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface StudentOnboardingProps {
  onComplete?: () => void;
}

export function StudentOnboarding({ onComplete }: StudentOnboardingProps) {
  const { t } = useLocale();
  const [step, setStep] = useState<"account" | "intent" | "success">("account");
  const _utils = trpc.useUtils();

  const { data: me } = trpc.viewer.me.get.useQuery();

  const updateProfileMutation = trpc.viewer.me.updateProfile.useMutation({
    onSuccess: () => {
      setStep("intent");
    },
    onError: (err) => {
      showToast(err.message, "error");
    },
  });

  const upsertIntentMutation = trpc.thotis.intent.upsert.useMutation({
    onSuccess: () => {
      setStep("success");
    },
    onError: (err) => {
      showToast(err.message, "error");
    },
  });

  const accountForm = useForm({
    defaultValues: {
      name: me?.name || "",
    },
  });

  const [marketingConsent, setMarketingConsent] = useState(false);

  const updateStudentPreferencesMutation = trpc.thotis.profile.updatePreferences.useMutation();

  const handleAccountSubmit = (data: { name: string }) => {
    // Persist marketing consent alongside profile update
    if (marketingConsent) {
      updateStudentPreferencesMutation.mutate({ marketingConsent: true });
    }
    updateProfileMutation.mutate({
      name: data.name,
    });
  };

  const handleIntentSubmit = (data: OrientationIntentData) => {
    upsertIntentMutation.mutate(data);
  };

  if (step === "success") {
    return (
      <div className="animate-fade-in py-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 font-bold text-2xl text-gray-900">{t("thotis_onboarding_welcome")}</h2>
        <p className="mb-6 text-gray-600">{t("thotis_onboarding_success")}</p>
        <Button onClick={() => onComplete?.()} color="primary">
          {t("thotis_go_to_dashboard")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-block rounded-full bg-blue-200 px-2 py-1 font-semibold text-blue-600 text-xs uppercase">
            {step === "account" ? "Step 1: Account setup" : "Step 2: Orientation preferences"}
          </span>
          <span className="inline-block font-semibold text-blue-600 text-xs">
            {step === "account" ? "50%" : "100%"}
          </span>
        </div>
        <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-200 text-xs">
          <div
            style={{ width: step === "account" ? "50%" : "100%" }}
            className="flex flex-col justify-center whitespace-nowrap bg-blue-600 text-center text-white shadow-none transition-all duration-500"></div>
        </div>
      </div>

      {step === "account" ? (
        <div className="animate-fade-in rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-bold text-xl">{t("thotis_complete_account")}</h2>
          <Form form={accountForm} handleSubmit={handleAccountSubmit} className="space-y-6">
            <div>
              <Label>{t("name")}</Label>
              <TextField {...accountForm.register("name", { required: true })} placeholder="Your full name" />
            </div>

            <div className="border-gray-100 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t("thotis_marketing_consent")}</p>
                  <p className="text-gray-500 text-xs">{t("thotis_marketing_consent_desc")}</p>
                </div>
                <Switch checked={marketingConsent} onCheckedChange={setMarketingConsent} />
              </div>
            </div>

            <div className="pt-4 text-gray-400 text-xs">{t("thotis_gdpr_note")}</div>

            <Button type="submit" loading={updateProfileMutation.isPending} className="w-full">
              {t("continue")}
            </Button>
          </Form>
        </div>
      ) : (
        <div className="animate-fade-in">
          <OrientationIntentForm onSubmit={handleIntentSubmit} isPending={upsertIntentMutation.isPending} />
        </div>
      )}
    </div>
  );
}
