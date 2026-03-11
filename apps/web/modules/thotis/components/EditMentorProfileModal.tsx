"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Label, Select, TextField } from "@calcom/ui/components/form";
import { showToast } from "@calcom/ui/components/toast";
import { useEffect, useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditMentorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    bio: string | null;
    university: string | null;
    degree: string | null;
    field: string | null;
    expertise: string[];
    currentYear: number | null;
  } | null;
}

interface FormValues {
  bio: string;
  university: string;
  degree: string;
  field: AcademicField;
  expertise: string[];
  currentYear: number;
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-md border border-subtle bg-default px-2 py-1.5 focus-within:ring-2 focus-within:ring-brand-default"
      onClick={() => inputRef.current?.focus()}>
      {value.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-0.5 text-xs font-medium text-default">
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="text-subtle hover:text-emphasis"
            aria-label={`Remove ${tag}`}>
            &times;
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addTag(inputValue);
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}

export function EditMentorProfileModal({ isOpen, onClose, profile }: EditMentorProfileModalProps) {
  const { t } = useLocale();
  const utils = trpc.useUtils();

  const { register, handleSubmit, control, reset } = useForm<FormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || "",
        university: profile.university || "",
        degree: profile.degree || "",
        field: (profile.field as AcademicField) || AcademicField.SCIENCES,
        expertise: profile.expertise || [],
        currentYear: profile.currentYear || 1,
      });
    }
  }, [profile, reset]);

  const mutation = trpc.thotis.admin.updateMentorProfile.useMutation({
    onSuccess: () => {
      showToast(t("thotis_admin_profile_updated"), "success");
      utils.thotis.admin.listAmbassadors.invalidate();
      onClose();
    },
    onError: (error) => {
      showToast(`${t("thotis_admin_error")}: ${error.message}`, "error");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!profile) return;
    mutation.mutate({
      profileId: profile.id,
      bio: data.bio || undefined,
      university: data.university || undefined,
      degree: data.degree || undefined,
      field: data.field,
      expertise: data.expertise.filter(Boolean),
      currentYear: data.currentYear,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader title={t("thotis_admin_edit_mentor_profile")} />
        <form className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label>{t("thotis_admin_bio")}</Label>
            <textarea
              className="w-full rounded-md border border-subtle bg-default p-2 text-sm"
              rows={3}
              {...register("bio")}
            />
          </div>

          <TextField label={t("thotis_admin_university")} {...register("university")} />
          <TextField label={t("thotis_admin_degree")} {...register("degree")} />

          <Controller
            name="field"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label>{t("thotis_admin_field")}</Label>
                <Select
                  value={{ label: field.value, value: field.value }}
                  options={Object.values(AcademicField).map((f) => ({ label: f, value: f }))}
                  onChange={(opt) => field.onChange(opt?.value)}
                />
              </div>
            )}
          />

          <TextField
            label={t("thotis_admin_expertise_hint")}
            {...register("expertise")}
            placeholder="e.g. Droit civil, Droit p\u00e9nal, Contentieux"
          />

          <TextField
            label={t("thotis_admin_study_year")}
            type="number"
            {...register("currentYear", { valueAsNumber: true })}
          />

          <DialogFooter>
            <Button onClick={onClose} color="secondary" type="button">
              {t("cancel")}
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
