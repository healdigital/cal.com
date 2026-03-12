# Meeting Waiting Room

## Overview
Waiting room displayed when a meeting exists but has not started yet.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|              +--------------------------------------+              |
|              |                                      |              |
|              |          30 Min Meeting               |              |
|              |          with John Smith              |              |
|              |                                      |              |
|              |  +----------------------------------+|              |
|              |  | [cal] March 12, 2025             ||              |
|              |  |       2:00 PM - 2:30 PM EST      ||              |
|              |  +----------------------------------+|              |
|              |                                      |              |
|              +--------------------------------------+              |
|                                                                    |
|                                                                    |
|                        +----------+                                |
|                        |          |                                |
|                        |  [clock] |                                |
|                        |          |                                |
|                        +----------+                                |
|                                                                    |
|              The meeting hasn't started yet.                       |
|                                                                    |
|              The host will let you in when the                     |
|              meeting begins.                                       |
|                                                                    |
|                                                                    |
|                  Starting in: 04:32                                |
|                  +========================----+                    |
|                  |////////////////////////    |                    |
|                  +========================----+                    |
|                                                                    |
|                                                                    |
|              +--------------------------------------+              |
|              |  While you wait:                     |              |
|              |                                      |              |
|              |  [mic]  Check your microphone        |              |
|              |  [cam]  Test your camera              |              |
|              |  [gear] Review audio settings         |              |
|              +--------------------------------------+              |
|                                                                    |
|              [Leave Waiting Room]                                  |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+

When meeting starts (host admits):
+--------------------------------------+
|                                      |
|  The meeting is ready!               |
|                                      |
|        [ Join Now ]                  |
|                                      |
+--------------------------------------+
```

## Components

### Meeting Info Card
- Meeting title
- Host name
- Date and time range
- Duration

### Waiting Indicator
- Clock icon (animated)
- "The meeting hasn't started yet" message
- Explanation text

### Countdown Timer
- Countdown to scheduled start time: "Starting in: MM:SS"
- Progress bar showing time remaining
- Updates in real-time

### While You Wait Panel
- Quick links to check mic, camera, and audio settings
- Helps user prepare before entering

### Actions
- **Leave Waiting Room**: Secondary button to exit
- **Join Now**: Appears when host starts the meeting

## States
- **Before start time**: Shows countdown timer
- **Past start time**: Shows "The host will start the meeting shortly" (no countdown)
- **Host started**: Shows "Join Now" button with animation
- **Admitted**: Auto-redirects to meeting room
- **Cancelled**: Shows "This meeting has been cancelled" with Go Home button
