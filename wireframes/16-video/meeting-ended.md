# Meeting Ended

## Overview
Post-meeting screen showing meeting summary, duration, and feedback options.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|                                                                    |
|                        +--------+                                  |
|                        |        |                                  |
|                        |  [ok]  |                                  |
|                        |        |                                  |
|                        +--------+                                  |
|                                                                    |
|                  Meeting Has Ended                                 |
|                                                                    |
|                                                                    |
|              +--------------------------------------+              |
|              |  MEETING SUMMARY                     |              |
|              +--------------------------------------+              |
|              |                                      |              |
|              |  30 Min Meeting with John Smith       |              |
|              |                                      |              |
|              |  +----------------------------------+|              |
|              |  | [cal]  March 12, 2025            ||              |
|              |  +----------------------------------+|              |
|              |                                      |              |
|              |  +----------------------------------+|              |
|              |  | [clock] Duration: 28 minutes     ||              |
|              |  +----------------------------------+|              |
|              |                                      |              |
|              |  +----------------------------------+|              |
|              |  | [users] Attendees: 2             ||              |
|              |  |         - John Smith (host)      ||              |
|              |  |         - Jane Doe               ||              |
|              |  +----------------------------------+|              |
|              |                                      |              |
|              +--------------------------------------+              |
|                                                                    |
|                                                                    |
|              +--------------------------------------+              |
|              |  How was your meeting experience?    |              |
|              |                                      |              |
|              |     [:(]   [:|]   [:)]   [:D]        |              |
|              |     Poor   OK    Good   Great        |              |
|              |                                      |              |
|              +--------------------------------------+              |
|                                                                    |
|                                                                    |
|              [Book Another Meeting]   [Go to Dashboard]            |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+

After feedback submitted:
+--------------------------------------+
|  How was your meeting experience?    |
|                                      |
|  Thank you for your feedback!        |
|                                      |
|  Additional comments (optional):     |
|  +----------------------------------+|
|  |                                  ||
|  |                                  ||
|  +----------------------------------+|
|                                      |
|               [Submit]               |
+--------------------------------------+
```

## Components

### Status Icon
- Checkmark icon indicating successful meeting completion

### Meeting Summary Card
- Meeting title and host
- Date
- Actual duration (not scheduled, but real)
- Attendee list with count

### Feedback Section
- Four emoji-based rating options
- Labels: Poor, OK, Good, Great
- Optional text feedback after rating

### Action Buttons
- **Book Another Meeting**: Links to host's booking page
- **Go to Dashboard**: Links to user's dashboard (if authenticated)

## States
- **Default**: Summary with feedback prompt
- **Feedback submitted**: Thank you message with optional text input
- **Guest user**: "Go to Dashboard" replaced with "Go Home"
- **Recording available**: Additional "View Recording" link shown
