# Settings - Push Notifications

## Overview
Enable/disable push notifications and configure notification preferences for different event types.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Push Notifications                  |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Manage push notification settings   |  |
| | |     Profile         | | |  for your browser and mobile         |  |
| | |     Appearance      | | |  devices.                            |  |
| | |     Calendars       | | |                                      |  |
| | |     Conferencing    | | |  +--[ Master Toggle ]---------------+ |  |
| | |     Features        | | |  |                                  | |  |
| | |     Out of Office   | | |  |  Enable Push Notifications       | |  |
| | | (*) Push Notif.     | | |  |                                  | |  |
| | +---------------------+ | |  |  Receive push notifications   +--+| |  |
| | ...                     | |  |  on this device.              |On|| |  |
| |                         | |  |                               +--+| |  |
| +-------------------------+ |  |                                  | |  |
|                             |  |  (!) Browser permission          | |  |
|                             |  |  required. [Allow in Browser]    | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Notification Categories ]-----+ |  |
|                             |  |                                  | |  |
|                             |  |  Choose which events trigger     | |  |
|                             |  |  push notifications.             | |  |
|                             |  |                                  | |  |
|                             |  |  BOOKINGS                        | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | New Booking Created    +---+|| |  |
|                             |  |  | When someone books     |[O ]||| |  |
|                             |  |  | a meeting with you.    +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Booking Cancelled      +---+|| |  |
|                             |  |  | When a booking is      |[O ]||| |  |
|                             |  |  | cancelled.             +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Booking Rescheduled    +---+|| |  |
|                             |  |  | When a booking is      |[O ]||| |  |
|                             |  |  | rescheduled.           +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Booking Reminder       +---+|| |  |
|                             |  |  | Reminder before a      |[  O]||| |  |
|                             |  |  | scheduled meeting.     +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  REQUESTS                        | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Pending Approval       +---+|| |  |
|                             |  |  | When a booking needs   |[O ]||| |  |
|                             |  |  | your confirmation.     +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Routing Assignment     +---+|| |  |
|                             |  |  | When a booking is      |[O ]||| |  |
|                             |  |  | routed to you.         +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  SYSTEM                          | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | Calendar Sync Error    +---+|| |  |
|                             |  |  | When a connected       |[  O]||| |  |
|                             |  |  | calendar has issues.   +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  |                              || |  |
|                             |  |  | App Updates            +---+|| |  |
|                             |  |  | New features and       |[  O]||| |  |
|                             |  |  | product announcements. +---+|| |  |
|                             |  |  |                              || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Reminder Timing ]-------------+ |  |
|                             |  |                                  | |  |
|                             |  |  Booking Reminder Timing         | |  |
|                             |  |  How early before a meeting to   | |  |
|                             |  |  send a push reminder.           | |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | 10 minutes before         [v] || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  Options: 5 min, 10 min,         | |  |
|                             |  |  15 min, 30 min, 1 hour          | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Test ]-----------------------+  |  |
|                             |  |                                  | |  |
|                             |  |  [Send Test Notification]        | |  |
|                             |  |  Verify notifications are        | |  |
|                             |  |  working on this device.         | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  (i) Changes are saved               |  |
|                             |  automatically.                      |  |
|                             |                                      |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Master Toggle | Switch | Enables/disables all push notifications |
| Browser Permission | Banner | Shows when browser permission not granted |
| Allow in Browser | Button (link) | Triggers browser permission prompt |
| Category Headers | SectionHeader | BOOKINGS, REQUESTS, SYSTEM groupings |
| Notification Toggle | Switch | Per-notification-type enable/disable |
| Reminder Timing | Select | 5/10/15/30/60 min before meeting |
| Test Button | Button (secondary) | Sends a test push notification |
| Auto-save Notice | Text | Informs toggles save automatically |

## States
- **Master Off**: All category toggles disabled/grayed, banner "Push notifications are disabled"
- **Master On, No Permission**: Warning banner with "Allow in Browser" button
- **Permission Granted**: All toggles functional, no warning banner
- **Permission Denied**: Error banner "Push notifications blocked. Update in browser settings."
- **Test Sent**: Toast "Test notification sent!" with brief delay before notification appears
- **Test Failed**: Toast "Failed to send test notification. Check browser permissions."
- **Toggling**: Brief loading state on individual switches during API call
- **Mobile**: Different layout note - some options only appear on mobile app
