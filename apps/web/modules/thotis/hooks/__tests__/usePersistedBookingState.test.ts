import dayjs from "@calcom/dayjs";
import { act, renderHook } from "@testing-library/react";
import { usePersistedBookingState } from "../usePersistedBookingState";

describe("usePersistedBookingState", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    expect(result.current.step).toBe("date");
    expect(result.current.selectedDate).toBeNull();
    expect(result.current.selectedSlot).toBeNull();
    expect(result.current.bookingDetails).toEqual({});
    expect(result.current.formValues).toEqual({ name: "", email: "", notes: "" });
  });

  it("should persist step to sessionStorage", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    act(() => {
      result.current.setStep("time");
    });

    const stored = sessionStorage.getItem("thotis_booking_state_profile-123");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.step).toBe("time");
  });

  it("should persist selected date", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));
    const testDate = dayjs("2024-03-15");

    act(() => {
      result.current.setSelectedDate(testDate);
    });

    expect(result.current.selectedDate?.format("YYYY-MM-DD")).toBe("2024-03-15");

    const stored = sessionStorage.getItem("thotis_booking_state_profile-123");
    const parsed = JSON.parse(stored!);
    expect(parsed.selectedDate).toBe("2024-03-15");
  });

  it("should update URL params", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    act(() => {
      result.current.setStep("form");
      result.current.setSelectedDate(dayjs("2024-03-15"));
      result.current.setSelectedSlot("2024-03-15T14:00:00Z");
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("step")).toBe("form");
    expect(params.get("date")).toBe("2024-03-15");
    expect(params.get("slot")).toBe("2024-03-15T14:00:00Z");
  });

  it("should restore state from sessionStorage", () => {
    const initialState = {
      step: "form",
      selectedDate: "2024-03-15",
      selectedSlot: "2024-03-15T14:00:00Z",
      bookingDetails: {},
      formValues: { name: "John Doe", email: "john@example.com", notes: "Test" },
    };

    sessionStorage.setItem("thotis_booking_state_profile-123", JSON.stringify(initialState));

    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    expect(result.current.step).toBe("form");
    expect(result.current.selectedDate?.format("YYYY-MM-DD")).toBe("2024-03-15");
    expect(result.current.selectedSlot).toBe("2024-03-15T14:00:00Z");
    expect(result.current.formValues.name).toBe("John Doe");
  });

  it("should clear state", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    act(() => {
      result.current.setStep("form");
      result.current.setSelectedDate(dayjs("2024-03-15"));
    });

    act(() => {
      result.current.clearState();
    });

    expect(result.current.step).toBe("date");
    expect(result.current.selectedDate).toBeNull();
    expect(sessionStorage.getItem("thotis_booking_state_profile-123")).toBeNull();
  });

  it("should handle form values", () => {
    const { result } = renderHook(() => usePersistedBookingState("profile-123"));

    act(() => {
      result.current.setFormValues({ name: "Jane", email: "jane@example.com" });
    });

    expect(result.current.formValues.name).toBe("Jane");
    expect(result.current.formValues.email).toBe("jane@example.com");
    expect(result.current.formValues.notes).toBe(""); // Should preserve default
  });

  it("should scope state by profile ID", () => {
    const { result: result1 } = renderHook(() => usePersistedBookingState("profile-1"));
    const { result: result2 } = renderHook(() => usePersistedBookingState("profile-2"));

    act(() => {
      result1.current.setStep("time");
      result2.current.setStep("form");
    });

    expect(result1.current.step).toBe("time");
    expect(result2.current.step).toBe("form");

    const stored1 = sessionStorage.getItem("thotis_booking_state_profile-1");
    const stored2 = sessionStorage.getItem("thotis_booking_state_profile-2");

    expect(JSON.parse(stored1!).step).toBe("time");
    expect(JSON.parse(stored2!).step).toBe("form");
  });
});
