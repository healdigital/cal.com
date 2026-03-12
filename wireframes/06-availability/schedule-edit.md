# Schedule Editor

**Route:** `/availability/[schedule]`
**Type:** Authenticated
**Parent Layout:** Main Nav

## Description
Full schedule editor for a single availability schedule. Allows editing the schedule name, selecting a timezone, toggling days on/off with configurable time ranges per day (multiple ranges supported), and adding date-specific overrides for holidays or special hours.

## Wireframe

```
+------------------------------------------------------------------+
| Cal.com                    [?] [Bell] [Avatar v]                 |
+----------+-------------------------------------------------------+
| Event    |                                                       |
| Types    |  <- Back to Availability                              |
| Bookings |                                                       |
| Availab. |  Schedule Name                                        |
| Teams    |  +--------------------------------------------------+ |
| Apps     |  | Working Hours                                    | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Timezone                                             |
|          |  +--------------------------------------------------+ |
|          |  | America/New_York (EDT)                        [v] | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Weekly Hours                                         |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  [x] Mon  [09:00 AM] - [05:00 PM]  [x] [+]          |
|          |                                                       |
|          |  [x] Tue  [09:00 AM] - [05:00 PM]  [x] [+]          |
|          |                                                       |
|          |  [x] Wed  [09:00 AM] - [05:00 PM]  [x] [+]          |
|          |           [06:00 PM] - [08:00 PM]  [x]               |
|          |                                                       |
|          |  [x] Thu  [09:00 AM] - [05:00 PM]  [x] [+]          |
|          |                                                       |
|          |  [x] Fri  [09:00 AM] - [05:00 PM]  [x] [+]          |
|          |                                                       |
|          |  [ ] Sat  Unavailable                                 |
|          |                                                       |
|          |  [ ] Sun  Unavailable                                 |
|          |                                                       |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  Date Overrides                                       |
|          |  Dates when your hours differ from your regular       |
|          |  weekly hours.                                        |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | Dec 25, 2026 - Unavailable all day          [x]  | |
|          |  +--------------------------------------------------+ |
|          |  +--------------------------------------------------+ |
|          |  | Jan 2, 2027 - 10:00 AM - 2:00 PM            [x]  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  [+ Add date override]                                |
|          |                                                       |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |                              [Cancel]  [Save]        |
|          |                                                       |
+----------+-------------------------------------------------------+

Weekly Hours Detail (single day row):
+--------------------------------------------------------------+
| [x] Mon  [09:00 AM v] - [05:00 PM v]  [x remove] [+ add]   |
|          [06:00 PM v] - [08:00 PM v]  [x remove]            |
+--------------------------------------------------------------+

   [x] = checkbox (day toggle)
   [x remove] = remove this time range
   [+ add] = add another time range to this day

Date Override Dialog:
+------------------------------------------+
|  Add Date Override                   [X] |
|                                          |
|  Select Date                             |
|  +------------------+                    |
|  |  << March 2026 >>|                    |
|  |  Mo Tu We Th Fr Sa Su                |
|  |                    1                  |
|  |   2  3  4  5  6  7  8                |
|  |   9 10 11 12 13 14 15                |
|  |  16 17 18 19 20 21 22                |
|  |  23 24 25 26 27 28 29                |
|  |  30 31                               |
|  +------------------+                    |
|                                          |
|  ( ) Unavailable all day                 |
|  (o) Custom hours                        |
|      [10:00 AM] - [02:00 PM]  [+]       |
|                                          |
|              [Cancel]  [Apply]           |
+------------------------------------------+
```

## Components
- Back link to `/availability`
- Schedule name text input
- Timezone selector (searchable dropdown with timezone + abbreviation)
- Weekly hours grid
  - Day toggle checkbox (Mon-Sun)
  - Time range row per active day
    - Start time dropdown (15-min increments)
    - End time dropdown (15-min increments)
    - Remove range button (trash icon)
    - Add range button (+ icon, only on last range row)
  - "Unavailable" label for toggled-off days
- Date overrides section
  - List of existing overrides (date, hours or "Unavailable", remove button)
  - "Add date override" button opens modal
- Date override modal
  - Calendar date picker
  - Radio: Unavailable all day / Custom hours
  - Time range inputs (if custom hours selected)
  - Cancel / Apply buttons
- Footer action bar with Cancel and Save buttons

## User Actions
- Edit schedule name inline
- Change timezone via searchable dropdown
- Toggle days on/off via checkboxes
- Adjust start/end times for each day via time dropdowns
- Add additional time ranges to a day (e.g., morning + evening split)
- Remove a time range from a day
- Add a date override via the modal
- Remove existing date overrides
- Cancel (discard changes, navigate back)
- Save (persist changes, navigate back)

## Navigation
- "Back to Availability" -> `/availability`
- "Cancel" -> `/availability`
- "Save" -> `/availability` (after successful save)

## States
- **Loading:** Skeleton form fields with pulsing placeholders
- **Validation error:** Red border on conflicting or invalid time ranges, inline error message (e.g., "End time must be after start time")
- **Overlap warning:** Orange highlight when two time ranges on the same day overlap
- **Unsaved changes:** Browser beforeunload prompt if navigating away with unsaved edits
- **Save in progress:** Save button shows spinner, form inputs disabled
- **Save error:** Toast notification: "Failed to save schedule. Please try again."
- **New schedule:** Empty form with default values (Mon-Fri 9-5, user's detected timezone)
