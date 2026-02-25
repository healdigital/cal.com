import { useState } from "react";
import { useForm } from "react-hook-form";

import { intentApi, mentorsApi } from "../api/client";
import type { AcademicField, OrientationIntent, ScoredMentor } from "../types";

const FIELDS: { value: AcademicField; label: string }[] = [
  { value: "DROIT", label: "Droit" },
  { value: "ECONOMIE_GESTION", label: "Économie & Gestion" },
  { value: "SCIENCES_POLITIQUES", label: "Sciences Politiques" },
  { value: "INFORMATIQUE", label: "Informatique" },
  { value: "INGENIERIE", label: "Ingénierie" },
  { value: "SANTE", label: "Santé" },
  { value: "SCIENCES", label: "Sciences" },
  { value: "LETTRES_LANGUES", label: "Lettres & Langues" },
  { value: "ARTS", label: "Arts" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "SPORT", label: "Sport" },
  { value: "AUTRE", label: "Autre" },
];

const LEVELS = [
  { value: "TERMINALE", label: "Terminale" },
  { value: "PREPA", label: "Prépa" },
  { value: "BACHELOR", label: "Licence / Bachelor" },
];

const GOALS = [
  "Comprendre les formations",
  "Choisir mon orientation",
  "Préparer mes candidatures",
  "Découvrir un métier",
  "Obtenir des conseils",
  "Autre",
];

interface OrientationFormProps {
  onComplete?: (recommendations: ScoredMentor[]) => void;
}

export function OrientationForm({ onComplete }: OrientationFormProps) {
  const [step, setStep] = useState<"form" | "loading" | "done">("form");
  const { register, handleSubmit, formState: { errors } } = useForm<OrientationIntent>({
    defaultValues: {
      targetFields: [],
      academicLevel: "",
      zone: "",
      goals: [],
    },
  });

  const onSubmit = async (data: OrientationIntent) => {
    setStep("loading");
    try {
      // Save to localStorage for persistence across pages
      try {
        localStorage.setItem("thotis_intent", JSON.stringify(data));
      } catch {
        // Storage full or disabled — continue without persisting
      }

      const result = await intentApi.submitAndGetRecommendations(data);
      onComplete?.(result.recommendations);
      setStep("done");
    } catch {
      setStep("form");
    }
  };

  if (step === "loading") {
    return (
      <div className="th-flex th-items-center th-justify-center th-py-12">
        <div className="th-h-8 th-w-8 th-animate-spin th-rounded-full th-border-2 th-border-thotis-gray-200 th-border-t-thotis-blue" />
        <span className="th-ml-3 th-text-thotis-gray-600">Recherche de mentors...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="th-space-y-6">
      <div>
        <h3 className="th-text-lg th-font-heading th-font-semibold th-text-thotis-gray-900">
          Quel domaine t&apos;intéresse ?
        </h3>
        <div className="th-mt-3 th-grid th-grid-cols-2 th-gap-2 sm:th-grid-cols-3">
          {FIELDS.map((field) => (
            <label
              key={field.value}
              className="th-flex th-cursor-pointer th-items-center th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2 th-text-sm hover:th-border-thotis-blue hover:th-bg-blue-50 has-[:checked]:th-border-thotis-blue has-[:checked]:th-bg-blue-50"
            >
              <input
                type="checkbox"
                value={field.value}
                {...register("targetFields", { required: "Choisis au moins un domaine" })}
                className="th-mr-2"
              />
              {field.label}
            </label>
          ))}
        </div>
        {errors.targetFields && (
          <p className="th-mt-1 th-text-sm th-text-red-600">{errors.targetFields.message}</p>
        )}
      </div>

      <div>
        <h3 className="th-text-lg th-font-heading th-font-semibold th-text-thotis-gray-900">
          Ton niveau actuel
        </h3>
        <div className="th-mt-3 th-flex th-gap-3">
          {LEVELS.map((level) => (
            <label
              key={level.value}
              className="th-flex-1 th-cursor-pointer th-rounded-lg th-border th-border-thotis-gray-200 th-py-3 th-text-center th-text-sm hover:th-border-thotis-blue has-[:checked]:th-border-thotis-blue has-[:checked]:th-bg-blue-50"
            >
              <input
                type="radio"
                value={level.value}
                {...register("academicLevel", { required: "Choisis ton niveau" })}
                className="th-sr-only"
              />
              {level.label}
            </label>
          ))}
        </div>
        {errors.academicLevel && (
          <p className="th-mt-1 th-text-sm th-text-red-600">{errors.academicLevel.message}</p>
        )}
      </div>

      <div>
        <h3 className="th-text-lg th-font-heading th-font-semibold th-text-thotis-gray-900">
          Tes objectifs
        </h3>
        <div className="th-mt-3 th-flex th-flex-wrap th-gap-2">
          {GOALS.map((goal) => (
            <label
              key={goal}
              className="th-cursor-pointer th-rounded-full th-border th-border-thotis-gray-200 th-px-4 th-py-1.5 th-text-sm hover:th-border-thotis-orange has-[:checked]:th-border-thotis-orange has-[:checked]:th-bg-orange-50"
            >
              <input
                type="checkbox"
                value={goal}
                {...register("goals")}
                className="th-sr-only"
              />
              {goal}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="th-w-full th-rounded-lg th-bg-thotis-orange th-px-6 th-py-3 th-font-heading th-font-semibold th-text-white th-transition-colors hover:th-bg-thotis-orange-dark"
      >
        Trouver mon mentor
      </button>
    </form>
  );
}
