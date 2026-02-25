import { addDays, format, isWeekend } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { analyticsApi } from "../api/client";
import { useAvailability } from "../hooks/useAvailability";
import { useCreateBooking } from "../hooks/useBooking";
import type { BookingResult, TimeSlot } from "../types";
import { LoadingSpinner } from "./common/LoadingSpinner";

type Step = "date" | "time" | "form" | "confirming" | "success" | "error";

interface BookingWidgetProps {
  profileId: string;
  mentorName: string;
}

interface BookingFormData {
  name: string;
  email: string;
  question: string;
}

export function BookingWidget({ profileId, mentorName }: BookingWidgetProps) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: availabilityData, isPending: loadingSlots } = useAvailability(profileId, selectedDate);
  const createBooking = useCreateBooking();

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  // Generate next 14 weekdays
  const dates = useMemo(() => {
    const result: Date[] = [];
    let d = new Date();
    while (result.length < 14) {
      d = addDays(d, 1);
      if (!isWeekend(d)) result.push(new Date(d));
    }
    return result;
  }, []);

  const availableSlots = useMemo(() => {
    if (!availabilityData?.slots) return [];
    return availabilityData.slots.filter((s) => s.available);
  }, [availabilityData]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("time");
    analyticsApi.track({ eventType: "booking_started", profileId });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedSlot) return;

    setStep("confirming");
    setErrorMsg("");

    try {
      const res = await createBooking.mutateAsync({
        studentProfileId: profileId,
        dateTime: selectedSlot.start,
        prospectiveStudent: {
          name: data.name,
          email: data.email,
          question: data.question || undefined,
        },
      });
      setResult(res);
      setStep("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue");
      setStep("error");
    }
  };

  return (
    <div className="th-rounded-xl th-border th-border-thotis-gray-200 th-bg-white th-p-6 th-shadow-sm">
      <h3 className="th-font-heading th-text-lg th-font-semibold th-text-thotis-gray-900">
        Réserver une session
      </h3>
      <p className="th-mt-1 th-text-sm th-text-thotis-gray-500">
        15 minutes en visio avec {mentorName}
      </p>

      {/* Step: Date selection */}
      {step === "date" && (
        <div className="th-mt-4 th-space-y-2">
          <p className="th-text-sm th-font-medium th-text-thotis-gray-700">Choisis une date</p>
          <div className="th-grid th-grid-cols-3 th-gap-2">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateSelect(date)}
                className="th-rounded-lg th-border th-border-thotis-gray-200 th-px-2 th-py-2 th-text-center th-text-sm th-transition-colors hover:th-border-thotis-blue hover:th-bg-blue-50"
              >
                <span className="th-block th-text-xs th-text-thotis-gray-500">
                  {format(date, "EEE", { locale: fr })}
                </span>
                <span className="th-font-semibold">{format(date, "d MMM", { locale: fr })}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Time selection */}
      {step === "time" && selectedDate && (
        <div className="th-mt-4 th-space-y-2">
          <div className="th-flex th-items-center th-justify-between">
            <p className="th-text-sm th-font-medium th-text-thotis-gray-700">
              Créneaux du {format(selectedDate, "d MMMM", { locale: fr })}
            </p>
            <button
              type="button"
              onClick={() => setStep("date")}
              className="th-text-xs th-text-thotis-blue hover:th-underline"
            >
              Changer
            </button>
          </div>

          {loadingSlots && <LoadingSpinner size="sm" />}

          {!loadingSlots && availableSlots.length === 0 && (
            <p className="th-py-4 th-text-center th-text-sm th-text-thotis-gray-500">
              Aucun créneau disponible ce jour. Essayez une autre date.
            </p>
          )}

          <div className="th-grid th-grid-cols-3 th-gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => handleSlotSelect(slot)}
                className="th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2 th-text-sm th-font-medium th-transition-colors hover:th-border-thotis-orange hover:th-bg-orange-50"
              >
                {format(new Date(slot.start), "HH:mm")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Student form */}
      {step === "form" && selectedSlot && (
        <form onSubmit={handleSubmit(onSubmit)} className="th-mt-4 th-space-y-3">
          <div className="th-flex th-items-center th-justify-between">
            <p className="th-text-sm th-text-thotis-gray-600">
              {selectedDate && format(selectedDate, "d MMMM", { locale: fr })} à{" "}
              {format(new Date(selectedSlot.start), "HH:mm")}
            </p>
            <button
              type="button"
              onClick={() => setStep("time")}
              className="th-text-xs th-text-thotis-blue hover:th-underline"
            >
              Changer
            </button>
          </div>

          <input
            {...register("name", { required: "Ton prénom est requis" })}
            placeholder="Ton prénom"
            className="th-w-full th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue"
          />
          {errors.name && <p className="th-text-xs th-text-red-600">{errors.name.message}</p>}

          <input
            {...register("email", {
              required: "Ton email est requis",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide" },
            })}
            type="email"
            placeholder="Ton email"
            className="th-w-full th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue"
          />
          {errors.email && <p className="th-text-xs th-text-red-600">{errors.email.message}</p>}

          <textarea
            {...register("question")}
            placeholder="Ta question pour le mentor (facultatif)"
            rows={3}
            className="th-w-full th-resize-none th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue"
          />

          <button
            type="submit"
            className="th-w-full th-rounded-lg th-bg-thotis-orange th-py-3 th-font-heading th-font-semibold th-text-white th-transition-colors hover:th-bg-thotis-orange-dark"
          >
            Confirmer la réservation
          </button>
        </form>
      )}

      {/* Step: Confirming */}
      {step === "confirming" && (
        <div className="th-mt-6 th-flex th-flex-col th-items-center th-py-8">
          <LoadingSpinner size="md" />
          <p className="th-mt-3 th-text-sm th-text-thotis-gray-600">Réservation en cours...</p>
        </div>
      )}

      {/* Step: Success */}
      {step === "success" && result && (
        <div className="th-mt-4 th-space-y-4 th-text-center">
          <div className="th-mx-auto th-flex th-h-16 th-w-16 th-items-center th-justify-center th-rounded-full th-bg-green-100">
            <span className="th-text-3xl">&#10003;</span>
          </div>
          <h4 className="th-font-heading th-text-lg th-font-semibold th-text-thotis-gray-900">
            Session réservée !
          </h4>
          <p className="th-text-sm th-text-thotis-gray-600">
            Un email de confirmation a été envoyé. Tu recevras un rappel avant ta session.
          </p>
          {result.googleMeetLink && (
            <a
              href={result.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="th-inline-block th-rounded-lg th-bg-thotis-blue th-px-6 th-py-2 th-text-sm th-font-medium th-text-white hover:th-bg-thotis-blue-dark"
            >
              Lien Google Meet
            </a>
          )}
        </div>
      )}

      {/* Step: Error */}
      {step === "error" && (
        <div className="th-mt-4 th-space-y-3 th-text-center">
          <p className="th-text-sm th-text-red-600">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setStep("form")}
            className="th-rounded th-bg-thotis-blue th-px-4 th-py-2 th-text-sm th-text-white"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
