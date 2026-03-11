"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicFieldSchema } from "@calcom/prisma/zod/inputTypeSchemas/AcademicFieldSchema";
import { Button } from "@calcom/ui/components/button";
import { Label, Select } from "@calcom/ui/components/form";
import { Icon } from "@calcom/ui/components/icon";
import { useState } from "react";

// Derived from Prisma AcademicField enum — single source of truth
const FIELD_LABELS: Record<string, string> = {
  LAW: "thotis_field_law",
  MEDICINE: "thotis_field_medicine",
  ENGINEERING: "thotis_field_engineering",
  BUSINESS: "thotis_field_business",
  COMPUTER_SCIENCE: "thotis_field_computer_science",
  PSYCHOLOGY: "thotis_field_psychology",
  EDUCATION: "thotis_field_education",
  ARTS: "thotis_field_arts",
  SCIENCES: "thotis_field_sciences",
  POLITICAL_SCIENCE: "thotis_field_political_science",
  ECONOMICS: "thotis_field_economics",
  LANGUAGES: "thotis_field_languages",
  OTHER: "thotis_field_other",
};

const fields = AcademicFieldSchema.options.map((value) => ({
  value,
  labelKey: FIELD_LABELS[value] || value.replace(/_/g, " "),
}));

export interface OrientationIntentData {
  targetFields: string[];
  academicLevel: string;
  zone: string;
  goals: string[];
  scheduleConstraints: {
    preferredTimes: string[];
  };
}

interface OrientationIntentFormProps {
  onSubmit: (data: OrientationIntentData) => void;
  isPending?: boolean;
}

const goalsOptions = [
  { value: "Parcoursup help", labelKey: "thotis_goal_parcoursup_help" },
  { value: "Career advice", labelKey: "thotis_goal_career_advice" },
  { value: "University choice", labelKey: "thotis_goal_university_choice" },
  { value: "Internship/Alternance", labelKey: "thotis_goal_internship_alternance" },
  { value: "Student life", labelKey: "thotis_goal_student_life" },
  { value: "International mobility", labelKey: "thotis_goal_international_mobility" },
] as const;

const scheduleOptions = [
  { id: "weekdays", labelKey: "thotis_schedule_weekdays" },
  { id: "weekends", labelKey: "thotis_schedule_weekends" },
  { id: "evenings", labelKey: "thotis_schedule_evenings" },
] as const;

const academicLevelOptions = [
  { value: "TERMINALE", labelKey: "thotis_high_school_terminale" },
  { value: "PREPA", labelKey: "thotis_preparatory_class" },
  { value: "BACHELOR", labelKey: "thotis_bachelor" },
] as const;

export function OrientationIntentForm({ onSubmit, isPending }: OrientationIntentFormProps) {
  const { t } = useLocale();
  const [field, setField] = useState<{ value: string; label: string } | null>(null);
  const [level, setLevel] = useState<{ value: string; label: string } | null>(null);
  const [zone, setZone] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const toggleSchedule = (id: string) => {
    setSelectedSchedules((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      targetFields: field ? [field.value] : [],
      academicLevel: level?.value || "",
      zone: zone,
      goals: selectedGoals,
      scheduleConstraints: {
        preferredTimes: selectedSchedules,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 mx-auto max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icon name="search" className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{t("thotis_find_your_perfect_match")}</h3>
          <p className="text-sm text-gray-500">{t("thotis_tell_us_what_you_are_looking_for")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>{t("thotis_target_field")}</Label>
            <Select
              options={fields.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
              value={field}
              onChange={(val) => setField(val)}
              placeholder={t("thotis_select_field")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("thotis_academic_level")}</Label>
            <Select
              options={academicLevelOptions.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
              value={level}
              onChange={(val) => setLevel(val)}
              placeholder={t("thotis_select_academic_level")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("thotis_zone_region")}</Label>
            <input
              type="text"
              className="flex h-9 w-full rounded-md border border-default bg-default px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t("thotis_zone_region_placeholder")}
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("thotis_goals")}</Label>
            <div className="flex flex-wrap gap-2">
              {goalsOptions.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => toggleGoal(goal.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    selectedGoals.includes(goal.value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}>
                  {t(goal.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("thotis_schedule_preference")}</Label>
            <div className="flex gap-4">
              {scheduleOptions.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSchedules.includes(opt.id)}
                    onChange={() => toggleSchedule(opt.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{t(opt.labelKey)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" loading={isPending} className="w-full" size="lg">
          {t("thotis_find_mentors")}
        </Button>
      </form>
    </div>
  );
}
