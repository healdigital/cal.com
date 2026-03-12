# Booking Page

**Route:** `/[user]/[type]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
THE CORE SCREEN OF CAL.COM. This is the main booking page where a visitor selects a date, picks a time slot, and fills in their details to confirm a booking. It uses a two-panel layout: left panel shows event information, right panel shows the interactive calendar and time slot picker. After selecting a time slot, a booking form slides in for the user to enter their details.

## Wireframe - Step 1: Date & Time Selection

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +----+                 |  |  < March 2026 >                  ||
| |  |Ava |  Jane Smith     |  |                                  ||
| |  +----+                 |  |  Mo  Tu  We  Th  Fr  Sa  Su      ||
| |                         |  |                                  ||
| |  Quick Chat             |  |                   1              ||
| |                         |  |   2   3   4   5   6   7   8      ||
| |  +------+  +--------+  |  |   9  10  11 [12] 13  14  15      ||
| |  | 15m  |  | Google  |  |  |  16  17  18  19  20  21  22      ||
| |  | icon |  | Meet    |  |  |  23  24  25  26  27  28  29      ||
| |  +------+  +--------+  |  |  30  31                           ||
| |                         |  |                                  ||
| |  A short introductory   |  |  * Gray = unavailable            ||
| |  call to discuss your   |  |  * [12] = selected/today         ||
| |  needs and see how I    |  |  * Bold = available              ||
| |  can help.              |  |                                  ||
| |                         |  +----------------------------------+|
| |                         |                                      |
| |                         |  +----------------------------------+|
| |                         |  | Timezone: America/New_York  [v]  ||
| |                         |  +----------------------------------+|
| |                         |                                      |
| +-------------------------+                                      |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Wireframe - Step 2: Time Slot Selection (after date click)

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+ +----------------+ +----------------+|
| |                         | |                | |                ||
| |  +----+                 | | < March 2026 > | | Thu, Mar 12    ||
| |  |Ava |  Jane Smith     | |                | |                ||
| |  +----+                 | | Mo Tu We Th Fr | | +-----------+  ||
| |                         | |              1 | | | 9:00 AM   |  ||
| |  Quick Chat             | |  2  3  4  5  6 | | +-----------+  ||
| |                         | |  9 10 11[12]13 | |                ||
| |  +------+  +--------+  | | 16 17 18 19 20 | | +-----------+  ||
| |  | 15m  |  | Google  |  | | 23 24 25 26 27 | | | 9:30 AM   |  ||
| |  | icon |  | Meet    |  | | 30 31          | | +-----------+  ||
| |  +------+  +--------+  | |                | |                ||
| |                         | |                | | +-----------+  ||
| |  A short introductory   | |                | | |10:00 AM   |  ||
| |  call to discuss your   | |                | | +-----------+  ||
| |  needs and see how I    | |                | |                ||
| |  can help.              | |                | | +-----------+  ||
| |                         | |                | | |10:30 AM   |  ||
| |                         | |                | | +-----------+  ||
| |  Thursday, March 12     | |                | |                ||
| |  9:00 AM - 9:15 AM      | |                | | +-----------+  ||
| |  (America/New_York)     | |                | | |11:00 AM   |  ||
| |                         | |                | | +-----------+  ||
| |                         | +----------------+ |                ||
| |                         |                    | +-----------+  ||
| |                         | Timezone:          | |11:30 AM   |  ||
| |                         | America/New_York[v]| +-----------+  ||
| |                         |                    |                ||
| +-------------------------+ +------------------+----------------+|
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Wireframe - Step 3: Booking Form (after time slot click)

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
| +-------------------------+  +----------------------------------+|
| |                         |  |                                  ||
| |  +----+                 |  |  Your name *                     ||
| |  |Ava |  Jane Smith     |  |  +------------------------------+||
| |  +----+                 |  |  | John Doe                     |||
| |                         |  |  +------------------------------+||
| |  Quick Chat             |  |                                  ||
| |                         |  |  Email address *                 ||
| |  +------+  +--------+  |  |  +------------------------------+||
| |  | 15m  |  | Google  |  |  |  | john@example.com             |||
| |  | icon |  | Meet    |  |  |  +------------------------------+||
| |  +------+  +--------+  |  |                                  ||
| |                         |  |  Location                        ||
| |  A short introductory   |  |  +------------------------------+||
| |  call to discuss your   |  |  | Google Meet (auto)           |||
| |  needs and see how I    |  |  +------------------------------+||
| |  can help.              |  |                                  ||
| |                         |  |  Additional notes                ||
| |  Thursday, March 12     |  |  +------------------------------+||
| |  9:00 AM - 9:15 AM      |  |  |                              |||
| |  (America/New_York)     |  |  |  Anything you'd like to      |||
| |                         |  |  |  discuss...                   |||
| |                         |  |  |                              |||
| |                         |  |  +------------------------------+||
| |                         |  |                                  ||
| |                         |  |  +--------+  +----------------+  ||
| |                         |  |  | < Back |  | Confirm        |  ||
| |                         |  |  +--------+  +----------------+  ||
| |                         |  |                                  ||
| +-------------------------+  +----------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Wireframe - Calendar Grid Detail

```
+------------------------------------------+
|            < March 2026 >                |
+------------------------------------------+
|  Mo    Tu    We    Th    Fr   Sa    Su   |
+------+------+------+------+------+------+
|      |      |      |      |      |      |
|      |      |      |      |      |   1  |
|      |      |      |      |      |      |
+------+------+------+------+------+------+
|      |      |      |      |      |      |
|   2  |   3  |   4  |   5  |   6  |   7  |
|      |      |      |      |      |      |
+------+------+------+------+------+------+
|      |      |      |      |      |      |
|   8  |      |      |      |      |      |
|      |      |      |      |      |      |
+------+------+------+------+------+------+
|  .   = available (bold, clickable)       |
| [ ]  = selected date (highlighted bg)    |
|  x   = unavailable (gray, not clickable) |
|  o   = today indicator (dot below)       |
+------------------------------------------+

