"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { TextField, TextAreaField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const mentorSignupSchema = z.object({
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

type MentorSignupForm = z.infer<typeof mentorSignupSchema>;

export default function MentorSignupPage() {
  const { t } = useLocale();
  const router = useRouter();

  // Check if user already has a profile - redirect if so
  const { data: existingProfile, isLoading: isCheckingProfile } = trpc.thotis.profile.get.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (existingProfile) {
      router.replace("/thotis/mentor-dashboard");
    }
  }, [existingProfile, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MentorSignupForm>({
    resolver: zodResolver(mentorSignupSchema),
  });

  const createProfile = trpc.thotis.profile.create.useMutation({
    onSuccess: () => {
      showToast(t("thotis_profile_created"), "success");
      router.push("/thotis/mentor-dashboard");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const onSubmit = (data: MentorSignupForm) => {
    createProfile.mutate({
      university: data.university,
      degree: data.degree,
      fieldOfStudy: data.field,
      yearOfStudy: data.year,
      bio: data.bio,
    });
  };

  // Show loading while checking existing profile
  if (isCheckingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    );
  }

  // Don't render form if profile exists (redirect is in progress)
  if (existingProfile) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h2 className="font-extrabold text-3xl text-gray-900">{t("thotis_become_mentor")}</h2>
          <p className="mt-2 text-gray-600 text-sm">{t("thotis_mentor_signup_desc")}</p>
        </div>

        <div className="mt-8 rounded-lg border border-subtle bg-default p-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label={t("thotis_university")}
              {...register("university")}
              error={errors.university?.message}
            />
            <TextField label={t("thotis_degree")} {...register("degree")} error={errors.degree?.message} />
            <div>
              <label className="font-medium text-default text-sm">{t("thotis_field_of_study")}</label>
              <select
                {...register("field")}
                className="mt-1 block w-full rounded-md border border-default bg-default p-2 text-sm">
                <option value="">{t("thotis_select_field")}</option>
                {Object.values(AcademicField).map((f) => (
                  <option key={f} value={f}>
                    {t(`thotis_field_${f.toLowerCase()}`)}
                  </option>
                ))}
              </select>
              {errors.field && <p className="mt-1 text-red-600 text-sm">{errors.field.message}</p>}
            </div>
            <TextField
              label={t("thotis_year_of_study")}
              type="number"
              {...register("year")}
              error={errors.year?.message}
            />
            <TextAreaField label={t("thotis_bio")} {...register("bio")} />

            <Button type="submit" color="primary" className="w-full" loading={createProfile.isPending}>
              {t("thotis_submit_application")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
