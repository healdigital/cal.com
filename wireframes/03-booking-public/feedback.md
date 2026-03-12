# Post-Meeting Feedback

**Route:** `/feedback/[uid]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Post-meeting feedback form sent to attendees after a booking has completed. Allows the attendee to rate their experience and leave optional comments. This helps hosts improve their meeting quality and is part of the Cal.com workflows feature.

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|               +----------------------------------+               |
|               |                                  |               |
|               |  How was your meeting?           |               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |                              ||               |
|               |  |  Quick Chat                  ||               |
|               |  |  with Jane Smith             ||               |
|               |  |                              ||               |
|               |  |  Thursday, March 12, 2026    ||               |
|               |  |  9:00 AM - 9:15 AM (EST)    ||               |
|               |  |                              ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  Rate your experience            |               |
|               |                                  |               |
|               |       +---+---+---+---+---+      |               |
|               |       |   |   |   |   |   |      |               |
|               |       | 1 | 2 | 3 | 4 | 5 |      |               |
|               |       | * | * | * | * | * |      |               |
|               |       +---+---+---+---+---+      |               |
|               |                                  |               |
|               |      Poor            Excellent   |               |
|               |                                  |               |
|               +----------------------------------+               |
|               |                                  |               |
|               |  Comments (optional)             |               |
|               |  +------------------------------+|               |
|               |  |                              ||               |
|               |  |  Share your thoughts about   ||               |
|               |  |  the meeting...              ||               |
|               |  |                              ||               |
|               |  |                              ||               |
|               |  |                              ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |       Submit Feedback         ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               |  +------------------------------+|               |
|               |  |         Skip                  ||               |
|               |  +------------------------------+|               |
|               |                                  |               |
|               +----------------------------------+               |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Wireframe - Star Rating Detail

```
+---------------------------------------+
|                                       |
|  Rate your experience                 |
|                                       |
|  Unselected:                          |
|  +-----+-----+-----+-----+-----+     |
|  | (o) | (o) | (o) | (o) | (o) |     |
|  +-----+-----+-----+-----+-----+     |
|    1     2     3     4     5          |
|                                       |
|  Hover on 4:                          |
|  +-----+-----+-----+-----+-----+     |
|  | (*) | (*) | (*) | (*)h| (o) |     |
|  +-----+-----+-----+-----+-----+     |
|    1     2     3     4     5          |
|                                       |
|  Selected 4:                          |
|  +-----+-----+-----+-----+-----+     |
|  | [*] | [*] | [*] | [*] | (o) |     |
|  +-----+-----+-----+-----+-----+     |
|    1     2     3     4     5          |
|                          "Great!"     |
|                                       |
|  Labels per rating:                   |
|  1 = "Poor"                           |
|  2 = "Below Average"                  |
|  3 = "Average"                        |
|  4 = "Great!"                         |
|  5 = "Excellent!"                     |
|                                       |
+---------------------------------------+
```

## Wireframe - Success State

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|               +----------------------------------+               |
|               |                                  |               |
|               |           +------+               |               |
|               |           |  \/  |               |               |
|               |           | (ok) |               |               |
|               |           +------+               |               |
|               |                                  |               |
|               |   Thank you for your feedback!   |               |
|               |                                  |               |
|               |   Your response helps improve    |               |
|               |   future meetings.               |               |
|               |                                  |               |
|               +----------------------------------+               |
|                                                                  |
+------------------------------------------------------------------+
```

## Components
- `FeedbackHeading` - "How was your meeting?" heading
- `MeetingSummaryCard` - Compact meeting details
  - `EventTitle` - Event type name
  - `HostName` - "with [Host Name]"
  - `DateTime` - Date and time of the meeting
- `StarRating` - Interactive 1-5 star rating input
  - `Star` - Individual star (empty, hovered, filled states)
  - `RatingLabel` - Dynamic label below stars ("Poor" to "Excellent")
- `CommentsTextarea` - Optional multiline comments input
- `SubmitButton` - Primary "Submit Feedback" button
- `SkipButton` - Secondary "Skip" link-style button
- `SuccessMessage` - Thank you message after submission

## User Actions
1. View meeting summary to recall the meeting
2. Click on a star to set a rating (1-5)
3. Hover over stars to preview rating
4. Optionally type comments in the text area
5. Click "Submit Feedback" to send the feedback
6. Click "Skip" to dismiss without submitting

## Navigation
- Submit button -> success state (same page, content swap)
- Skip button -> closes page or redirects to Cal.com homepage

## States
- **Loading:** Skeleton for meeting summary and form
- **Ready:** Star rating unselected, form visible
- **Rating Selected:** Stars filled up to selected value, label shown
- **Submitting:** Submit button shows spinner
- **Success:** Green checkmark with thank you message (replaces form)
- **Already Submitted:** "You already submitted feedback for this meeting" message
- **Expired:** "Feedback is no longer available for this meeting" message
- **Error (404):** "Meeting not found" message
- **Error (Server):** Toast with retry option
