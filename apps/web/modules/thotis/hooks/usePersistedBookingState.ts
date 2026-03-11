import type { Dayjs } from "@calcom/dayjs";
import dayjs from "@calcom/dayjs";
import { useEffect, useState } from "react";

type WidgetStep = "loading" | "date" | "time" | "form" | "confirming" | "success" | "error";

interface BookingState {
  step: WidgetStep;
  selectedDate: string | null;
  selectedSlot: string | null;
  bookingDetails: {
    bookingId?: number;
    googleMeetLink?: string;
  };
  formValues: {
    name: string;
    email: string;
    notes: string;
  };
}

const STORAGE_KEY = "thotis_booking_state";

function getInitialState(studentProfileId?: string): BookingState {
  if (typeof window === "undefined") {
    return {
      step: "date",
      selectedDate: null,
      selectedSlot: null,
      bookingDetails: {},
      formValues: { name: "", email: "", notes: "" },
    };
  }

  // Try URL params first (for sharing/deep linking)
  const params = new URLSearchParams(window.location.search);
  const urlStep = params.get("step") as WidgetStep | null;
  const urlDate = params.get("date");
  const urlSlot = params.get("slot");

  // Try sessionStorage
  const stored = sessionStorage.getItem(`${STORAGE_KEY}_${studentProfileId || "default"}`);
  const parsedState: BookingState | null = stored ? JSON.parse(stored) : null;

  // URL params take precedence over sessionStorage
  return {
    step: urlStep || parsedState?.step || "date",
    selectedDate: urlDate || parsedState?.selectedDate || null,
    selectedSlot: urlSlot || parsedState?.selectedSlot || null,
    bookingDetails: parsedState?.bookingDetails || {},
    formValues: parsedState?.formValues || { name: "", email: "", notes: "" },
  };
}

export function usePersistedBookingState(studentProfileId?: string) {
  const [state, setState] = useState<BookingState>(() => getInitialState(studentProfileId));

  // Persist to sessionStorage on state change
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(`${STORAGE_KEY}_${studentProfileId || "default"}`, JSON.stringify(state));
  }, [state, studentProfileId]);

  // Update URL params for shareable state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    // Only persist meaningful state to URL
    if (state.step !== "date") {
      params.set("step", state.step);
    } else {
      params.delete("step");
    }

    if (state.selectedDate) {
      params.set("date", state.selectedDate);
    } else {
      params.delete("date");
    }

    if (state.selectedSlot) {
      params.set("slot", state.selectedSlot);
    } else {
      params.delete("slot");
    }

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [state.step, state.selectedDate, state.selectedSlot]);

  const setStep = (step: WidgetStep) => {
    setState((prev) => ({ ...prev, step }));
  };

  const setSelectedDate = (date: Dayjs | null) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date ? date.format("YYYY-MM-DD") : null,
    }));
  };

  const setSelectedSlot = (slot: string | null) => {
    setState((prev) => ({ ...prev, selectedSlot: slot }));
  };

  const setBookingDetails = (details: { bookingId?: number; googleMeetLink?: string }) => {
    setState((prev) => ({ ...prev, bookingDetails: details }));
  };

  const setFormValues = (values: Partial<BookingState["formValues"]>) => {
    setState((prev) => ({
      ...prev,
      formValues: { ...prev.formValues, ...values },
    }));
  };

  const clearState = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`${STORAGE_KEY}_${studentProfileId || "default"}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
    setState({
      step: "date",
      selectedDate: null,
      selectedSlot: null,
      bookingDetails: {},
      formValues: { name: "", email: "", notes: "" },
    });
  };

  return {
    step: state.step,
    selectedDate: state.selectedDate ? dayjs(state.selectedDate) : null,
    selectedSlot: state.selectedSlot,
    bookingDetails: state.bookingDetails,
    formValues: state.formValues,
    setStep,
    setSelectedDate,
    setSelectedSlot,
    setBookingDetails,
    setFormValues,
    clearState,
  };
}
