# Team Booking Page

**Route:** `/team/[slug]/[type]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Team booking page with the same two-panel layout as the individual booking page, but displaying team information instead of a single host. For round-robin events, a team member is automatically assigned. For collective events, all required members must be available.

## Wireframe - Step 1: Date & Time Selection

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +------------------+  |  |  < March 2026 >                  ||
| |  |   Team Logo      |  |  |                                  ||
| |  +------------------+  |  |  Mo  Tu  We  Th  Fr  Sa  Su      ||
| |                         |  |                                  ||
| |  Engineering Team       |  |                   1              ||
| |                         |  |   2   3   4   5   6   7   8      ||
| |  Architecture Review    |  |   9  10  11 [12] 13  14  15      ||
| |                         |  |  16  17  18  19  20  21  22      ||
| |  +------+  +--------+  |  |  23  24  25  26  27  28  29      ||
| |  | 60m  |  | Zoom   |  |  |  30  31                           ||
| |  | icon |  | icon   |  |  |                                  ||
| |  +------+  +--------+  |  +----------------------------------+|
| |                         |                                      |
| |  +------------------+  |  +----------------------------------+|
| |  | Collective       |  |  | Timezone: America/New_York  [v]  ||
| |  +------------------+  |  +----------------------------------+|
| |                         |                                      |
| |  Full team review of   |                                      |
| |  your system design.   |                                      |
| |                         |                                      |
| |  Members:               |                                      |
| |  +--+ +--+ +--+        |                                      |
| |  |J | |A | |S |        |                                      |
| |  +--+ +--+ +--+        |                                      |
| |                         |                                      |
| +-------------------------+                                      |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Wireframe - Step 2: Time Slot Selection

```
+------------------------------------------------------------------+
|                                                                  |
| +--------------------+ +--------------+ +----------------------+ |
| |                    | |              | |                      | |
| |  Engineering Team  | | < Mar 2026 > | | Thursday, Mar 12    | |
| |                    | |              | |                      | |
| |  Architecture      | | Mo Tu We Th | | +------------------+| |
| |  Review            | |           1 | | |  9:00 AM         || |
| |                    | |  2  3  4  5 | | +------------------+| |
| |  +------+ +-----+ | |  9 10 11[12]| | +------------------+| |
| |  | 60m  | |Zoom | | | 16 17 18 19 | | | 10:00 AM         || |
| |  +------+ +-----+ | | 23 24 25 26 | | +------------------+| |
| |                    | | 30 31       | | +------------------+| |
| |  [Collective]      | |             | | | 11:00 AM         || |
| |                    | |             | | +------------------+| |
| |  Full team review  | |             | | +------------------+| |
| |  of your system.   | |             | | |  2:00 PM         || |
| |                    | |             | | +------------------+| |
| |  Members:          | |             | | +------------------+| |
| |  +--+ +--+ +--+   | |             | | |  3:00 PM         || |
| |  |J | |A | |S |   | |             | | +------------------+| |
| |  +--+ +--+ +--+   | |             | |                      | |
| |                    | |             | |                      | |
| +--------------------+ +-------------+ +----------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

## Wireframe - Step 3: Booking Form

```
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  Engineering Team       |  |  Your name *                     ||
| |                         |  |  +------------------------------+||
| |  Architecture Review    |  |  |                              |||
| |                         |  |  +------------------------------+||
| |  +------+  +--------+  |  |                                  ||
| |  | 60m  |  | Zoom   |  |  |  Email address *                 ||
| |  +------+  +--------+  |  |  +------------------------------+||
| |                         |  |  |                              |||
| |  [Collective]           |  |  +------------------------------+||
| |                         |  |                                  ||
| |  Thursday, March 12     |  |  Additional notes                ||
| |  9:00 AM - 10:00 AM     |  |  +------------------------------+||
| |  (America/New_York)     |  |  |                              |||
| |                         |  |  |                              |||
| |  Members:               |  |  +------------------------------+||
| |  +--+ +--+ +--+        |  |                                  ||
| |  |J | |A | |S |        |  |  +--------+  +----------------+  ||
| |  +--+ +--+ +--+        |  |  | < Back |  | Confirm        |  ||
| |                         |  |  +--------+  +----------------+  ||
| |                         |  |                                  ||
| +-------------------------+  +----------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
```

## Components
- `TeamInfoPanel` - Left panel with team and event details
  - `TeamLogo` - Team avatar/logo
  - `TeamName` - Team display name
  - `EventTitle` - Event type name
  - `DurationBadge` - Clock icon + duration
  - `LocationInfo` - Video/phone icon + label
  - `SchedulingTypeBadge` - "Round Robin" or "Collective" pill
  - `EventDescription` - Event description text
  - `MemberAvatarGroup` - Small avatars of team members
  - `SelectedDateTimeSummary` - Shows after time is picked
- `CalendarGrid` - Same as individual booking page
- `TimeSlotList` - Same as individual booking page
- `TimezoneSelector` - Same as individual booking page
- `BookingForm` - Same as individual booking page

## User Actions
- Same flow as individual booking page (date -> time -> form -> confirm)
- View team members who will attend (for collective events)
- View scheduling type badge to understand how host is assigned

## Navigation
- Back button -> returns to time/date selection
- Confirm button -> `/booking/[uid]` (booking confirmation)
- Team name -> `/team/[slug]` (team profile)
- Browser back -> previous step or team profile

## States
- **Loading:** Skeleton for team info, calendar
- **Date Selection:** Calendar visible, no time slots
- **Time Selection:** Calendar + time slots visible
- **Form Entry:** Left panel + booking form
- **Submitting:** Confirm button shows spinner
- **No Availability:** "No available times" for selected date (common for collective events)
- **Error:** Inline validation errors, server error toasts
