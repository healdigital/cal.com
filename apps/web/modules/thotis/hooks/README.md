# Thotis Booking State Persistence

## Overview

The `usePersistedBookingState` hook provides automatic state persistence for the booking widget, ensuring that user progress is preserved across page refreshes and browser navigation.

## Features

- **SessionStorage Persistence**: Automatically saves booking state to sessionStorage
- **URL State Sync**: Syncs key state (step, date, slot) to URL parameters for shareable links
- **Automatic Restoration**: Restores state on component mount
- **Profile-Scoped**: Each student profile has its own isolated state
- **Auto-Cleanup**: Clears state after successful booking (5s delay)

## Usage

```typescript
import { usePersistedBookingState } from "../hooks/usePersistedBookingState";

const {
  step,
  selectedDate,
  selectedSlot,
  bookingDetails,
  formValues,
  setStep,
  setSelectedDate,
  setSelectedSlot,
  setBookingDetails,
  setFormValues,
  clearState,
} = usePersistedBookingState(studentProfileId);
```

## State Structure

```typescript
{
  step: "date" | "time" | "form" | "confirming" | "success" | "error",
  selectedDate: string | null,  // ISO date format (YYYY-MM-DD)
  selectedSlot: string | null,  // ISO datetime string
  bookingDetails: {
    bookingId?: number,
    googleMeetLink?: string
  },
  formValues: {
    name: string,
    email: string,
    notes: string
  }
}
```

## URL Parameters

The hook automatically syncs these parameters to the URL:
- `step`: Current booking step (omitted if "date")
- `date`: Selected date in YYYY-MM-DD format
- `slot`: Selected time slot in ISO format

Example: `/booking?step=form&date=2024-03-15&slot=2024-03-15T14:00:00Z`

## Storage Key

State is stored in sessionStorage with the key pattern:
```
thotis_booking_state_{studentProfileId}
```

## Behavior

1. **On Mount**: Checks URL params first, then sessionStorage
2. **On State Change**: Updates both sessionStorage and URL
3. **On Success**: Auto-clears after 5 seconds
4. **Manual Clear**: Call `clearState()` to reset everything

## Security

- URL parameters are sanitized to prevent XSS
- SessionStorage is scoped per browser tab
- State is profile-specific to prevent cross-contamination
