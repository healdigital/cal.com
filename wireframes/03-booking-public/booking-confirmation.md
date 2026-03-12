# Booking Confirmation

**Route:** `/booking/[uid]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Displays the confirmed booking details including event title, date/time, attendees, location, and provides action buttons to add the event to calendar, reschedule, or cancel. This page is shown after a successful booking and is also accessible via the booking link sent in confirmation emails.

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|               +----------------------------------+               |
|               |                                  |               |
|               |        +--+ Confirmed            |               |
|               |        |OK|                      |               |
|               |        +--+                      |               |
|               |                                  |               |
|               |  This meeting is scheduled       |               |
|               |                                  |               |
|               |  We sent an email with a         |               |
|               |  calendar invitation to all      |               |
|               |  attendees.                      |               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  What                            |               |
|               |  +------------------------------+|               |
|               |  | Quick Chat                   ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  When                            |               |
|               |  +------------------------------+|               |
|               |  | Thursday, March 12, 2026     ||               |
|               |  | 9:00 AM - 9:15 AM (EST)     ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  Who                             |               |
|               |  +------------------------------+|               |
|               |  | Jane Smith (Host)            ||               |
|               |  | john@example.com             ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  Where                           |               |
|               |  +------------------------------+|               |
|               |  | Google Meet                  ||               |
|               |  | https://meet.google.com/...  ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  Notes                           |               |
|               |  +------------------------------+|               |
|               |  | Anything you'd like to       ||               |
|               |  | discuss...                   ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  Add to calendar                 |               |
|               |  +--------+ +--------+ +------+  |               |
|               |  | Google | |Outlook | | iCal |  |               |
|               |  +--------+ +--------+ +------+  |               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  Need to make changes?           |               |
|               |                                  |               |
|               |  +-------------+ +-------------+ |               |
|               |  | Reschedule  | |   Cancel     | |               |
|               |  +-------------+ +-------------+ |               |
|               |                                  |               |
|               +----------------------------------+               |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Components
- `ConfirmationBanner` - Green checkmark icon with "Confirmed" heading
- `StatusMessage` - "This meeting is scheduled" + email notification note
- `BookingDetailCard` - Card with booking details
  - `DetailRow (What)` - Event title
  - `DetailRow (When)` - Date, time range, timezone
  - `DetailRow (Who)` - Host name, attendee emails
  - `DetailRow (Where)` - Location type + link (if video)
  - `DetailRow (Notes)` - Additional notes (if provided)
- `AddToCalendarButtons` - Row of calendar provider buttons
  - `GoogleCalendarButton` - Add to Google Calendar
  - `OutlookButton` - Add to Outlook
  - `ICalButton` - Download .ics file
- `ActionLinks` - Reschedule and cancel options
  - `RescheduleButton` - Link-style button
  - `CancelButton` - Link-style button (destructive color)

## User Actions
- Click "Google" to add event to Google Calendar (opens new tab)
- Click "Outlook" to add event to Outlook Calendar (opens new tab)
- Click "iCal" to download .ics file
- Click "Reschedule" to navigate to reschedule flow
- Click "Cancel" to navigate to cancellation flow
- Click meeting link to join the video call

## Navigation
- Google Calendar button -> Google Calendar (new tab)
- Outlook button -> Outlook Calendar (new tab)
- iCal button -> .ics file download
- Reschedule -> `/reschedule/[uid]`
- Cancel -> `/booking/[uid]/cancel` (cancel confirmation dialog)
- Meeting link -> Video call URL (new tab)

## States
- **Loading:** Skeleton card with placeholder rows
- **Confirmed:** Green checkmark, full booking details
- **Cancelled:** Red X icon, "This meeting has been cancelled" message, no action buttons
- **Rescheduled:** "This meeting has been rescheduled" with link to new booking
- **Past:** Booking details shown but action buttons hidden (meeting already occurred)
- **Error (404):** "Booking not found" message