Day states:
  - Available:    bold text, pointer cursor
  - Unavailable:  gray text, no cursor
  - Selected:     blue/primary background, white text
  - Today:        small dot indicator below number
  - Past:         gray, not clickable
  - Weekend:      may be available or unavailable
```

## Wireframe - Time Slot List Detail

```
+------------------------+
|  Thursday, March 12    |
+------------------------+
|                        |
|  +------------------+  |
|  |    9:00 AM       |  |  <- Default state (outlined)
|  +------------------+  |
|                        |
|  +==================+  |
|  ||   9:30 AM      ||  |  <- Hover state (highlighted)
|  +==================+  |
|                        |
|  +------------------+  |
|  |   10:00 AM       |  |
|  +------------------+  |
|                        |
|  +--XXXXXXXXXX------+  |
|  |   10:30 AM       |  |  <- Selected state (filled primary)
|  |  [ Confirm  > ]  |  |     Shows confirm button inline
|  +------------------+  |
|                        |
|  +------------------+  |
|  |   11:00 AM       |  |
|  +------------------+  |
|                        |
|  +------------------+  |
|  |   11:30 AM       |  |
|  +------------------+  |
|                        |
|  +------------------+  |
|  |   1:00 PM        |  |
|  +------------------+  |
|                        |
|  +------------------+  |
|  |   1:30 PM        |  |
|  +------------------+  |
|                        |
|  +------------------+  |
|  |   2:00 PM        |  |
|  +------------------+  |
|                        |
|  (scroll for more)     |
+------------------------+
```

## Wireframe - Timezone Selector

```
+----------------------------------------+
| Timezone: America/New_York          [v] |
+----------------------------------------+
       |                              |
       | +----------------------------+
       | | Search timezones...        |
       | +----------------------------+
       | | America/New_York (EDT)     |  <- current
       | | America/Chicago (CDT)      |
       | | America/Denver (MDT)       |
       | | America/Los_Angeles (PDT)  |
       | | Europe/London (BST)        |
       | | Europe/Paris (CEST)        |
       | | Asia/Tokyo (JST)           |
       | | (scroll for more...)       |
       | +----------------------------+
```

## Components
- `EventInfoPanel` - Left panel with event details
  - `Avatar` - Host profile image
  - `HostName` - Host display name
  - `EventTitle` - Event type name (h1)
  - `DurationBadge` - Clock icon + duration text
  - `LocationInfo` - Video/phone/in-person icon + label
  - `EventDescription` - Markdown-rendered description
  - `SelectedDateTimeSummary` - Shows after time is selected
- `CalendarGrid` - Interactive month calendar
  - `MonthNavigation` - Left/right arrows + month/year label
  - `DayCell` - Individual day with available/unavailable/selected states
  - `WeekdayHeaders` - Mo Tu We Th Fr Sa Su
- `TimeSlotList` - Scrollable list of available times
  - `TimeSlotButton` - Individual time slot (outline -> filled on select)
  - `DateHeader` - Selected date displayed above slots
- `TimezoneSelector` - Dropdown with search for timezone selection
- `BookingForm` - Form fields for booking confirmation
  - `NameInput` - Required text input
  - `EmailInput` - Required email input
  - `LocationDisplay` - Read-only or selectable location
  - `NotesTextarea` - Optional multiline notes
  - `GuestsInput` - Optional additional attendee emails
  - `BackButton` - Return to time selection
  - `ConfirmButton` - Submit booking (primary CTA)
- `PoweredByBanner` - Cal.com branding footer

## User Actions
1. View event information in the left panel
2. Navigate months using `<` and `>` arrows
3. Click an available date on the calendar grid
4. Scroll through time slots for the selected date
5. Click a time slot to select it
6. (Optional) Change timezone via timezone dropdown
7. Fill in name, email, and optional notes
8. Click "Confirm" to create the booking
9. Click "Back" to return to time selection

## Navigation
- Back button -> returns to time selection (step 2) or date selection (step 1)
- Confirm button -> `/booking/[uid]` (booking confirmation page)
- Host name/avatar -> `/[user]` (user profile)
- Browser back -> previous step or user profile

## States
- **Loading:** Skeleton for calendar grid and left panel
- **Date Selection:** Calendar visible, no time slots shown yet
- **Time Selection:** Calendar + time slot list visible, three-column layout
- **Form Entry:** Left panel + booking form, calendar hidden
- **Submitting:** Confirm button shows spinner, form disabled
- **Error:** Inline error messages on form fields, toast for server errors
- **No Availability:** "No available times" message for selected date
- **Month Empty:** All days grayed out if no availability in month
- **Timezone Changed:** Time slots refresh with new timezone times
