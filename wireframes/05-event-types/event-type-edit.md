# Event Type Editor

**Route:** `/event-types/[type]`
**Type:** Authenticated
**Parent Layout:** Main Nav (Shell)

## Description
Full-featured editor for configuring an event type. Uses a tabbed interface with sections for Event Setup, Availability, Limits, Advanced, Recurring, and Workflows. Each tab contains form fields relevant to that configuration area. A persistent save bar appears at the bottom when changes are made.

## Wireframe

### Overall Page Structure

```
+------------------------------------------------------------------------+
| [Cal Logo]   Bookings   Event Types   Availability   Apps   Settings   |
|                                                    [?] [Bell] [Avatar] |
+------------------------------------------------------------------------+
|                                                                        |
|  [< Back to Event Types]                                               |
|                                                                        |
|  30-Min Strategy Call                            [Preview]  [Copy URL] |
|  cal.com/username/strategy-call                                        |
|                                                                        |
|  +------+  +----------+  +------+  +--------+  +----------+  +------+ |
|  |Setup*|  |Availability| |Limits|  |Advanced|  |Recurring |  |Wkflow| |
|  +------+  +----------+  +------+  +--------+  +----------+  +------+ |
|                                                                        |
|  [TAB CONTENT AREA - see individual tabs below]                        |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|  Unsaved changes                    [Discard Changes]   [Save]         |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 1: Event Setup

```
+------------------------------------------------------------------------+
|                                                                        |
|  BASIC INFO                                                            |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Title *                                                               |
|  +------------------------------------------------------------------+ |
|  | 30-Min Strategy Call                                              | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  URL Slug *                                                            |
|  cal.com/username/                                                     |
|  +------------------------------------------------------------------+ |
|  | strategy-call                                                     | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  Description                                                           |
|  +------------------------------------------------------------------+ |
|  | A focused 30-minute call to discuss your business                 | |
|  | strategy and goals.                                               | |
|  |                                                              Bold | |
|  |                                                    Italic  Links | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|                                                                        |
|  DURATION                                                              |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Duration *                                                            |
|  [15m]  [30m*]  [45m]  [60m]  [90m]  [Custom]                        |
|                                                                        |
|  [ ] Allow booker to select from multiple durations                    |
|      (If checked, show multi-select duration options)                  |
|                                                                        |
|                                                                        |
|  LOCATION                                                              |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Where will this event take place?                                     |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [Video icon]  Google Meet                              [Remove]  | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  [+ Add another location]                                              |
|                                                                        |
|  Location options when adding:                                         |
|  +---------------------------+                                         |
|  | Cal Video                 |                                         |
|  | Google Meet               |                                         |
|  | Zoom                      |                                         |
|  | Microsoft Teams           |                                         |
|  | Phone Call                |                                         |
|  | In Person (Address)       |                                         |
|  | Link meeting              |                                         |
|  | Attendee phone number     |                                         |
|  +---------------------------+                                         |
|                                                                        |
|                                                                        |
|  HOSTS                                                                 |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Scheduling Type                                                       |
|  (o) Collective - all hosts must be available                          |
|  ( ) Round Robin - distribute among hosts                              |
|  ( ) Managed - assigned by admin                                       |
|                                                                        |
|  Hosts                                                                 |
|  +------------------------------------------------------------------+ |
|  | [Avatar] You (you@cal.com)                            [x Remove] | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  [+ Add another host]                                                  |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 2: Availability

