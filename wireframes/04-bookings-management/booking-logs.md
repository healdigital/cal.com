# Booking Activity Logs

**Route:** `/booking/[uid]/logs`
**Type:** Authenticated
**Parent Layout:** Main Nav (Shell) > Booking Detail

## Description
Chronological activity log for a specific booking. Displays a timeline of all events that occurred during the booking lifecycle: creation, confirmation, reminder emails sent, rescheduling, cancellation, and any manual changes made by the organizer or attendee.

## Wireframe

```
+------------------------------------------------------------------------+
| [Cal Logo]   Bookings   Event Types   Availability   Apps   Settings   |
|                                                    [?] [Bell] [Avatar] |
+------------------------------------------------------------------------+
|                                                                        |
|  [< Back to Bookings]                                                  |
|                                                                        |
|  30-Min Strategy Call with John Doe                                    |
|  Mon, Mar 16, 2026 - 10:00 AM - 10:30 AM (EST)                       |
|                                                                        |
|  +-----------+  +------+  +--------+                                   |
|  | Details   |  | Logs*|  | Notes  |                                   |
|  +-----------+  +------+  +--------+                                   |
|                                                                        |
|  Activity Log                                                          |
|  ----------------------------------------------------------------      |
|                                                                        |
|  March 16, 2026                                                        |
|                                                                        |
|      10:30 AM                                                          |
|        |                                                               |
|   [*]--+  Meeting Completed                                           |
|        |  The scheduled meeting has ended.                             |
|        |                                                               |
|      10:00 AM                                                          |
|        |                                                               |
|   [*]--+  Meeting Started                                             |
|        |  Video call link opened by organizer.                         |
|        |                                                               |
|        |                                                               |
|  March 15, 2026                                                        |
|                                                                        |
|       9:00 AM                                                          |
|        |                                                               |
|   [E]--+  Reminder Sent                                               |
|        |  24-hour reminder email sent to john@example.com              |
|        |  Template: "standard-reminder"                                |
|        |                                                               |
|                                                                        |
|  March 14, 2026                                                        |
|                                                                        |
|       3:15 PM                                                          |
|        |                                                               |
|   [!]--+  Booking Rescheduled                                         |
|        |  Rescheduled by attendee (John Doe)                           |
|        |  Previous: Mar 15, 2026 2:00 PM - 2:30 PM                    |
|        |  New: Mar 16, 2026 10:00 AM - 10:30 AM                       |
|        |  Reason: "Conflict with another meeting"                      |
|        |                                                               |
|       3:15 PM                                                          |
|        |                                                               |
|   [E]--+  Reschedule Confirmation Sent                                |
|        |  Confirmation email sent to john@example.com                  |
|        |  Confirmation email sent to you@cal.com                       |
|        |                                                               |
|                                                                        |
|  March 12, 2026                                                        |
|                                                                        |
|       2:45 PM                                                          |
|        |                                                               |
|   [E]--+  Confirmation Email Sent                                     |
|        |  Sent to john@example.com                                     |
|        |  Sent to you@cal.com                                          |
|        |                                                               |
|       2:45 PM                                                          |
|        |                                                               |
|   [C]--+  Calendar Event Created                                      |
|        |  Added to Google Calendar (you@cal.com)                       |
|        |  Calendar event ID: abc123xyz                                  |
|        |                                                               |
|       2:44 PM                                                          |
|        |                                                               |
|   [W]--+  Workflow Triggered                                          |
|        |  Workflow: "New Booking Notification"                          |
|        |  Actions: Send SMS, Slack notification                        |
|        |                                                               |
|       2:44 PM                                                          |
|        |                                                               |
|   [*]--+  Booking Confirmed                                           |
|        |  Auto-confirmed (no approval required)                        |
|        |                                                               |
|       2:43 PM                                                          |
|        |                                                               |
|   [+]--+  Booking Created                                             |
|        |  Created by John Doe (john@example.com)                       |
|        |  Event type: 30-Min Strategy Call                              |
|        |  Via: cal.com/you/strategy-call                                |
|        |  Payment: N/A                                                  |
|        |                                                               |
|        v                                                               |
|                                                                        |
+------------------------------------------------------------------------+
```

### Timeline Icon Legend

```
[+]  = Created (green)
[*]  = Status change (blue)
[E]  = Email / notification sent (gray)
[C]  = Calendar event (purple)
[W]  = Workflow action (orange)
[!]  = Rescheduled (yellow)
[X]  = Cancelled (red)
```

## Components
- `Shell` - Main application shell with nav
- `BookingHeader` - Booking title, date/time, and attendee summary
- `HorizontalTabs` - Tab bar for Details / Logs / Notes sub-views
- `Timeline` - Vertical timeline container
- `TimelineItem` - Individual log entry with icon, timestamp, title, and description
- `TimelineDateHeader` - Date separator in the timeline
- `Badge` - Icon badge for log entry type (color-coded)
- `Button` - Back navigation button

## User Actions
- Click "Back to Bookings" to return to the bookings list
- Switch between Details / Logs / Notes tabs
- Scroll through the activity timeline
- Timeline entries with links (e.g., calendar event ID) can be clicked for details

## Navigation
- "Back to Bookings" navigates to `/bookings/upcoming`
- "Details" tab navigates to `/booking/[uid]`
- "Notes" tab navigates to `/booking/[uid]/notes`
- Main nav links to other top-level sections

## States

### Loading
```
+--------------------------------------------------------------------+
|  Activity Log                                                      |
|  ----------------------------------------------------------------  |
|                                                                    |
|      ~~~~                                                          |
|        |                                                           |
|   [.]--+  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~                            |
|        |  ~~~~~~~~~~~~~~~~~~~~~~                                   |
|        |                                                           |
|      ~~~~                                                          |
|        |                                                           |
|   [.]--+  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~                            |
|        |  ~~~~~~~~~~~~~~~                                          |
|        |                                                           |
(Skeleton timeline entries with pulsing placeholders)
```

### Empty (no activity - edge case)
```
+--------------------------------------------------------------------+
|  Activity Log                                                      |
|  ----------------------------------------------------------------  |
|                                                                    |
|                   [Timeline illustration]                           |
|                                                                    |
|              No activity recorded                                  |
|     No activity has been logged for this booking yet.             |
|                                                                    |
+--------------------------------------------------------------------+
```

### Error
```
+--------------------------------------------------------------------+
|  Activity Log                                                      |
|  ----------------------------------------------------------------  |
|                                                                    |
|                   [Error illustration]                              |
|                                                                    |
|              Unable to load activity log                           |
|     Something went wrong. Please try again.                       |
|                                                                    |
|                      [Try Again]                                   |
|                                                                    |
+--------------------------------------------------------------------+
```
