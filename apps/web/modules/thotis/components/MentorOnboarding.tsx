"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { Label, TextField, TextAreaField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface MentorOnboardingProps {
  onComplete?: () => void;
}

const profileSchema = z.object({
  university: z.string().min(1, "University is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.nativeEnum(AcademicField, {
    errorMap: () => ({ message: "Please select a valid field of study" }),
  }),
  year: z.coerce.number().int().min(1).max(10),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must not exceed 1000 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const EXPERTISE_OPTIONS = [
  { id: "parcoursup", label: "Parcoursup" },
  { id: "career_advice", label: "Career advice" },
  { id: "university_choice", label: "University choice" },
  { id: "internship", label: "Internship / Alternance" },
  { id: "student_life", label: "Student life" },
  { id: "international", label: "International mobility" },
  { id: "exam_prep", label: "Exam preparation" },
  { id: "research", label: "Research orientation" },
] as const;

const SCHEDULE_OPTIONS = [
  { id: "weekdays", label: "Weekdays", icon: "calendar" as const },
  { id: "weekends", label: "Weekends", icon: "calendar" as const },
  { id: "evenings", label: "Evenings", icon: "moon" as const },
] as const;

export function MentorOnboarding({ onComplete }: MentorOnboardingProps) {
  const { t } = useLocale();
  const [step, setStep] = useState<"profile" | "preferences" | "success">("profile");

  // Step 2 state
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [maxSessionsPerWeek, setMaxSessionsPerWeek] = useState<number>(5);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const createProfile = trpc.thotis.profile.create.useMutation({
    onSuccess: () => {
      setStep("preferences");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const updateProfile = trpc.thotis.profile.update.useMutation({
    onSuccess: () => {
      setStep("success");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const handleProfileSubmit = (data: ProfileForm) => {
    createProfile.mutate({
      university: data.university,
      degree: data.degree,
      fieldOfStudy: data.field,
      yearOfStudy: data.year,
      bio: data.bio,
    });
  };

  const handlePreferencesSubmit = () => {
    if (selectedExpertise.length === 0) {
      showToast(t("thotis_select_at_least_one_expertise"), "error");
      return;
    }

    // Store expertise topics and schedule preferences together
    const expertiseWithSchedule = [
      ...selectedExpertise,
      ...selectedSchedules.map((s) => `schedule:${s}`),
      `max_sessions:${maxSessionsPerWeek}`,
    ];

    updateProfile.mutate({
      expertise: expertiseWithSchedule,
    });
  };

  const toggleExpertise = (id: string) => {
    setSelectedExpertise((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const toggleSchedule = (id: string) => {
    setSelectedSchedules((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  if (step === "success") {
    return (
      <div className="animate-fade-in py-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-emphasis mb-2 text-2xl font-bold">{t("thotis_mentor_onboarding_complete")}</h2>
        <p className="text-subtle mb-6">{t("thotis_mentor_onboarding_success")}</p>
        <Button onClick={() => onComplete?.()} color="primary">
          {t("thotis_go_to_dashboard")}
        </Button>
      </div>
    );
  }

  const progress = step === "profile" ? 50 : 100;
  const stepLabel =
    step === "profile" ? t("thotis_mentor_step1_label") : t("thotis_mentor_step2_label");

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-block rounded-full bg-blue-200 px-2 py-1 text-xs font-semibold uppercase text-blue-600">
            {stepLabel}
          </span>
          <span className="inline-block text-xs font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-200 text-xs">
          <div
            style={{ width: `${progress}%` }}
            className="flex flex-col justify-center whitespace-nowrap bg-blue-600 text-center text-white shadow-none transition-all duration-500"
          />
        </div>
      </div>

      {step === "profile" ? (
        <div className="animate-fade-in rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-bold">{t("thotis_become_mentor")}</h2>
          <p className="text-subtle mb-6 text-sm">{t("thotis_mentor_signup_desc")}</p>

          <form className="space-y-6" onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
            <TextField
              label={t("thotis_university")}
              {...profileForm.register("university")}
              error={profileForm.formState.errors.university?.message}
            />
            <TextField
              label={t("thotis_degree")}
              {...profileForm.register("degree")}
              error={profileForm.formState.errors.degree?.message}
            />
            <div>
              <label className="text-default text-sm font-medium">{t("thotis_field_of_study")}</label>
              <select
                {...profileForm.register("field")}
                className="border-default bg-default mt-1 block w-full rounded-md border p-2 text-sm">
                <option value="">{t("thotis_select_field")}</option>
                {Object.values(AcademicField).map((f) => (
                  <option key={f} value={f}>
                    {t(`thotis_field_${f.toLowerCase()}`)}
                  </option>
                ))}
              </select>
              {profileForm.formState.errors.field && (
                <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.field.message}</p>
              )}
            </div>
            <TextField
              label={t("thotis_year_of_study")}
              type="number"
              {...profileForm.register("year")}
              error={profileForm.formState.errors.year?.message}
            />
            <TextAreaField label={t("thotis_bio")} {...profileForm.register("bio")} />

            <Button type="submit" color="primary" className="w-full" loading={createProfile.isPending}>
              {t("continue")}
            </Button>
          </form>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          {/* Expertise Section */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <Icon name="book-open" className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t("thotis_mentor_expertise_title")}</h3>
                <p className="text-sm text-gray-500">{t("thotis_mentor_expertise_desc")}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleExpertise(option.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedExpertise.includes(option.id)
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-400"
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2">
                <Icon name="clock" className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("thotis_mentor_availability_title")}
                </h3>
                <p className="text-sm text-gray-500">{t("thotis_mentor_availability_desc")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{t("thotis_mentor_preferred_times")}</Label>
                <div className="mt-2 flex gap-4">
                  {SCHEDULE_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSchedules.includes(opt.id)}
                        onChange={() => toggleSchedule(opt.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>{t("thotis_mentor_max_sessions")}</Label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={maxSessionsPerWeek}
                    onChange={(e) => setMaxSessionsPerWeek(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {maxSessionsPerWeek}/week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              color="primary"
              onClick={handlePreferencesSubmit}
              className="flex-1"
              loading={updateProfile.isPending}>
              {t("thotis_complete_setup")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
