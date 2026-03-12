# Reschedule Booking

**Route:** `/reschedule/[uid]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Reschedule page that reuses the booking page layout but with added context about the original booking being rescheduled. Shows a reschedule banner at the top with original booking details. The calendar and time slot selection work identically to the original booking flow.

## Wireframe - Step 1: Date & Time Selection

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +--------------------------------------------------------------+ |
| | (i) You are rescheduling a booking originally on             | |
| |     Thursday, March 12 at 9:00 AM.                          | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +----+                 |  |  < March 2026 >                  ||
| |  |Ava |  Jane Smith     |  |                                  ||
| |  +----+                 |  |  Mo  Tu  We  Th  Fr  Sa  Su      ||
| |                         |  |                                  ||
| |  Quick Chat             |  |                   1              ||
| |                         |  |   2   3   4   5   6   7   8      ||
| |  +------+  +--------+  |  |   9  10  11  12 [13] 14  15      ||
| |  | 15m  |  | Google  |  |  |  16  17  18  19  20  21  22      ||
| |  | icon |  | Meet    |  |  |  23  24  25  26  27  28  29      ||
| |  +------+  +--------+  |  |  30  31                           ||
| |                         |  |                                  ||
| |  A short introductory   |  +----------------------------------+|
| |  call to discuss your   |                                      |
| |  needs and see how I    |  +----------------------------------+|
| |  can help.              |  | Timezone: America/New_York  [v]  ||
| |                         |  +----------------------------------+|
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
| +--------------------------------------------------------------+ |
| | (i) You are rescheduling a booking originally on             | |
| |     Thursday, March 12 at 9:00 AM.                          | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +--------------------+ +--------------+ +----------------------+ |
| |                    | |              | |                      | |
| |  Jane Smith        | | < Mar 2026 > | | Friday, Mar 13      | |
| |                    | |              | |                      | |
| |  Quick Chat        | | Mo Tu We Th | | +------------------+| |
| |                    | |           1 | | |  9:00 AM         || |
| |  +------+ +-----+ | |  2  3  4  5 | | +------------------+| |
| |  | 15m  | | GMt | | |  9 10 11 12 | |                      | |
| |  +------+ +-----+ | | 16 17 18[13]| | +------------------+| |
| |                    | | 23 24 25 26 | | |  9:30 AM         || |
| |  A short call to   | | 30 31       | | +------------------+| |
| |  discuss needs.    | |             | |                      | |
| |                    | |             | | +------------------+| |
| |                    | |             | | | 10:00 AM         || |
| |                    | |             | | +------------------+| |
| |                    | |             | |                      | |
| +--------------------+ +-------------+ +----------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

## Wireframe - Step 3: Reschedule Confirmation

```
+------------------------------------------------------------------+
|                                                                  |
| +--------------------------------------------------------------+ |
| | (i) You are rescheduling a booking originally on             | |
| |     Thursday, March 12 at 9:00 AM.                          | |
| +--------------------------------------------------------------+ |
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +----+                 |  |  Reason for rescheduling         ||
| |  |Ava |  Jane Smith     |  |  +------------------------------+||
| |  +----+                 |  |  |                              |||
| |                         |  |  | Conflict with another        |||
| |  Quick Chat             |  |  | meeting...                   |||
| |                         |  |  |                              |||
| |  +------+  +--------+  |  |  +------------------------------+||
| |  | 15m  |  | Google  |  |  |                                  ||
| |  | icon |  | Meet    |  |  |                                  ||
| |  +------+  +--------+  |  |                                  ||
| |                         |  |                                  ||
| |  ORIGINAL:              |  |                                  ||
| |  ~Thu, Mar 12, 9:00 AM~ |  |                                  ||
| |  (strikethrough)        |  |                                  ||
| |                         |  |                                  ||
| |  NEW:                   |  |  +--------+ +------------------+ ||
| |  Fri, Mar 13, 9:30 AM   |  |  | < Back | | Reschedule       | ||
| |  (America/New_York)     |  |  +--------+ +------------------+ ||
| |                         |  |                                  ||
| +-------------------------+  +----------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
```

## Components
- `RescheduleBanner` - Info banner with original booking date/time
- `EventInfoPanel` - Same as booking page left panel, with additions:
  - `OriginalDateTime` - Strikethrough of original date/time
  - `NewDateTime` - Highlighted new date/time
- `CalendarGrid` - Same as booking page (excludes original date if past)
- `TimeSlotList` - Same as booking page
- `TimezoneSelector` - Same as booking page
- `RescheduleForm` - Simplified form (no name/email needed)
  - `ReasonTextarea` - "Reason for rescheduling" (optional)
  - `BackButton` - Return to time selection
  - `RescheduleButton` - Primary CTA "Reschedule" (instead of "Confirm")

## User Actions
1. View reschedule banner with original booking info
2. Select a new date on the calendar
3. Pick a new time slot
4. Optionally enter a reason for rescheduling
5. Click "Reschedule" to confirm the change

## Navigation
- Back button -> returns to time selection
- Reschedule button -> `/booking/[uid]` (updated booking confirmation)
- Browser back -> returns to previous step or booking confirmation page

## States
- **Loading:** Skeleton with reschedule banner placeholder
- **Date Selection:** Calendar visible with reschedule context banner
- **Time Selection:** Calendar + time slots with banner
- **Reason Entry:** Reason form with original vs new time comparison
- **Submitting:** Reschedule button shows spinner
- **Success:** Redirect to updated booking confirmation
- **Error:** Toast notification for server errors
- **Expired:** "This booking can no longer be rescheduled" if past cancellation window
- **Already Cancelled:** "This booking has been cancelled" with no reschedule option
