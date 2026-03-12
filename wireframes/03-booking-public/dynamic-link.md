# Dynamic Booking Link

**Route:** `/d/[link]/[slug]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Dynamic booking link page that allows multiple users to create a shared booking link on the fly. This is used for ad-hoc group scheduling where multiple hosts need to find mutual availability. The page functions like the standard booking page but shows combined availability of all linked users and displays their avatars.

## Wireframe - Step 1: Date & Time Selection

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +--+ +--+ +--+        |  |  < March 2026 >                  ||
| |  |J | |A | |S |        |  |                                  ||
| |  +--+ +--+ +--+        |  |  Mo  Tu  We  Th  Fr  Sa  Su      ||
| |  Jane, Alex & Sam      |  |                                  ||
| |                         |  |                   1              ||
| |  Group Meeting          |  |   2   3   4   5   6   7   8      ||
| |                         |  |   9  10  11 [12] 13  14  15      ||
| |  +------+               |  |  16  17  18  19  20  21  22      ||
| |  | 30m  |               |  |  23  24  25  26  27  28  29      ||
| |  | icon |               |  |  30  31                           ||
| |  +------+               |  |                                  ||
| |                         |  |  Note: Showing times when all    ||
| |  Find a time that       |  |  participants are available.     ||
| |  works for everyone.    |  |                                  ||
| |                         |  +----------------------------------+|
| |                         |                                      |
| |                         |  +----------------------------------+|
| |                         |  | Timezone: America/New_York  [v]  ||
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
| +--------------------+ +--------------+ +----------------------+ |
| |                    | |              | |                      | |
| |  +--+ +--+ +--+   | | < Mar 2026 > | | Thursday, Mar 12    | |
| |  |J | |A | |S |   | |              | |                      | |
| |  +--+ +--+ +--+   | | Mo Tu We Th | | +------------------+| |
| |  Jane, Alex & Sam  | |           1 | | | 10:00 AM         || |
| |                    | |  2  3  4  5 | | +------------------+| |
| |  Group Meeting     | |  9 10 11[12]| |                      | |
| |                    | | 16 17 18 19 | | +------------------+| |
| |  +------+          | | 23 24 25 26 | | | 11:00 AM         || |
| |  | 30m  |          | | 30 31       | | +------------------+| |
| |  +------+          | |             | |                      | |
| |                    | |             | | +------------------+| |
| |  Find a time that  | |             | | |  2:00 PM         || |
| |  works for all.    | |             | | +------------------+| |
| |                    | |             | |                      | |
| |                    | |             | | +------------------+| |
| |                    | |             | | |  3:30 PM         || |
| |                    | |             | | +------------------+| |
| |                    | |             | |                      | |
| |  All times show    | |             | | (fewer slots due    | |
| |  mutual avail.     | |             | |  to combined avail) | |
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
| |  +--+ +--+ +--+        |  |  Your name *                     ||
| |  |J | |A | |S |        |  |  +------------------------------+||
| |  +--+ +--+ +--+        |  |  |                              |||
| |  Jane, Alex & Sam      |  |  +------------------------------+||
| |                         |  |                                  ||
| |  Group Meeting          |  |  Email address *                 ||
| |                         |  |  +------------------------------+||
| |  +------+               |  |  |                              |||
| |  | 30m  |               |  |  +------------------------------+||
| |  +------+               |  |                                  ||
| |                         |  |  Additional notes                ||
| |  Thursday, March 12     |  |  +------------------------------+||
| |  10:00 AM - 10:30 AM    |  |  |                              |||
| |  (America/New_York)     |  |  |                              |||
| |                         |  |  +------------------------------+||
| |  Hosts:                 |  |                                  ||
| |  - Jane Smith           |  |  +--------+  +----------------+  ||
| |  - Alex Chen            |  |  | < Back |  | Confirm        |  ||
| |  - Sam Wilson           |  |  +--------+  +----------------+  ||
| |                         |  |                                  ||
| +-------------------------+  +----------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
```

## Components
- `DynamicEventInfoPanel` - Left panel with group event details
  - `HostAvatarGroup` - Row of all host avatars
  - `HostNames` - Comma-separated host names
  - `EventTitle` - Dynamic event type name
  - `DurationBadge` - Duration icon + text
  - `EventDescription` - Description text
  - `HostList` - Full list of host names (in form step)
  - `SelectedDateTimeSummary` - Shows after time is picked
- `CalendarGrid` - Same as booking page (shows mutual availability)
- `TimeSlotList` - Shows only mutually available slots
- `TimezoneSelector` - Same as booking page
- `BookingForm` - Same as standard booking page
- `MutualAvailabilityNote` - Info text about combined availability

## User Actions
1. View group event information with all host avatars
2. Navigate months and select an available date
3. Pick a time slot (only mutually available times shown)
4. Fill in name, email, and optional notes
5. Click "Confirm" to create the group booking

## Navigation
- Back button -> returns to time/date selection
- Confirm button -> `/booking/[uid]` (booking confirmation)
- Browser back -> previous step

## States
- **Loading:** Skeleton for host avatars, calendar
- **Date Selection:** Calendar showing mutual availability
- **Time Selection:** Fewer available slots due to multiple host schedules
- **Form Entry:** Booking form with full host list
- **Submitting:** Confirm button spinner
- **No Mutual Availability:** "No times available when all participants are free" message
- **Invalid Link:** "This booking link is invalid or has expired" error
- **Error:** Server error toast