```
+------------------------------------------------------------------------+
|                                                                        |
|  SCHEDULE                                                              |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Which schedule should be used for this event type?                    |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [v]  Working Hours (Default)                                      | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  Available schedules:                                                  |
|  +---------------------------+                                         |
|  | Working Hours (Default)   |                                         |
|  | Extended Hours            |                                         |
|  | Weekends Only             |                                         |
|  | + Create new schedule     |                                         |
|  +---------------------------+                                         |
|                                                                        |
|                                                                        |
|  SCHEDULE PREVIEW                                                      |
|  ----------------------------------------------------------------      |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |  Mon   9:00 AM  -  5:00 PM                                       | |
|  |  Tue   9:00 AM  -  5:00 PM                                       | |
|  |  Wed   9:00 AM  -  5:00 PM                                       | |
|  |  Thu   9:00 AM  -  5:00 PM                                       | |
|  |  Fri   9:00 AM  -  5:00 PM                                       | |
|  |  Sat   Unavailable                                                | |
|  |  Sun   Unavailable                                                | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  Timezone: America/New_York (EST)                                      |
|  [Edit Schedule]                                                       |
|                                                                        |
|                                                                        |
|  DATE OVERRIDES                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Override specific dates with custom availability.                     |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | Mar 20, 2026   1:00 PM - 3:00 PM            [Edit] [x Remove]   | |
|  +------------------------------------------------------------------+ |
|  | Apr 1, 2026    Unavailable                   [Edit] [x Remove]   | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  [+ Add Date Override]                                                 |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 3: Limits

```
+------------------------------------------------------------------------+
|                                                                        |
|  BOOKING LIMITS                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Before Event                                                          |
|                                                                        |
|  Buffer time before event                                              |
|  +------------------------------------------------------------------+ |
|  | [v]  No buffer                                                    | |
|  +------------------------------------------------------------------+ |
|  Options: No buffer, 5 min, 10 min, 15 min, 30 min, 45 min, 1 hour  |
|                                                                        |
|  After Event                                                           |
|                                                                        |
|  Buffer time after event                                               |
|  +------------------------------------------------------------------+ |
|  | [v]  15 minutes                                                   | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|                                                                        |
|  MINIMUM NOTICE                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Minimum time before the event that a booking can be made              |
|  +--------------------+  +------------------------------------------+ |
|  | 4                  |  | [v]  hours                                | |
|  +--------------------+  +------------------------------------------+ |
|                                                                        |
|                                                                        |
|  BOOKING WINDOW                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  How far in advance can this event be booked?                          |
|  ( ) Unlimited - into the future                                       |
|  (o) Within a date range                                               |
|      +--------------------+  +--------------------------------------+ |
|      | 60                 |  | [v]  calendar days                    | |
|      +--------------------+  +--------------------------------------+ |
|  ( ) Within a specific date range                                      |
|      [  Start Date  ] to [  End Date  ]                                |
|                                                                        |
|                                                                        |
|  SLOT INTERVALS                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Frequency of available time slots                                     |
|  +------------------------------------------------------------------+ |
|  | [v]  Use event duration (30 min)                                  | |
|  +------------------------------------------------------------------+ |
|  Options: 5 min, 10 min, 15 min, 20 min, 30 min, 60 min, Use event  |
|                                                                        |
|                                                                        |
|  BOOKING FREQUENCY                                                     |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Limit how many times this event can be booked                         |
|  [ ] Limit total bookings                                              |
|      Max [____] bookings per [v day / week / month]                    |
|                                                                        |
|  [ ] Limit future bookings                                             |
|      Max [____] upcoming bookings at a time                            |
|                                                                        |
|                                                                        |
|  SEATS                                                                 |
|  ----------------------------------------------------------------      |
|                                                                        |
|  [ ] Enable seats for this event                                       |
|      Number of seats per time slot                                     |
|      +--------------------+                                            |
|      | 10                 |                                            |
|      +--------------------+                                            |
|      [ ] Show attendees to other bookers                               |
|      [ ] Allow booking a seat for multiple attendees                   |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 4: Advanced

