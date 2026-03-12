# App Setup / Configuration

## Route: `/apps/[slug]/setup`

## Description
Configuration form for setting up an app after installation. Shows app-specific settings fields, OAuth connection flows, and per-event-type configuration options.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | < Back to Google Calendar                              |
|          |                                                       |
| Event    | Setup Google Calendar                                 |
| Types    | Configure your Google Calendar integration             |
| Bookings |                                                       |
| Avail.   | +----------------------------------------------------+|
| Teams    | |                                                    ||
| Apps   * | |  Step 1 of 3: Connect Account                      ||
| Workflows| |  ===================>--------- Progress             ||
| Settings | |                                                    ||
|          | |  +----------------------------------------------+  ||
|          | |  |                                              |  ||
|          | |  |          [Google Logo]                        |  ||
|          | |  |                                              |  ||
|          | |  |   Connect your Google account to sync        |  ||
|          | |  |   your calendar with Cal.com                  |  ||
|          | |  |                                              |  ||
|          | |  |   [  Connect with Google  ]                   |  ||
|          | |  |                                              |  ||
|          | |  |   By connecting, you agree to share          |  ||
|          | |  |   calendar read/write access.                |  ||
|          | |  |                                              |  ||
|          | |  +----------------------------------------------+  ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |                                                       |
|          | -- OR after OAuth, Step 2: Select Calendars ---------- |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  Step 2 of 3: Select Calendars                     ||
|          | |  =============================>---- Progress        ||
|          | |                                                    ||
|          | |  Which calendars should Cal.com check for           ||
|          | |  conflicts?                                         ||
|          | |                                                    ||
|          | |  +----------------------------------------------+  ||
|          | |  | [x] Work Calendar (primary)                  |  ||
|          | |  |     john@company.com                          |  ||
|          | |  +----------------------------------------------+  ||
|          | |  | [x] Personal Calendar                        |  ||
|          | |  |     john@gmail.com                            |  ||
|          | |  +----------------------------------------------+  ||
|          | |  | [ ] Holidays                                 |  ||
|          | |  |     US Holidays                               |  ||
|          | |  +----------------------------------------------+  ||
|          | |  | [ ] Team Calendar                            |  ||
|          | |  |     engineering@company.com                   |  ||
|          | |  +----------------------------------------------+  ||
|          | |                                                    ||
|          | |  Where should Cal.com add new events?               ||
|          | |                                                    ||
|          | |  Destination calendar:                              ||
|          | |  +----------------------------------------------+  ||
|          | |  | Work Calendar (primary)                  [\/]|  ||
|          | |  +----------------------------------------------+  ||
|          | |                                                    ||
|          | |                     [Back]   [Continue -->]         ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |                                                       |
|          | -- Step 3: Additional Settings ----------------------- |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  Step 3 of 3: Settings                             ||
|          | |  =======================================> Progress   ||
|          | |                                                    ||
|          | |  Event visibility:                                  ||
|          | |  +----------------------------------------------+  ||
|          | |  | Default (Public)                         [\/]|  ||
|          | |  +----------------------------------------------+  ||
|          | |                                                    ||
|          | |  [x] Show busy times from connected calendars      ||
|          | |  [x] Add booking links in calendar events          ||
|          | |  [ ] Enable two-way sync                           ||
|          | |                                                    ||
|          | |  Apply to event types:                              ||
|          | |  +----------------------------------------------+  ||
|          | |  | [x] 30 Min Meeting                           |  ||
|          | |  | [x] 60 Min Consultation                      |  ||
|          | |  | [x] Quick Chat                               |  ||
|          | |  | [ ] Team Standup                             |  ||
|          | |  +----------------------------------------------+  ||
|          | |                                                    ||
|          | |                     [Back]   [  Save & Finish  ]   ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Progress Indicator**: Step counter with progress bar (Step X of Y)
- **OAuth Connect**: Provider-branded button for OAuth flow
- **Calendar Selector**: Checkbox list of discovered calendars
- **Destination Calendar Dropdown**: Select which calendar receives new events
- **Settings Form**: App-specific toggle switches and dropdowns
- **Event Type Selector**: Checkbox list to apply integration to specific event types
- **Navigation Buttons**: Back / Continue / Save & Finish

## States

- **Step 1 - Connect**: OAuth prompt, waiting for authorization
- **Step 1 - Connecting**: Loading spinner during OAuth redirect
- **Step 1 - Connected**: Success checkmark, auto-advance to step 2
- **Step 2 - Select**: Calendar list loaded from provider
- **Step 2 - Loading**: Skeleton while fetching calendar list
- **Step 3 - Configure**: Final settings before completion
- **Complete**: Success message, redirect to installed apps

## Interactions

- Click "Connect with Google" -> opens OAuth popup/redirect
- Toggle calendar checkboxes -> updates conflict-check calendars
- Select destination calendar -> sets default calendar for new events
- Click "Continue" -> advances to next step
- Click "Back" -> returns to previous step
- Click "Save & Finish" -> saves config, redirects to installed apps
