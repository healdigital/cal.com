# Availability

**Route:** `/availability`
**Type:** Authenticated
**Parent Layout:** Main Nav

## Description
Main availability page listing all user schedules. Each schedule shows its name, timezone, a brief summary of configured hours, a toggle to set it as the default schedule, and edit/delete actions. A prominent "New Schedule" button allows creating additional schedules.

## Wireframe

```
+------------------------------------------------------------------+
| Cal.com                    [?] [Bell] [Avatar v]                 |
+----------+-------------------------------------------------------+
| Event    |                                                       |
| Types    |  Availability                        [+ New Schedule] |
| Bookings |  -------------------------------------------------   |
| Availab. |                                                       |
| Teams    |  +--------------------------------------------------+ |
| Apps     |  | Working Hours                          [Default]  | |
|          |  | America/New_York (EDT)                            | |
|          |  |                                                    | |
|          |  | Mon - Fri  9:00 AM - 5:00 PM                      | |
|          |  | Sat - Sun  Off                                    | |
|          |  |                                                    | |
|          |  |                              [Edit]  [...]        | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | Evening Availability                   [ ]        | |
|          |  | Europe/London (GMT)                                | |
|          |  |                                                    | |
|          |  | Mon - Thu  6:00 PM - 9:00 PM                      | |
|          |  | Fri - Sun  Off                                    | |
|          |  |                                                    | |
|          |  |                              [Edit]  [...]        | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | Weekend Only                           [ ]        | |
|          |  | America/Los_Angeles (PDT)                          | |
|          |  |                                                    | |
|          |  | Mon - Fri  Off                                    | |
|          |  | Sat - Sun  10:00 AM - 4:00 PM                     | |
|          |  |                                                    | |
|          |  |                              [Edit]  [...]        | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
+----------+-------------------------------------------------------+

[...] Menu (expanded):
+------------------+
| Duplicate        |
| Set as Default   |
|------------------|
| Delete           |
+------------------+
```

## Components
- Shell / Main Navigation sidebar
- Page header with title and "New Schedule" button
- ScheduleCard (repeated per schedule)
  - Schedule name
  - Timezone label with abbreviation
  - Day-range hour summary (collapsed view)
  - Default toggle (radio-style, only one active)
  - Edit button
  - Overflow menu (duplicate, set as default, delete)

## User Actions
- Click "New Schedule" to create a new schedule (opens schedule editor)
- Toggle "Default" to set a schedule as the default for new event types
- Click "Edit" to navigate to the schedule editor
- Click "..." to open overflow menu
  - Duplicate: clones the schedule
  - Set as Default: marks schedule as default
  - Delete: shows confirmation dialog, then removes the schedule

## Navigation
- "New Schedule" -> `/availability/new`
- "Edit" -> `/availability/[scheduleId]`
- Sidebar links to other main sections

## States
- **Loading:** Skeleton cards (3 placeholder cards with pulsing lines)
- **Empty:** Illustration with "No schedules yet" message and "Create your first schedule" CTA button
- **Error:** Banner at top: "Failed to load schedules. Please try again." with retry button
- **Single schedule:** Delete action is disabled or hidden (must have at least one schedule)
