# Calendar Connection

**Route:** `/getting-started/calendar`
**Type:** Authenticated
**Parent Layout:** Onboarding Layout (Getting Started Wizard - Step 2)

## Description
Second onboarding step where users connect their calendar providers. Shows a list of supported calendar services (Google Calendar, Microsoft Outlook, Apple Calendar) with connect buttons. Users can connect multiple calendars. Includes a skip option for users who want to set this up later.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    (✓)───────(●)───────(○)───────(○)───────(○)                  │
│   Profile  Calendar  Avail.   Settings  Complete                │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │            Connect Your Calendars                     │     │
│   │    Connect your calendars to check for conflicts      │     │
│   │    and let Cal.com manage your availability.          │     │
│   │                                                       │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │                                               │   │     │
│   │   │  ┌────┐  Google Calendar            ┌───────┐│   │     │
│   │   │  │ G  │  Sync with Google           │Connect ││   │     │
│   │   │  │    │  Calendar events            │       ││   │     │
│   │   │  └────┘                             └───────┘│   │     │
│   │   │                                               │   │     │
│   │   ├───────────────────────────────────────────────┤   │     │
│   │   │                                               │   │     │
│   │   │  ┌────┐  Microsoft Outlook          ┌───────┐│   │     │
│   │   │  │ O  │  Sync with Outlook          │Connect ││   │     │
│   │   │  │    │  365 or Exchange             │       ││   │     │
│   │   │  └────┘                             └───────┘│   │     │
│   │   │                                               │   │     │
│   │   ├───────────────────────────────────────────────┤   │     │
│   │   │                                               │   │     │
│   │   │  ┌────┐  Apple Calendar             ┌───────┐│   │     │
│   │   │  │    │  Sync with iCloud           │Connect ││   │     │
│   │   │  │    │  Calendar                   │       ││   │     │
│   │   │  └────┘                             └───────┘│   │     │
│   │   │                                               │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │     │
│   │   │  Connected Calendars (after connecting):      │   │     │
│   │   │                                               │   │     │
│   │   │  ✓ Google Calendar                            │   │     │
│   │   │    jane@gmail.com                             │   │     │
│   │   │    ┌──────────────────────────────────────┐   │   │     │
│   │   │    │ ☑ Personal  ☑ Work  ☐ Birthdays     │   │   │     │
│   │   │    └──────────────────────────────────────┘   │   │     │
│   │   │    [ Disconnect ]                             │   │     │
│   │   │                                               │   │     │
│   │   │  Destination calendar:                        │   │     │
│   │   │  ┌──────────────────────────────────┐         │   │     │
│   │   │  │ Personal (jane@gmail.com)     ▼  │         │   │     │
│   │   │  └──────────────────────────────────┘         │   │     │
│   │   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │     │
│   │                                                       │     │
│   │   ┌──────────────┐              ┌────────────────┐    │     │
│   │   │   ← Back     │              │  Continue →     │    │     │
│   │   └──────────────┘              └────────────────┘    │     │
│   │                                                       │     │
│   │                    Skip for now                       │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `CalendarProviderCard` - Row card with provider icon, name, description, and connect button
- `Button` (outline) - "Connect" button per provider, triggers OAuth flow
- `ConnectedCalendarItem` - Shows connected account with email and sub-calendar checkboxes
- `Checkbox` - Toggle individual sub-calendars for conflict checking
- `Select` - "Destination calendar" dropdown to choose where new events are created
- `Button` (destructive, text) - "Disconnect" link to remove a connected calendar
- `Button` (primary) - "Continue" to proceed
- `Button` (secondary) - "Back" to return to profile step
- `Link` - "Skip for now" to skip calendar connection

## User Actions
- Click "Connect" on a calendar provider to start OAuth flow (opens popup)
- After connecting, toggle sub-calendars on/off for conflict checking
- Select a destination calendar for new bookings
- Click "Disconnect" to remove a connected calendar
- Connect multiple calendar providers
- Click "Continue" to proceed to next step
- Click "Back" to return to profile setup
- Click "Skip for now" to skip without connecting any calendar

## Navigation
- **Connect button**: Opens OAuth popup for the selected provider
- **Continue**: Advances to Availability step
- **Back**: Returns to Profile Setup step
- **Skip for now**: Advances to Availability step without connecting

## States
- **No Calendars Connected**: Shows only the provider list with "Connect" buttons
- **OAuth In Progress**: Connect button shows spinner, "Connecting..." text
- **OAuth Success**: Provider card transforms to show connected state with sub-calendars
- **OAuth Failure**: Error toast "Failed to connect. Please try again."
- **Calendar Connected**: Green checkmark, shows email and sub-calendar toggles
- **Multiple Connected**: Stacked connected calendar items above provider list
- **Disconnecting**: Confirmation dialog before removing calendar
- **Loading Sub-calendars**: Skeleton rows while fetching sub-calendar list
