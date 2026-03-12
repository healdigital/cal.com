# Settings - Out of Office

## Overview
Configure out-of-office periods with date ranges, booking redirect options, and custom messages.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Out of Office                       |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Set up out-of-office periods to     |  |
| | |     Profile         | | |  block your availability and         |  |
| | |     Appearance      | | |  optionally redirect bookings.       |  |
| | |     Calendars       | | |                                      |  |
| | |     Conferencing    | | |  [+ Create Out of Office]            |  |
| | |     Features        | | |                                      |  |
| | | (*) Out of Office   | | |  +--[ Active / Upcoming ]----------+ |  |
| | |     Push Notif.     | | |  |                                  | |  |
| | +---------------------+ | |  |  +------------------------------+| |  |
| | ...                     | |  |  | Mar 20 - Mar 28, 2026        || |  |
| |                         | |  |  | Spring Vacation              || |  |
| +-------------------------+ |  |  |                              || |  |
|                             |  |  | Redirect: John Smith         || |  |
|                             |  |  | Message: "I'm on vacation.   || |  |
|                             |  |  |  John can help while I'm     || |  |
|                             |  |  |  away."                       || |  |
|                             |  |  |                              || |  |
|                             |  |  |        [Edit] [Delete]       || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | Apr 15, 2026 (single day)    || |  |
|                             |  |  | Doctor Appointment            || |  |
|                             |  |  |                              || |  |
|                             |  |  | Redirect: None               || |  |
|                             |  |  | Message: --                   || |  |
|                             |  |  |                              || |  |
|                             |  |  |        [Edit] [Delete]       || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Past ]------------------------+ |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | Feb 10 - Feb 14, 2026        || |  |
|                             |  |  | Conference Trip     (expired)|| |  |
|                             |  |  |                    [Delete]  || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |                                      |  |
| +--[ Create/Edit OOO Modal ]--------------------------------------+  |
| |                                                          [X]    |  |
| |  Create Out of Office                                           |  |
| |                                                                 |  |
| |  Date Range                                                     |  |
| |  +---------------------------+ +---------------------------+    |  |
| |  | Start Date                | | End Date                  |    |  |
| |  | [Mar 20, 2026         [c]]| | [Mar 28, 2026         [c]]|   |  |
| |  +---------------------------+ +---------------------------+    |  |
| |                                                                 |  |
| |  +-----------------------------------------------------+       |  |
| |  |           March 2026                                 |       |  |
| |  |  Mo  Tu  We  Th  Fr  Sa  Su                         |       |  |
| |  |                           1                          |       |  |
| |  |   2   3   4   5   6   7   8                         |       |  |
| |  |   9  10  11  12  13  14  15                         |       |  |
| |  |  16  17  18  19 [20  21  22                         |       |  |
| |  |  23  24  25  26  27  28] 29                         |       |  |
| |  |  30  31                                              |       |  |
| |  +-----------------------------------------------------+       |  |
| |                                                                 |  |
| |  Reason (optional)                                              |  |
| |  +-----------------------------------------------------+       |  |
| |  | Spring Vacation                                      |       |  |
| |  +-----------------------------------------------------+       |  |
| |                                                                 |  |
| |  Redirect Bookings                                              |  |
| |  +-----+                                                        |  |
| |  |[O  ]|  On                                                    |  |
| |  +-----+                                                        |  |
| |                                                                 |  |
| |  (Shown when redirect is ON:)                                   |  |
| |                                                                 |  |
| |  Redirect To                                                    |  |
| |  +-----------------------------------------------------+       |  |
| |  | [Av] John Smith                                  [v] |       |  |
| |  +-----------------------------------------------------+       |  |
| |  Select a team member to receive your bookings.                 |  |
| |                                                                 |  |
| |  Custom Message (optional)                                      |  |
| |  +-----------------------------------------------------+       |  |
| |  | I'm on vacation from Mar 20-28. John can help       |       |  |
| |  | while I'm away. I'll follow up when I return.       |       |  |
| |  +-----------------------------------------------------+       |  |
| |  200/500 characters                                             |  |
| |                                                                 |  |
| |  (i) This message is shown on your booking page                 |  |
| |  during the out-of-office period.                               |  |
| |                                                                 |  |
| |                          +--------+ +-----------+               |  |
| |                          | Cancel | | Save      |               |  |
| |                          +--------+ +-----------+               |  |
| +----------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Create Button | Button (primary) | Opens create modal |
| OOO Entry Card | Card | Date range, reason, redirect info, actions |
| Edit Button | Button (ghost) | Opens edit modal with pre-filled data |
| Delete Button | Button (destructive ghost) | Confirmation dialog before delete |
| Date Range Picker | DateRangePicker | Calendar widget, single-day support |
| Reason Input | TextInput | Optional short reason |
| Redirect Toggle | Switch | Enable/disable booking redirect |
| Redirect Member Select | Select | Team members list with avatars |
| Custom Message | Textarea | Max 500 chars, character counter |
| Active/Past Sections | Accordion/Tabs | Separates current/upcoming from expired |

## States
- **No OOO Entries**: "No out-of-office periods set up" with CTA button
- **Active Now**: Entry card has green "Active" badge, highlighted border
- **Upcoming**: Entry card shows normally with future date
- **Expired**: Entry card muted/grayed, only Delete action available
- **Redirect On**: Shows team member selector and message field
- **Redirect Off**: Hides redirect options, bookings simply blocked
- **Overlapping Dates**: Warning "This overlaps with an existing out-of-office period"
- **Deleting**: Confirmation dialog "Delete this out-of-office entry?"
