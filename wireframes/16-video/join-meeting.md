# Join Meeting

## Overview
Pre-join video call interface with camera/mic preview and meeting details.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|     +-----------------------------+   +-------------------------+  |
|     |                             |   |                         |  |
|     |                             |   |  Meeting Details        |  |
|     |                             |   |                         |  |
|     |                             |   |  30 Min Meeting         |  |
|     |                             |   |  with John Smith        |  |
|     |                             |   |                         |  |
|     |      VIDEO PREVIEW          |   |  +-------------------+  |  |
|     |                             |   |  | [cal] Mar 12, 2025|  |  |
|     |                             |   |  |      2:00 PM EST  |  |  |
|     |                             |   |  +-------------------+  |  |
|     |       [ Your camera         |   |                         |  |
|     |         preview here ]      |   |  +-------------------+  |  |
|     |                             |   |  | [clock] 30 min    |  |  |
|     |                             |   |  +-------------------+  |  |
|     |                             |   |                         |  |
|     |                             |   |  +-------------------+  |  |
|     |                             |   |  | [user] 2 attendees|  |  |
|     |                             |   |  +-------------------+  |  |
|     |                             |   |                         |  |
|     +-----------------------------+   |  Attendees:             |  |
|     |                             |   |  - John Smith (host)   |  |
|     |  [mic]   [camera]   [gear]  |   |  - You                 |  |
|     |   ON       ON       Setup   |   |                         |  |
|     |                             |   |                         |  |
|     +-----------------------------+   |                         |  |
|                                       |  Your Name              |  |
|                                       |  +-------------------+  |  |
|                                       |  | Jane Doe          |  |  |
|                                       |  +-------------------+  |  |
|                                       |                         |  |
|                                       |  [    Join Meeting    ] |  |
|                                       |                         |  |
|                                       +-------------------------+  |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+

Camera off state:
+-----------------------------+
|                             |
|                             |
|         +------+            |
|         |      |            |
|         | [JD] |            |
|         |      |            |
|         +------+            |
|       Jane Doe              |
|                             |
|                             |
+-----------------------------+
|  [mic]   [cam/X]   [gear]  |
|   ON       OFF     Setup   |
+-----------------------------+

Settings popover:
+---------------------------+
|  Audio & Video Settings   |
|                           |
|  Microphone               |
|  [Built-in Mic        v]  |
|                           |
|  Speaker                  |
|  [Built-in Speaker    v]  |
|                           |
|  Camera                   |
|  [FaceTime HD Cam     v]  |
|                           |
|  [ ] Mirror my video      |
|                           |
|           [Done]          |
+---------------------------+
```

## Layout

- **Left**: Video preview area with camera feed
- **Right**: Meeting details and join controls

## Components

### Video Preview
- Live camera feed when enabled
- Initials avatar when camera is off
- Controls bar below: microphone toggle, camera toggle, settings gear

### Meeting Info Panel
- Meeting title
- Host name
- Date and time
- Duration
- Attendee count and list

### Join Controls
- Name input field (pre-filled if logged in)
- Join Meeting button (primary action)

### Settings Popover
- Microphone source selection
- Speaker source selection
- Camera source selection
- Mirror video toggle

## States
- **Camera on**: Shows live video feed
- **Camera off**: Shows initials avatar on dark background
- **Mic on**: Mic icon active
- **Mic off**: Mic icon with slash, muted indicator
- **Joining**: Button shows spinner "Joining..."
- **Permission denied**: Banner "Please allow camera/mic access"
