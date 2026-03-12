# Settings - Calendars

## Overview
Connected calendar management, destination calendar selection, and sync settings.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Calendars                           |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Connect and manage your calendars   |  |
| | |     Profile         | | |  for availability checking and       |  |
| | |     Appearance      | | |  event creation.                    |  |
| | | (*) Calendars       | | |                                      |  |
| | |     Conferencing    | | |  +--[ Connected Calendars ]--------+ |  |
| | |     Features        | | |  |                                  | |  |
| | |     Out of Office   | | |  |  Connected Calendars             | |  |
| | |     Push Notif.     | | |  |  These calendars are checked     | |  |
| | +---------------------+ | |  |  for conflicts.                  | |  |
| | ...                     | |  |                                  | |  |
| |                         | |  |  +-------------------------------+| |  |
| +-------------------------+ |  |  | [G] Google Calendar            || |  |
|                             |  |  |     jane@gmail.com             || |  |
|                             |  |  |     Connected Jan 5, 2026      || |  |
|                             |  |  |                                || |  |
|                             |  |  |     Check for conflicts:       || |  |
|                             |  |  |     [x] Personal Calendar      || |  |
|                             |  |  |     [x] Work Calendar          || |  |
|                             |  |  |     [ ] Holidays               || |  |
|                             |  |  |     [ ] Birthdays              || |  |
|                             |  |  |                                || |  |
|                             |  |  |     [Disconnect]  (red text)   || |  |
|                             |  |  +--------------------------------|| |  |
|                             |  |  | [O] Outlook / Office 365       || |  |
|                             |  |  |     jane@company.com           || |  |
|                             |  |  |     Connected Feb 12, 2026     || |  |
|                             |  |  |                                || |  |
|                             |  |  |     Check for conflicts:       || |  |
|                             |  |  |     [x] Main Calendar          || |  |
|                             |  |  |     [x] Team Calendar          || |  |
|                             |  |  |                                || |  |
|                             |  |  |     [Disconnect]  (red text)   || |  |
|                             |  |  +--------------------------------|| |  |
|                             |  |                                  | |  |
|                             |  |  [+ Connect Calendar]            | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Destination Calendar ]-------+ |  |
|                             |  |                                  | |  |
|                             |  |  Destination Calendar            | |  |
|                             |  |  New bookings will be added      | |  |
|                             |  |  to this calendar.               | |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | [G] Work Calendar         [v] || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  Options grouped by provider:    | |  |
|                             |  |  -- Google (jane@gmail.com) --   | |  |
|                             |  |    Personal Calendar             | |  |
|                             |  |    Work Calendar                 | |  |
|                             |  |  -- Outlook (jane@company.com) --| |  |
|                             |  |    Main Calendar                 | |  |
|                             |  |    Team Calendar                 | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Sync Settings ]---------------+ |  |
|                             |  |                                  | |  |
|                             |  |  Sync Frequency                  | |  |
|                             |  |  How often Cal.com checks your   | |  |
|                             |  |  calendars for updates.          | |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | Every 5 minutes           [v] || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  Last synced: 2 minutes ago      | |  |
|                             |  |  [Sync Now]                      | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Calendar Display ]------------+ |  |
|                             |  |                                  | |  |
|                             |  |  Show declined events as busy    | |  |
|                             |  |  +-----+                         | |  |
|                             |  |  |[  O]|  Off                    | |  |
|                             |  |  +-----+                         | |  |
|                             |  |                                  | |  |
|                             |  |  Show tentative events as busy   | |  |
|                             |  |  +-----+                         | |  |
|                             |  |  |[O  ]|  On                     | |  |
|                             |  |  +-----+                         | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |         +--------+ +-----------+     |  |
|                             |         | Cancel | | Save      |     |  |
|                             |         +--------+ +-----------+     |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Calendar Card | Card | Provider icon, email, connection date |
| Sub-calendar Checkboxes | CheckboxGroup | Which sub-calendars to check for conflicts |
| Disconnect Button | Button (destructive ghost) | Removes calendar connection |
| Connect Calendar | Button | Opens OAuth flow for provider selection |
| Destination Calendar | Select | Grouped by provider, shows all writable calendars |
| Sync Frequency | Select | 1 min, 5 min, 15 min, 30 min |
| Sync Now | Button (ghost) | Manual sync trigger |
| Declined Events Toggle | Switch | Treat declined events as busy |
| Tentative Events Toggle | Switch | Treat tentative events as busy |

## States
- **No Calendars**: "Connect a calendar to get started" with provider buttons (Google, Outlook, Apple)
- **Syncing**: "Syncing..." text with spinner next to Sync Now button
- **Sync Error**: Red warning banner "Failed to sync [Provider]. Reconnect?"
- **Disconnecting**: Confirmation dialog "Disconnect Google Calendar? Existing bookings won't be affected."
- **OAuth Flow**: Redirect to provider, return with success/error toast