```
+------------------------------------------------------------------------+
|                                                                        |
|  CONFIRMATION                                                          |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Requires confirmation                                                 |
|  ( ) Always auto-accept bookings                                       |
|  (o) Require manual confirmation                                       |
|  ( ) Require confirmation for bookings scheduled with less than        |
|      [____] hours notice                                               |
|                                                                        |
|  Redirect on booking                                                   |
|  +------------------------------------------------------------------+ |
|  | https://example.com/thank-you                                     | |
|  +------------------------------------------------------------------+ |
|  Leave blank to show default booking confirmation page                 |
|                                                                        |
|                                                                        |
|  NOTIFICATIONS                                                         |
|  ----------------------------------------------------------------      |
|                                                                        |
|  [x] Send confirmation email to host                                   |
|  [x] Send confirmation email to attendee                               |
|  [x] Send calendar invitation to attendee                              |
|                                                                        |
|                                                                        |
|  BOOKING QUESTIONS                                                     |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Questions asked during booking (drag to reorder)                      |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [=] Name *                              Text   Required  [Edit]  | |
|  +------------------------------------------------------------------+ |
|  | [=] Email *                             Email  Required  [Edit]  | |
|  +------------------------------------------------------------------+ |
|  | [=] Additional Notes                    Long Text        [Edit]  | |
|  +------------------------------------------------------------------+ |
|  | [=] Company                             Text             [Edit]  | |
|  +------------------------------------------------------------------+ |
|  | [=] How did you hear about us?          Select           [Edit]  | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  [+ Add a question]                                                    |
|                                                                        |
|  Question type options:                                                |
|  +---------------------------+                                         |
|  | Text (short answer)       |                                         |
|  | Long Text (paragraph)     |                                         |
|  | Number                    |                                         |
|  | Select (dropdown)         |                                         |
|  | Multi-select (checkboxes) |                                         |
|  | Radio buttons             |                                         |
|  | Phone Number              |                                         |
|  | Address                   |                                         |
|  +---------------------------+                                         |
|                                                                        |
|                                                                        |
|  CALENDAR NOTES                                                        |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Include additional notes in calendar event                            |
|  +------------------------------------------------------------------+ |
|  | Meeting agenda: {WHAT_IS_THIS_MEETING_ABOUT}                      | |
|  | Attendee: {ATTENDEE_NAME} ({ATTENDEE_EMAIL})                      | |
|  |                                                              Bold | |
|  |                                                    Italic  Links | |
|  +------------------------------------------------------------------+ |
|  Available variables: {ATTENDEE_NAME}, {ATTENDEE_EMAIL},              |
|  {EVENT_NAME}, {EVENT_DATE}, {EVENT_TIME}, {LOCATION},                |
|  {WHAT_IS_THIS_MEETING_ABOUT}                                         |
|                                                                        |
|                                                                        |
|  PAYMENTS                                                              |
|  ----------------------------------------------------------------      |
|                                                                        |
|  [ ] Require payment before booking                                    |
|      Payment provider                                                  |
|      +-------------------------------+                                 |
|      | [v]  Stripe                    |                                 |
|      +-------------------------------+                                 |
|      Amount                                                            |
|      +---------------+  +------------+                                 |
|      | 150.00        |  | [v]  USD   |                                 |
|      +---------------+  +------------+                                 |
|      [ ] Require payment for rescheduling                              |
|                                                                        |
|                                                                        |
|  EVENT SETUP                                                           |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Event name in calendar                                                |
|  +------------------------------------------------------------------+ |
|  | {EVENT_TYPE_TITLE} between {ORGANISER} and {ATTENDEE}             | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  Hide calendar notes                                                   |
|  [ ] Don't show extra notes in the calendar event                      |
|                                                                        |
|  Event color                                                           |
|  [o Red] [o Blue] [o Green] [o Orange] [o Purple] [o Default]         |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 5: Recurring

```
+------------------------------------------------------------------------+
|                                                                        |
|  RECURRING EVENT                                                       |
|  ----------------------------------------------------------------      |
|                                                                        |
|  [ ] Enable recurring bookings                                         |
|                                                                        |
|  (When enabled, the following options appear:)                         |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  |                                                                    | |
|  |  Frequency                                                         | |
|  |  +------+  +----------------------------------------------------+ | |
|  |  | 1    |  | [v]  week(s)                                        | | |
|  |  +------+  +----------------------------------------------------+ | |
|  |  Options: day(s), week(s), month(s), year(s)                       | |
|  |                                                                    | |
|  |                                                                    | |
|  |  Maximum recurring events                                          | |
|  |  +------------------------------------------------------+         | |
|  |  | 12                                                    |         | |
|  |  +------------------------------------------------------+         | |
|  |  How many times this event can repeat                              | |
|  |                                                                    | |
|  |                                                                    | |
|  |  Recurring end condition                                           | |
|  |  (o) After [12] occurrences                                        | |
|  |  ( ) On specific date  [  End Date  ]                              | |
|  |  ( ) Never (continue indefinitely)                                 | |
|  |                                                                    | |
|  |                                                                    | |
|  |  Preview                                                           | |
|  |  +------------------------------------------------------------+   | |
|  |  | Every week on Monday for 12 weeks                          |   | |
|  |  | Next occurrences:                                          |   | |
|  |  |   Mar 16, 2026                                             |   | |
|  |  |   Mar 23, 2026                                             |   | |
|  |  |   Mar 30, 2026                                             |   | |
|  |  |   Apr 6, 2026                                              |   | |
|  |  |   ... and 8 more                                           |   | |
|  |  +------------------------------------------------------------+   | |
|  |                                                                    | |
|  +------------------------------------------------------------------+ |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Tab 6: Workflows

