# Personal Settings

**Route:** `/getting-started/settings`
**Type:** Authenticated
**Parent Layout:** Onboarding Layout (Getting Started Wizard - Step 4)

## Description
Onboarding step where users configure their personal scheduling preferences. Includes time format selection (12-hour or 24-hour), week start day, and default event duration. These settings affect how time is displayed across the app and set defaults for new event types.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    (✓)───────(✓)───────(✓)───────(●)───────(○)                  │
│   Profile  Calendar  Avail.   Settings  Complete                │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │            Personal Preferences                       │     │
│   │    Customize how Cal.com works for you.               │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Time Format                                        │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │                                               │   │     │
│   │   │   ┌─────────────────┐ ┌─────────────────┐    │   │     │
│   │   │   │                 │ │                 │    │   │     │
│   │   │   │    12 hour      │ │    24 hour      │    │   │     │
│   │   │   │   (1:30 PM)     │ │   (13:30)       │    │   │     │
│   │   │   │                 │ │                 │    │   │     │
│   │   │   │   [● selected]  │ │   [○]           │    │   │     │
│   │   │   └─────────────────┘ └─────────────────┘    │   │     │
│   │   │                                               │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Week Starts On                                     │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │                                               │   │     │
│   │   │   ┌───────┐ ┌───────┐ ┌───────┐              │   │     │
│   │   │   │  Sun  │ │  Mon  │ │  Sat  │              │   │     │
│   │   │   │  [○]  │ │ [●]   │ │  [○]  │              │   │     │
│   │   │   └───────┘ └───────┘ └───────┘              │   │     │
│   │   │                                               │   │     │
│   │   │   This affects how your weekly calendar       │   │     │
│   │   │   and availability view are displayed.        │   │     │
│   │   │                                               │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Default Event Duration                             │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │                                               │   │     │
│   │   │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │   │     │
│   │   │   │ 15m  │ │ 30m  │ │ 45m  │ │ 60m  │        │   │     │
│   │   │   │ [○]  │ │ [●]  │ │ [○]  │ │ [○]  │        │   │     │
│   │   │   └──────┘ └──────┘ └──────┘ └──────┘        │   │     │
│   │   │                                               │   │     │
│   │   │   ┌──────────────────────────────────────┐    │   │     │
│   │   │   │ Custom:  [    ] minutes               │    │   │     │
│   │   │   └──────────────────────────────────────┘    │   │     │
│   │   │                                               │   │     │
│   │   │   New event types will default to this        │   │     │
│   │   │   duration. You can change it per event.      │   │     │
│   │   │                                               │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │   ┌──────────────┐              ┌────────────────┐    │     │
│   │   │   ← Back     │              │  Continue →     │    │     │
│   │   └──────────────┘              └────────────────┘    │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `ToggleGroup` - Time format selector (12h / 24h) as card-style radio buttons
- `ToggleGroup` - Week start day selector (Sunday / Monday / Saturday)
- `ToggleGroup` - Default duration preset buttons (15m, 30m, 45m, 60m)
- `TextField` (number) - Custom duration input in minutes
- `HelperText` - Descriptive text below each setting explaining its effect
- `Button` (primary) - "Continue" to proceed
- `Button` (secondary) - "Back" to return to previous step

## User Actions
- Select time format (12-hour or 24-hour) by clicking a card
- Select week start day by clicking a card
- Select a preset event duration or enter a custom value
- Click "Continue" to save settings and proceed
- Click "Back" to return to availability step

## Navigation
- **Continue**: Saves personal settings and advances to Complete step
- **Back**: Returns to Availability step

## States
- **Initial**: Pre-selected defaults (12h, Monday, 30 minutes) based on locale
- **Locale-Detected**: Settings pre-filled based on browser locale (e.g., 24h for EU users)
- **Custom Duration Active**: Custom input field becomes editable when clicked
- **Custom Duration Error**: Red border if value is < 5 or > 720 minutes
- **Saving**: Continue button shows spinner while persisting settings
- **Saved**: Brief green checkmark flash before advancing to next step
