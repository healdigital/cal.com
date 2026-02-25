"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { TextField, TextAreaField } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import { showToast } from "@calcom/ui/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const mentorSettingsSchema = z.object({
  university: z.string().min(1, "University is required"),
  degree: z.string().min(1, "Degree is required"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must not exceed 1000 characters"),
  fieldOfStudy: z.nativeEnum(AcademicField),
  yearOfStudy: z.coerce.number().int().min(1).max(10),
  expertise: z.string().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
});

type MentorSettingsForm = z.infer<typeof mentorSettingsSchema>;

export const MentorSettingsClient = () => {
  const { t } = useLocale();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.thotis.profile.get.useQuery();

  const updateProfile = trpc.thotis.profile.update.useMutation({
    onSuccess: () => {
      utils.thotis.profile.get.invalidate();
      showToast(t("thotis_profile_updated"), "success");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<MentorSettingsForm>({
    resolver: zodResolver(mentorSettingsSchema),
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (profile) {
      reset({
        university: profile.university,
        degree: profile.degree,
        bio: profile.bio || "",
        fieldOfStudy: profile.field as AcademicField,
        yearOfStudy: profile.currentYear,
        expertise: profile.expertise?.join(", ") || "",
        linkedInUrl: profile.linkedInUrl || "",
        isActive: profile.isActive,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: MentorSettingsForm) => {
    const expertiseArray = data.expertise
      ? data.expertise
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean)
      : undefined;

    updateProfile.mutate({
      university: data.university,
      degree: data.degree,
      bio: data.bio,
      fieldOfStudy: data.fieldOfStudy,
      yearOfStudy: data.yearOfStudy,
      expertise: expertiseArray,
      isActive: data.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-emphasis h-10 w-10 animate-spin rounded-full border-b-2 border-t-2" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 text-center">
        <Icon name="user" className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-emphasis">{t("thotis_no_profile")}</h2>
        <p className="mb-6 text-subtle">{t("thotis_create_profile_first")}</p>
        <Button color="primary" onClick={() => router.push("/thotis/mentor/signup")}>
          {t("thotis_become_mentor")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/thotis/mentor-dashboard")}
            className="mb-2 flex items-center text-sm text-subtle hover:text-emphasis">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("back_to_dashboard")}
          </button>
          <h1 className="text-2xl font-bold text-emphasis">{t("thotis_profile_settings")}</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Availability Toggle */}
        <div className="rounded-lg border border-subtle bg-default p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-emphasis">{t("thotis_availability_status")}</h3>
              <p className="text-xs text-subtle">
                {isActive ? t("thotis_profile_visible") : t("thotis_profile_hidden")}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                {...register("isActive")}
                onChange={(e) => setValue("isActive", e.target.checked, { shouldDirty: true })}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-lg border border-subtle bg-default p-6">
          <h3 className="mb-4 text-lg font-semibold text-emphasis">{t("thotis_academic_info")}</h3>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label={t("thotis_university")}
              {...register("university")}
              error={errors.university?.message}
            />
            <TextField
              label={t("thotis_degree")}
              {...register("degree")}
              error={errors.degree?.message}
            />

            <div>
              <label className="font-medium text-default text-sm">{t("thotis_field_of_study")}</label>
              <select
                {...register("fieldOfStudy")}
                className="mt-1 block w-full rounded-md border border-default bg-default p-2 text-sm">
                {Object.values(AcademicField).map((f) => (
                  <option key={f} value={f}>
                    {t(`thotis_field_${f.toLowerCase()}`)}
                  </option>
                ))}
              </select>
              {errors.fieldOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy.message}</p>
              )}
            </div>

            <TextField
              label={t("thotis_year_of_study")}
              type="number"
              {...register("yearOfStudy")}
              error={errors.yearOfStudy?.message}
            />

            <div>
              <TextAreaField
                label={t("thotis_bio")}
                {...register("bio")}
              />
              {errors.bio?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <TextField
              label={t("thotis_expertise")}
              placeholder={t("thotis_expertise_placeholder")}
              {...register("expertise")}
            />

            <TextField
              label={t("thotis_linkedin_url")}
              placeholder="https://linkedin.com/in/your-profile"
              {...register("linkedInUrl")}
              error={errors.linkedInUrl?.message}
            />

            <Button
              type="submit"
              color="primary"
              loading={updateProfile.isPending}
              disabled={!isDirty}>
              {t("save")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