```
+------------------------------------------------------------------------+
|                                                                        |
|  WORKFLOWS                                                             |
|  ----------------------------------------------------------------      |
|                                                                        |
|  Automate notifications and actions before or after this event.        |
|                                                                        |
|  Active Workflows                                                      |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [Zap icon]  New Booking Notification                              | |
|  |             Trigger: When a new booking is created                | |
|  |             Actions: Send email to host, Send Slack message       | |
|  |                                                     [Active (o)] | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [Zap icon]  24-Hour Reminder                                      | |
|  |             Trigger: 24 hours before event                        | |
|  |             Actions: Send reminder email to attendee              | |
|  |                                                     [Active (o)] | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [Zap icon]  Follow-up Email                                       | |
|  |             Trigger: After event ends                             | |
|  |             Actions: Send follow-up email after 1 hour            | |
|  |                                                   [Inactive --o] | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|                                                                        |
|  Available Workflows                                                   |
|                                                                        |
|  +------------------------------------------------------------------+ |
|  | [Zap icon]  Post-Meeting Survey                     [+ Add]      | |
|  |             Sends a satisfaction survey after meeting              | |
|  +------------------------------------------------------------------+ |
|  | [Zap icon]  No-Show Follow-up                       [+ Add]      | |
|  |             Sends follow-up if attendee didn't join               | |
|  +------------------------------------------------------------------+ |
|                                                                        |
|  [Manage Workflows ->]                                                 |
|                                                                        |
+------------------------------------------------------------------------+
```

---

### Save Bar (Sticky Bottom)

```
+------------------------------------------------------------------------+
|                                                                        |
|  [Warning icon] You have unsaved changes     [Discard]   [   Save   ] |
|                                                                        |
+------------------------------------------------------------------------+
```

### Save Success Toast

```
+----------------------------------+
| [Check] Event type saved         |
+----------------------------------+
```

