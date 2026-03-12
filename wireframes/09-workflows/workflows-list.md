# Workflows List

## Route: `/workflows`

## Description
List of all automation workflows with creation button, workflow cards showing trigger type, action count, active status, and management controls.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Workflows                       [+ Create Workflow]    |
|          |                                                       |
| Event    | Automate notifications, reminders, and actions for    |
| Types    | your bookings.                                        |
| Bookings |                                                       |
| Avail.   | +------------------------------------------------------+
| Teams    | | [x] Search workflows...                              |
| Apps   * | +------------------------------------------------------+
| Workflows|                                                       |
| Settings | [All] [Active] [Inactive] [Draft]                     |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  Booking Confirmation Email                         ||
|          | |                                                    ||
|          | |  Trigger: [ICON] New Booking                        ||
|          | |  Actions: 2 (Email + Calendar Invite)               ||
|          | |  Applied to: All Event Types                        ||
|          | |                                                    ||
|          | |  [*] Active               [Toggle ON /OFF]          ||
|          | |                                                    ||
|          | |  [Edit]  [Duplicate]  [...More]                     ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  24-Hour Reminder SMS                               ||
|          | |                                                    ||
|          | |  Trigger: [ICON] Before Event (24h)                 ||
|          | |  Actions: 1 (SMS to Attendee)                       ||
|          | |  Applied to: 30 Min Meeting, Consultation           ||
|          | |                                                    ||
|          | |  [*] Active               [Toggle ON /OFF]          ||
|          | |                                                    ||
|          | |  [Edit]  [Duplicate]  [...More]                     ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  Follow-up Survey                                   ||
|          | |                                                    ||
|          | |  Trigger: [ICON] After Event (1h)                   ||
|          | |  Actions: 1 (Email with survey link)                ||
|          | |  Applied to: All Event Types                        ||
|          | |                                                    ||
|          | |  [*] Active               [Toggle ON /OFF]          ||
|          | |                                                    ||
|          | |  [Edit]  [Duplicate]  [...More]                     ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  Cancellation Notice                                ||
|          | |                                                    ||
|          | |  Trigger: [ICON] Booking Cancelled                  ||
|          | |  Actions: 2 (Email to Host + Webhook)               ||
|          | |  Applied to: All Event Types                        ||
|          | |                                                    ||
|          | |  [ ] Inactive             [Toggle ON /OFF]          ||
|          | |                                                    ||
|          | |  [Edit]  [Duplicate]  [...More]                     ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  VIP Client Webhook                        [DRAFT] ||
|          | |                                                    ||
|          | |  Trigger: [ICON] New Booking                        ||
|          | |  Actions: 1 (Webhook)                               ||
|          | |  Applied to: VIP Consultation                       ||
|          | |                                                    ||
|          | |  [ ] Draft                                          ||
|          | |                                                    ||
|          | |  [Edit]  [Duplicate]  [...More]                     ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |   Showing 5 of 5 workflows                            |
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Header**: Page title, description, "Create Workflow" primary button
- **Search Bar**: Filter workflows by name
- **Status Tabs**: All / Active / Inactive / Draft filter tabs
- **Workflow Card**:
  - Workflow name (bold)
  - Trigger type with icon (New Booking, Before Event, After Event, Cancelled, Rescheduled)
  - Action count and summary (Email, SMS, Webhook)
  - Applied event types list
  - Active/Inactive toggle switch
  - Draft badge (if unpublished)
  - Action buttons: Edit, Duplicate, More (Delete, View Logs)

## Trigger Types

| Trigger            | Icon    | Description                          |
|--------------------|---------|--------------------------------------|
| New Booking        | +       | When a new booking is created        |
| Before Event       | Clock   | X minutes/hours before the event     |
| After Event        | Clock   | X minutes/hours after the event      |
| Booking Cancelled  | X       | When a booking is cancelled          |
| Booking Rescheduled| Refresh | When a booking is rescheduled        |
| Booking Confirmed  | Check   | When pending booking is confirmed    |

## States

- **Default**: All workflows listed
- **Filtered**: Only workflows matching selected tab
- **Empty**: No workflows created - shows onboarding illustration and CTA
- **Search Results**: Filtered by search query
- **Loading**: Skeleton cards

## Interactions

- Click "Create Workflow" -> navigates to `/workflow/new`
- Click status tab -> filters workflow list
- Toggle active/inactive switch -> enables/disables workflow (with confirmation for disable)
- Click "Edit" -> navigates to `/workflows/[workflow]`
- Click "Duplicate" -> creates copy and opens editor
- Click "...More" -> dropdown with Delete, View Logs options
- Click workflow card title -> navigates to workflow editor
