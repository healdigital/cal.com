# Event Types List

**Route:** `/event-types`
**Type:** Authenticated
**Parent Layout:** Main Nav (Shell)

## Description
Listing of all event types the user has created, organized by personal and team event types. Users can create new event types, toggle them on/off, copy booking links, and perform actions like edit, duplicate, or delete.

## Wireframe

```
+------------------------------------------------------------------------+
| [Cal Logo]   Bookings   Event Types   Availability   Apps   Settings   |
|                                                    [?] [Bell] [Avatar] |
+------------------------------------------------------------------------+
|                                                                        |
|  Event Types                                        [+ New Event Type] |
|                                                                        |
|  +---------------+  +-------------------+                              |
|  | Personal *    |  | Team: Engineering |                              |
|  +---------------+  +-------------------+                              |
|                                                                        |
|  +--------------------------------------------------------------------+|
|  |                                                                    ||
|  |  +------+  15 Minute Meeting                                      ||
|  |  | 15m  |  /username/15min                                        ||
|  |  | icon |  15 min  |  Google Meet                                 ||
|  |  +------+                                                         ||
|  |                                                                    ||
|  |            [Copy Link]   [Preview]          (o)--  ON    [...]    ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  |                                                                    ||
|  |  +------+  30-Min Strategy Call                                   ||
|  |  | 30m  |  /username/strategy-call                                ||
|  |  | icon |  30 min  |  Zoom                                       ||
|  |  +------+                                                         ||
|  |                                                                    ||
|  |            [Copy Link]   [Preview]          (o)--  ON    [...]    ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  |                                                                    ||
|  |  +------+  Product Demo                                           ||
|  |  | 60m  |  /username/product-demo                                 ||
|  |  | icon |  60 min  |  Cal Video                                   ||
|  |  +------+                                                         ||
|  |                                                                    ||
|  |            [Copy Link]   [Preview]          --o(  OFF   [...]    ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  |                                                                    ||
|  |  +------+  Paid Consultation                          $           ||
|  |  | 45m  |  /username/consultation                                 ||
|  |  | icon |  45 min  |  Google Meet  |  $150                       ||
|  |  +------+                                                         ||
|  |                                                                    ||
|  |            [Copy Link]   [Preview]          (o)--  ON    [...]    ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  |                                                                    ||
|  |  +------+  Quick Chat                                             ||
|  |  | 10m  |  /username/quick-chat                                   ||
|  |  | icon |  10 min  |  Phone Call                                  ||
|  |  +------+                                                         ||
|  |                                                                    ||
|  |            [Copy Link]   [Preview]          (o)--  ON    [...]    ||
|  |                                                                    ||
|  +--------------------------------------------------------------------+|
|                                                                        |
+------------------------------------------------------------------------+
```

### Action Menu (...) Expanded

```
+---------------------+
| Edit                |
| Duplicate           |
| Preview             |
| Copy Link to Event  |
| Embed               |
|---------------------|
| Delete              |
+---------------------+
```

### New Event Type Dialog

```
+-------------------------------------------+
|  Create New Event Type                     |
|                                            |
|  Event type name                           |
|  +--------------------------------------+  |
|  | 30-Min Strategy Call                 |  |
|  +--------------------------------------+  |
|                                            |
|  URL                                       |
|  cal.com/username/                          |
|  +--------------------------------------+  |
|  | strategy-call                        |  |
|  +--------------------------------------+  |
|                                            |
|  Description                               |
|  +--------------------------------------+  |
|  |                                      |  |
|  |                                      |  |
|  +--------------------------------------+  |
|                                            |
|  Duration                                  |
|  [15m] [30m] [45m] [60m] [Custom]         |
|                                            |
|  Location                                  |
|  [v  Cal Video                         ]  |
|                                            |
|         [Cancel]   [Continue]              |
+-------------------------------------------+
```

## Components
- `Shell` - Main application shell with nav
- `HorizontalTabs` - Tab bar for Personal / Team event types
- `Button` - "New Event Type" CTA button (primary)
- `EventTypeCard` - Card displaying event type info with actions
- `Badge` - Duration badge and price badge
- `Toggle` - On/Off switch to enable/disable event type
- `DropdownMenu` - Overflow action menu (edit, duplicate, delete)
- `Dialog` - New event type creation dialog
- `TextField` - Input fields in creation dialog
- `Select` - Location dropdown
- `DurationPicker` - Duration preset buttons
- `EmptyScreen` - Empty state when no event types exist
- `Tooltip` - Hover tooltips for icons and actions

## User Actions
- Click "+ New Event Type" to open creation dialog
- Switch between Personal and Team tabs
- Click "Copy Link" to copy the booking URL to clipboard (shows toast)
- Click "Preview" to open the public booking page in a new tab
- Toggle the on/off switch to enable or disable an event type
- Click overflow menu (...) for Edit, Duplicate, Delete actions
- Drag event type cards to reorder them
- Click event type title or Edit to navigate to the event type editor

## Navigation
- Clicking event type title navigates to `/event-types/[type]` editor
- "Edit" in action menu navigates to `/event-types/[type]` editor
- "Preview" opens `cal.com/username/[slug]` in new tab
- Team tab may show different team event types
- Main nav links to other top-level sections

## States

### Loading
```
+--------------------------------------------------------------------+
|  +------+  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~                           |
|  | .... |  ~~~~~~~~~~~~~~~~~~~~~~                                 |
|  | .... |  ~~~~~~~~~~  ~~~~~~~~                                   |
|  +------+                                    [====]     [...]     |
+--------------------------------------------------------------------+
(3-4 skeleton event type cards with pulsing placeholders)
```

### Empty (no event types)
```
+--------------------------------------------------------------------+
|                                                                    |
|                   [Calendar illustration]                           |
|                                                                    |
|              No event types yet                                    |
|     Create your first event type to start accepting               |
|     bookings from your contacts and clients.                      |
|                                                                    |
|                   [+ New Event Type]                               |
|                                                                    |
+--------------------------------------------------------------------+
```

### Error
```
+--------------------------------------------------------------------+
|                                                                    |
|                   [Error illustration]                              |
|                                                                    |
|              Unable to load event types                            |
|     Something went wrong. Please try again.                       |
|                                                                    |
|                      [Try Again]                                   |
|                                                                    |
+--------------------------------------------------------------------+
```

### Copy Link Success Toast
```
+----------------------------------+
| [Check] Link copied to clipboard |
+----------------------------------+
```

### Delete Confirmation Dialog
```
+-----------------------------------+
|  Delete Event Type                |
|                                   |
|  Are you sure you want to delete  |
|  "Product Demo"? This cannot be   |
|  undone. Existing bookings will   |
|  not be affected.                 |
|                                   |
|  [Cancel]   [Delete Event Type]   |
+-----------------------------------+
```
