# Settings - General

## Overview
Account-level general preferences including language, timezone, time format, and week start.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  General                             |  |
| | +---------------------+ | |                                      |  |
| | | (*) General         | | |  Manage your account-wide settings   |  |
| | |     Profile         | | |  for language and time preferences.  |  |
| | |     Appearance      | | |                                      |  |
| | |     Calendars       | | |  +--[ Language ]-----------------+   |  |
| | |     Conferencing    | | |  |                                |   |  |
| | |     Features        | | |  |  Language                      |   |  |
| | |     Out of Office   | | |  |  Choose your preferred         |   |  |
| | |     Push Notif.     | | |  |  display language.             |   |  |
| | +---------------------+ | |  |                                |   |  |
| |                         | |  |  +----------------------------+|   |  |
| | TEAM                    | |  |  | English (US)            [v] ||   |  |
| | +---------------------+ | |  |  +----------------------------+|   |  |
| | |     Team Profile    | | |  |                                |   |  |
| | |     Members         | | |  +--------------------------------+   |  |
| | |     Billing         | | |                                      |  |
| | +---------------------+ | |  +--[ Timezone ]------------------+   |  |
| |                         | |  |                                |   |  |
| | ORGANIZATION            | |  |  Timezone                      |   |  |
| | +---------------------+ | |  |  Your current timezone for     |   |  |
| | |     General         | | |  |  all scheduling.               |   |  |
| | |     Members         | | |  |                                |   |  |
| | |     Billing         | | |  |  +----------------------------+|   |  |
| | +---------------------+ | |  |  | America/New_York (EST)  [v] ||  |  |
| |                         | |  |  +----------------------------+|   |  |
| | SECURITY                | |  |                                |   |  |
| | +---------------------+ | |  |  (i) This affects how times    |   |  |
| | |     Password        | | |  |  are displayed on your         |   |  |
| | |     Two Factor      | | |  |  booking pages.                |   |  |
| | |     API Keys        | | |  |                                |   |  |
| | +---------------------+ | |  +--------------------------------+   |  |
| |                         | |                                      |  |
| | DEVELOPER               | |  +--[ Time Format ]---------------+   |  |
| | +---------------------+ | |  |                                |   |  |
| | |     Webhooks        | | |  |  Time Format                   |   |  |
| | |     API Keys        | | |  |  How times are displayed       |   |  |
| | +---------------------+ | |  |  across the app.               |   |  |
| |                         | |  |                                |   |  |
| +-------------------------+ |  |  ( ) 12-hour   e.g. 2:30 PM    |   |  |
|                             |  |  (*) 24-hour   e.g. 14:30      |   |  |
|                             |  |                                |   |  |
|                             |  +--------------------------------+   |  |
|                             |                                      |  |
|                             |  +--[ Week Start ]-----------------+   |  |
|                             |  |                                |   |  |
|                             |  |  Week Starts On                |   |  |
|                             |  |  First day of the week in      |   |  |
|                             |  |  calendar views.               |   |  |
|                             |  |                                |   |  |
|                             |  |  +----------------------------+|   |  |
|                             |  |  | Monday                  [v] ||  |  |
|                             |  |  +----------------------------+|   |  |
|                             |  |                                |   |  |
|                             |  |  Options: Sunday, Monday,      |   |  |
|                             |  |  Saturday                      |   |  |
|                             |  +--------------------------------+   |  |
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
| Settings Sidebar | Navigation | Grouped sections: Account, Team, Org, Security, Developer |
| Language Select | Select | All supported locales |
| Timezone Select | TimezoneSelect | Searchable, grouped by region |
| Time Format | RadioGroup | 12-hour or 24-hour |
| Week Start | Select | Sunday, Monday, Saturday |
| Cancel Button | Button (secondary) | Resets to last saved state |
| Save Button | Button (primary) | Saves all changes on page |

## States
- **Pristine**: Save button disabled, no unsaved changes
- **Dirty**: Save button enabled, unsaved indicator shown
- **Saving**: Save button shows loading spinner
- **Saved**: Success toast "Settings saved successfully"
- **Error**: Error toast with specific field validation messages