## Components
- `Shell` - Main application shell with nav
- `VerticalTabs` or `HorizontalTabs` - Tab navigation for editor sections
- `TextField` - Text input fields (title, URL slug, custom fields)
- `TextArea` / `Editor` - Rich text editor for description and calendar notes
- `Select` - Dropdown selects (schedule, buffer time, currency)
- `RadioGroup` - Radio button groups (scheduling type, confirmation mode)
- `Checkbox` - Checkbox fields (notification toggles, seat options)
- `Toggle` - On/off switches (recurring, payments, workflows)
- `NumberInput` - Numeric fields (duration, min notice, seat count, price)
- `DurationPicker` - Preset duration buttons
- `LocationSelect` - Location type picker with configuration
- `Button` - Action buttons (Save, Discard, Add, Remove)
- `Dialog` - Modals for adding questions, locations, hosts
- `SortableList` - Drag-to-reorder list for booking questions
- `Badge` - Status badges and labels
- `Alert` - Unsaved changes warning bar
- `Toast` - Success/error feedback notifications
- `ColorPicker` - Event color selector
- `DatePicker` - Date picker for overrides and recurring end date
- `Tooltip` - Help text tooltips next to form labels

## User Actions
- Switch between tabs (Setup, Availability, Limits, Advanced, Recurring, Workflows)
- Edit title, URL slug, description fields
- Select or change duration (preset or custom)
- Add/remove locations for the event
- Choose scheduling type (collective, round-robin, managed)
- Add/remove hosts
- Select availability schedule from dropdown
- Add/edit/remove date overrides
- Configure buffer times (before and after)
- Set minimum booking notice
- Set booking window (how far in advance)
- Choose slot interval frequency
- Set booking frequency limits
- Enable/configure seats
- Choose confirmation mode (auto, manual, conditional)
- Add/edit/reorder/remove booking questions
- Configure calendar event notes with variables
- Enable/configure payment requirements
- Enable/configure recurring event settings
- Activate/deactivate workflows
- Add available workflows to this event type
- Click Save to persist changes
- Click Discard to revert unsaved changes
- Click Preview to open public booking page
- Click Copy URL to copy booking link

## Navigation
- "Back to Event Types" navigates to `/event-types`
- Tab clicks update content area (same URL, different tab state)
- "Edit Schedule" links to `/availability/[scheduleId]`
- "Manage Workflows" links to `/workflows`
- "Preview" opens `cal.com/username/[slug]` in new tab
- Main nav links to other top-level sections

## States

### Loading
```
+--------------------------------------------------------------------+
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~                                      |
|  ~~~~~~~~~~~~~~~~~~~~~~                                            |
|                                                                    |
|  [Setup]  [Availability]  [Limits]  [Advanced]  [Recurring]       |
|                                                                    |
|  ~~~~~~~~~~                                                        |
|  +--------------------------------------------------------------+  |
|  | ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                 |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  ~~~~~~~~~~                                                        |
|  +--------------------------------------------------------------+  |
|  | ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                 |  |
|  +--------------------------------------------------------------+  |
(Skeleton form fields with pulsing placeholders)
```

### Unsaved Changes Warning
```
+--------------------------------------------------------------------+
|  [!] You have unsaved changes         [Discard]   [   Save   ]    |
+--------------------------------------------------------------------+
(Sticky bar at bottom, appears when any field is modified)
```

### Save Error
```
+----------------------------------+
| [X] Failed to save. Try again.   |
+----------------------------------+
```

### Validation Error (inline)
```
  Title *
  +------------------------------------------------------------------+
  |                                                                  |
  +------------------------------------------------------------------+
  [!] Title is required

  URL Slug *
  cal.com/username/
  +------------------------------------------------------------------+
  | my event!!!                                                      |
  +------------------------------------------------------------------+
  [!] URL can only contain lowercase letters, numbers, and hyphens
```

### Event Type Not Found
```
+--------------------------------------------------------------------+
|                                                                    |
|                   [404 illustration]                                |
|                                                                    |
|              Event type not found                                  |
|     This event type doesn't exist or you don't have               |
|     permission to edit it.                                         |
|                                                                    |
|              [Back to Event Types]                                 |
|                                                                    |
+--------------------------------------------------------------------+
```
