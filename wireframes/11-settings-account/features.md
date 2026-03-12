# Settings - Features

## Overview
Feature opt-in toggles allowing users to enable or disable optional features.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Features                            |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Enable or disable optional          |  |
| | |     Profile         | | |  features for your account.          |  |
| | |     Appearance      | | |                                      |  |
| | |     Calendars       | | |  +--[ Available Features ]---------+ |  |
| | |     Conferencing    | | |  |                                  | |  |
| | | (*) Features        | | |  |  +------------------------------+| |  |
| | |     Out of Office   | | |  |  |                              || |  |
| | |     Push Notif.     | | |  |  | Instant Meetings       +---+|| |  |
| | +---------------------+ | |  |  |                        |[O ]||| |  |
| | ...                     | |  |  | Allow bookers to start +---+|| |  |
| |                         | |  |  | a meeting with you           || |  |
| +-------------------------+ |  |  | instantly without             || |  |
|                             |  |  | scheduling.                   || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Dynamic Group Links    +---+|| |  |
|                             |  |  |                        |[  O]||| |  |
|                             |  |  | Create booking links   +---+|| |  |
|                             |  |  | that automatically           || |  |
|                             |  |  | include multiple team         || |  |
|                             |  |  | members.                      || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Recurring Bookings     +---+|| |  |
|                             |  |  |                        |[O ]||| |  |
|                             |  |  | Allow bookers to       +---+|| |  |
|                             |  |  | schedule recurring           || |  |
|                             |  |  | meetings in one booking      || |  |
|                             |  |  | flow.                         || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Requires Confirmation  +---+|| |  |
|                             |  |  |                        |[  O]||| |  |
|                             |  |  | New bookings require   +---+|| |  |
|                             |  |  | your manual approval         || |  |
|                             |  |  | before being confirmed.      || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Calendar Overlay       +---+|| |  |
|                             |  |  |   [BETA]               |[  O]||| |  |
|                             |  |  | See other team members +---+|| |  |
|                             |  |  | calendars overlaid on        || |  |
|                             |  |  | your own for easier          || |  |
|                             |  |  | coordination.                 || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Booking Limits         +---+|| |  |
|                             |  |  |                        |[O ]||| |  |
|                             |  |  | Set limits on how many +---+|| |  |
|                             |  |  | bookings can be made per     || |  |
|                             |  |  | day, week, or month.          || |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  (i) Changes are saved               |  |
|                             |  automatically when you toggle       |  |
|                             |  a feature.                          |  |
|                             |                                      |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Feature Card | Card with Switch | Title, description, toggle switch |
| Beta Badge | Badge | Orange/yellow "BETA" tag for experimental features |
| Feature Toggle | Switch | Auto-saves on toggle |
| Info Notice | Text | Explains auto-save behavior |

## States
- **Enabled**: Toggle on (green), feature active
- **Disabled**: Toggle off (gray), feature inactive
- **Toggling**: Brief loading spinner on switch during API call
- **Error**: Toast "Failed to update feature. Please try again."
- **Beta Feature**: Yellow "BETA" badge next to feature name
- **Plan Restricted**: Toggle disabled with "Upgrade to Pro" tooltip and lock icon
- **Confirmation Required**: Some features show confirmation dialog on disable (e.g., "Disabling this will affect X existing event types")
