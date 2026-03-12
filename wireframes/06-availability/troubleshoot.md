# Troubleshoot Availability

**Route:** `/availability/troubleshoot`
**Type:** Authenticated
**Parent Layout:** Main Nav

## Description
Diagnostic tool for understanding calculated availability on a specific date. Users select a date and event type to see a timeline of their availability, including which calendar events or rules are causing conflicts. Helps debug why certain time slots appear as unavailable to bookers.

## Wireframe

```
+------------------------------------------------------------------+
| Cal.com                    [?] [Bell] [Avatar v]                 |
+----------+-------------------------------------------------------+
| Event    |                                                       |
| Types    |  Troubleshoot Availability                            |
| Bookings |  See exactly when you're available and what's          |
| Availab. |  blocking your time slots.                            |
| Teams    |                                                       |
| Apps     |  +------------------------+  +----------------------+ |
|          |  | Date                   |  | Event Type           | |
|          |  | [March 12, 2026   [v]] |  | [30 Min Meeting  [v]]| |
|          |  +------------------------+  +----------------------+ |
|          |                                                       |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  Thursday, March 12, 2026                             |
|          |  Timezone: America/New_York (EDT)                     |
|          |                                                       |
|          |  Schedule: Working Hours                               |
|          |  Configured: 9:00 AM - 5:00 PM                       |
|          |                                                       |
|          |  Timeline                                             |
|          |  +--------------------------------------------------+ |
|          |  |                                                    | |
|          |  |  9AM  10   11   12PM  1    2    3    4    5PM     | |
|          |  |  |    |    |    |     |    |    |    |    |       | |
|          |  |  [====]    [====]                                  | |
|          |  |  [BUSY]    [BUSY]     [=========]                  | |
|          |  |       [==========]                   [====]        | |
|          |  |                                                    | |
|          |  |  Legend:                                           | |
|          |  |  [====] Available   [BUSY] Calendar busy          | |
|          |  |  [BUFF] Buffer      [OVER] Date override          | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Availability Breakdown                               |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  |  9:00 AM - 9:30 AM                                | |
|          |  |  [green] AVAILABLE                                | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  9:30 AM - 10:30 AM                               | |
|          |  |  [red] BUSY - "Team Standup"                      | |
|          |  |  Source: Google Calendar (work@company.com)        | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  10:30 AM - 10:45 AM                              | |
|          |  |  [yellow] BUFFER - 15 min after-event buffer      | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  10:45 AM - 11:30 AM                              | |
|          |  |  [green] AVAILABLE                                | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  11:30 AM - 12:30 PM                              | |
|          |  |  [red] BUSY - "Lunch with Client"                 | |
|          |  |  Source: Google Calendar (work@company.com)        | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  12:30 PM - 3:00 PM                               | |
|          |  |  [green] AVAILABLE                                | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  3:00 PM - 3:30 PM                                | |
|          |  |  [red] BUSY - "Cal.com Booking: Design Review"    | |
|          |  |  Source: Cal.com Booking                          | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  |  3:30 PM - 5:00 PM                                | |
|          |  |  [green] AVAILABLE                                | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Summary                                              |
|          |  Available: 5h 15m  |  Busy: 2h 30m  |  Buffer: 15m |
|          |                                                       |
+----------+-------------------------------------------------------+

Date Picker (expanded):
+----------------------+
|  << March 2026 >>    |
|  Mo Tu We Th Fr Sa Su|
|                    1 |
|   2  3  4  5  6  7  8|
|   9 10 11 [12] 13 14 15|
|  16 17 18 19 20 21 22|
|  23 24 25 26 27 28 29|
|  30 31               |
+----------------------+
```

## Components
- Page header with title and description
- Filter bar
  - Date picker (calendar dropdown, defaults to today)
  - Event type selector (dropdown of user's event types)
- Date and schedule info banner (selected date, timezone, active schedule, configured hours)
- Visual timeline bar
  - Horizontal time axis (hours of configured availability)
  - Color-coded blocks: available (green), busy (red), buffer (yellow), override (orange)
  - Legend
- Availability breakdown list
  - Time slot rows showing:
    - Time range
    - Status badge (Available / Busy / Buffer / Override)
    - Conflict source (calendar event title, calendar source, or rule name)
- Summary bar (total available time, total busy time, total buffer time)

## User Actions
- Select a date from the date picker to view that day's availability
- Select an event type to calculate availability specific to that event type's settings (duration, buffers, limits)
- Scroll through the breakdown list to identify specific conflicts
- Click on a busy slot to see more details about the source event (future enhancement)

## Navigation
- Sidebar links to other main sections
- No explicit back link (accessed from sidebar under Availability)

## States
- **Loading:** Skeleton timeline bar and placeholder rows with pulsing animation
- **Empty (no event types):** Message: "Create an event type first to troubleshoot availability" with link to `/event-types`
- **No conflicts:** All slots show as available, summary shows full configured hours
- **No calendars connected:** Warning banner: "Connect a calendar to see external conflicts" with link to `/apps/categories/calendar`
- **Date in past:** Muted display with note: "Showing historical availability. Past dates cannot be booked."
- **Error:** Banner: "Failed to calculate availability. Please try again." with retry button
- **Weekend / Off day:** Message: "You have no availability configured for this day" with link to edit the active schedule
