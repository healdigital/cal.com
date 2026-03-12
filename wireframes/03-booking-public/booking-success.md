# Booking Success

**Route:** `/booking-successful/[uid]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Success page shown immediately after a booking is confirmed. Displays a success checkmark animation, booking summary, add-to-calendar buttons, and a "Book another" option. This is the final step in the booking flow.

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|               +----------------------------------+               |
|               |                                  |               |
|               |            +------+              |               |
|               |            |  \/  |              |               |
|               |            | (ok) |              |               |
|               |            +------+              |               |
|               |                                  |               |
|               |     Booking Confirmed!           |               |
|               |                                  |               |
|               |  You are scheduled with          |               |
|               |  Jane Smith.                     |               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |                              ||               |
|               |  |  Quick Chat                  ||               |
|               |  |                              ||               |
|               |  |  +------+  +--------+        ||               |
|               |  |  | 15m  |  | Google |        ||               |
|               |  |  | icon |  | Meet   |        ||               |
|               |  |  +------+  +--------+        ||               |
|               |  |                              ||               |
|               |  |  Thursday, March 12, 2026    ||               |
|               |  |  9:00 AM - 9:15 AM (EST)    ||               |
|               |  |                              ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  Add to your calendar            |               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |  +---+  Google Calendar      ||               |
|               |  |  |ico|  Add to Google         ||               |
|               |  |  +---+                       ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |  +---+  Outlook              ||               |
|               |  |  |ico|  Add to Outlook        ||               |
|               |  |  +---+                       ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |  +---+  Apple Calendar       ||               |
|               |  |  |ico|  Download .ics file    ||               |
|               |  |  +---+                       ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |      Book another time       ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Components
- `SuccessIcon` - Animated green checkmark circle
- `SuccessHeading` - "Booking Confirmed!" heading
- `ScheduledWithText` - "You are scheduled with [Host Name]."
- `BookingSummaryCard` - Compact summary of the booking
  - `EventTitle` - Event type name
  - `DurationBadge` - Duration icon + text
  - `LocationBadge` - Location type icon + text
  - `DateTime` - Full date, time range, and timezone
- `AddToCalendarList` - Vertical list of calendar provider buttons
  - `GoogleCalendarRow` - Google icon + "Add to Google" label
  - `OutlookRow` - Outlook icon + "Add to Outlook" label
  - `AppleCalendarRow` - Apple icon + "Download .ics file" label
- `BookAnotherButton` - Secondary button to return to booking page

## User Actions
- Click Google Calendar row to add event (opens new tab)
- Click Outlook row to add event (opens new tab)
- Click Apple Calendar row to download .ics file
- Click "Book another time" to return to the booking page

## Navigation
- Google Calendar -> Google Calendar event creation (new tab)
- Outlook -> Outlook event creation (new tab)
- Apple Calendar -> .ics file download
- "Book another time" -> `/[user]/[type]` (booking page)

## States
- **Loading:** Spinner while booking confirmation is finalized
- **Success:** Checkmark animation, full booking summary, calendar buttons
- **Error:** "Something went wrong" message with retry option
- **Payment Pending:** If paid event, shows payment status before confirming
