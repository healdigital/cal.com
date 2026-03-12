# Bookings List

**Route:** `/bookings/[status]`
**Type:** Authenticated
**Parent Layout:** Main Nav (Shell)

## Description
Central hub for managing all bookings. Users can filter by status using tabs, search for specific bookings, and take actions like cancel, reschedule, or edit on individual booking entries.

## Wireframe

```
+------------------------------------------------------------------------+
| [Cal Logo]   Bookings   Event Types   Availability   Apps   Settings   |
|                                                    [?] [Bell] [Avatar] |
+------------------------------------------------------------------------+
|                                                                        |
|  Bookings                                                              |
|                                                                        |
|  +------------+  +-----------+  +------+  +-----------+                |
|  | Upcoming * |  | Recurring |  | Past |  | Cancelled |                |
|  +------------+  +-----------+  +------+  +-----------+                |
|                                                                        |
|  +------------------------------------------+  +------------------+   |
|  | [Q] Search bookings...                    |  | [Funnel] Filter  |   |
|  +------------------------------------------+  +------------------+   |
|                                                                        |
|  +--------------------------------------------------------------------+|
|  | +------+  30-Min Strategy Call                                     ||
|  | |      |  Mon, Mar 16, 2026 - 10:00 AM - 10:30 AM (EST)          ||
|  | | Icon |                                                           ||
|  | |      |  [Avatar] John Doe  john@example.com     +------------+  ||
|  | +------+                                          | Confirmed  |  ||
|  |                                                   +------------+  ||
|  |                                                                    ||
|  |  [Reschedule]   [Cancel]   [Edit]   [...]                        ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  | +------+  Product Demo                                             ||
|  | |      |  Tue, Mar 17, 2026 - 2:00 PM - 3:00 PM (EST)            ||
|  | | Icon |                                                           ||
|  | |      |  [Avatar] Jane Smith  jane@acme.co       +------------+  ||
|  | +------+                                          | Pending    |  ||
|  |                                                   +------------+  ||
|  |                                                                    ||
|  |  [Confirm]   [Reschedule]   [Cancel]   [...]                     ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  | +------+  Weekly Standup                                           ||
|  | |      |  Wed, Mar 18, 2026 - 9:00 AM - 9:15 AM (EST)            ||
|  | | Icon |                                                           ||
|  | |      |  [Avatar] Team (4 attendees)             +------------+  ||
|  | +------+                                          | Confirmed  |  ||
|  |                                                   +------------+  ||
|  |                                                                    ||
|  |  [Reschedule]   [Cancel]   [Edit]   [...]                        ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  +--------------------------------------------------------------------+|
|  | +------+  Onboarding Call                                          ||
|  | |      |  Thu, Mar 19, 2026 - 11:00 AM - 11:45 AM (EST)          ||
|  | | Icon |                                                           ||
|  | |      |  [Avatar] Alex Kim  alex@startup.io      +------------+  ||
|  | +------+                                          | Unconfirmed|  ||
|  |                                                   +------------+  ||
|  |                                                                    ||
|  |  [Confirm]   [Reschedule]   [Cancel]   [...]                     ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|                      [< Prev]  1  2  3  [Next >]                      |
|                                                                        |
+------------------------------------------------------------------------+
```

### Filter Dropdown (when Filter button is clicked)

```
+---------------------------+
| Filter Bookings           |
|                           |
| Event Type                |
| [v  All Event Types    ]  |
|                           |
| Date Range                |
| [  Start Date  ] - [End] |
|                           |
| Attendee                  |
| [  Search attendee...  ]  |
|                           |
| [Apply Filters]  [Reset] |
+---------------------------+
```

### Action Menu (...) Expanded

```
+---------------------+
| View Details        |
| Edit Notes          |
| Request Reschedule  |
| Copy Meeting Link   |
| Download .ics       |
|---------------------|
| Cancel Booking      |
+---------------------+
```

## Components
- `Shell` - Main application shell with nav
- `HorizontalTabs` - Tab bar for booking status (Upcoming, Recurring, Past, Cancelled)
- `TextField` - Search input field
- `Button` - Filter button with funnel icon
- `BookingListItem` - Booking card with event info, attendee, status, actions
- `Badge` - Status badge (Confirmed, Pending, Unconfirmed, Cancelled)
- `Avatar` - Attendee avatar thumbnail
- `DropdownMenu` - Overflow action menu
- `Pagination` - Page navigation controls
- `EmptyScreen` - Empty state when no bookings match
- `FilterDialog` - Filter popover/dialog

## User Actions
- Click tab to switch between Upcoming / Recurring / Past / Cancelled views
- Type in search bar to filter bookings by title, attendee name, or email
- Click Filter button to open filter panel (event type, date range, attendee)
- Click Reschedule to open reschedule flow for a booking
- Click Cancel to initiate booking cancellation (with confirmation dialog)
- Click Edit to modify booking notes or details
- Click Confirm on pending bookings to confirm them
- Click overflow menu (...) for additional actions (view details, copy link, download .ics)
- Click pagination controls to navigate between pages

## Navigation
- Clicking a booking card title navigates to `/booking/[uid]` detail view
- Reschedule navigates to the reschedule page
- Tab clicks update the URL to `/bookings/upcoming`, `/bookings/recurring`, `/bookings/past`, `/bookings/cancelled`
- Main nav links to other top-level sections

## States

### Loading
```
+--------------------------------------------------------------------+
|  +------+  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~                           |
|  | .... |  ~~~~~~~~~~~~~~~~~~~~~~~~                               |
|  | .... |  ~~~~~~~  ~~~~~~~~~~                                    |
|  +------+                                                          |
+--------------------------------------------------------------------+
(3-4 skeleton booking cards with pulsing placeholders)
```

### Empty (no bookings)
```
+--------------------------------------------------------------------+
|                                                                    |
|                    [Calendar illustration]                          |
|                                                                    |
|              No upcoming bookings                                  |
|     You have no upcoming bookings. Once someone books              |
|     a time with you, it will show up here.                        |
|                                                                    |
+--------------------------------------------------------------------+
```

### Error
```
+--------------------------------------------------------------------+
|                                                                    |
|                    [Error illustration]                             |
|                                                                    |
|              Something went wrong                                  |
|     Unable to load your bookings. Please try again.               |
|                                                                    |
|                      [Try Again]                                   |
|                                                                    |
+--------------------------------------------------------------------+
```

### Cancel Confirmation Dialog
```
+-----------------------------------+
|  Cancel Booking                   |
|                                   |
|  Are you sure you want to cancel  |
|  "30-Min Strategy Call" with      |
|  John Doe?                        |
|                                   |
|  Reason (optional)                |
|  +-----------------------------+  |
|  |                             |  |
|  +-----------------------------+  |
|                                   |
|  [ ] Notify attendee via email    |
|                                   |
|  [Keep Booking]  [Cancel Booking] |
+-----------------------------------+
```
