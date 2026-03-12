# Workflow Editor

## Route: `/workflows/[workflow]`

## Description
Visual workflow editor for configuring trigger, conditions, and action chain. Displays as a vertical flow diagram with trigger at top, optional conditions in the middle, and actions at the bottom.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | < Back to Workflows                                   |
|          |                                                       |
| Event    | Workflow: Booking Confirmation Email                   |
| Types    |                                                       |
| Bookings | Name:                                                  |
| Avail.   | +----------------------------------------------------+|
| Teams    | | Booking Confirmation Email                          ||
| Apps   * | +----------------------------------------------------+|
| Workflows|                                                       |
| Settings | Applied to event types:                                |
|          | +----------------------------------------------------+|
|          | | [x] All Event Types                             [\/]||
|          | +----------------------------------------------------+|
|          |    or                                                  |
|          | [x] 30 Min Meeting  [x] Consultation  [ ] Team Standup |
|          |                                                       |
|          |                                                       |
|          | == WORKFLOW FLOW DIAGRAM ============================  |
|          |                                                       |
|          |         +------------------------------------+         |
|          |         |         TRIGGER                    |         |
|          |         |                                    |         |
|          |         |  When: [New Booking Created   \/]  |         |
|          |         |                                    |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |         +------------------------------------+         |
|          |         |       CONDITION (optional)         |         |
|          |         |                                    |         |
|          |         |  IF:                                |         |
|          |         |  [Event Type \/] [is \/]            |         |
|          |         |  [30 Min Meeting            \/]    |         |
|          |         |                                    |         |
|          |         |  [+ Add Condition]                  |         |
|          |         |                                    |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |         +------------------------------------+         |
|          |         |        ACTION 1                    |         |
|          |         |                                    |         |
|          |         |  Type: [Send Email           \/]   |         |
|          |         |                                    |         |
|          |         |  Send to: [Attendee          \/]   |         |
|          |         |                                    |         |
|          |         |  Subject:                           |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Booking Confirmed: {title}   |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Email Body:                        |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Hi {attendee_name},          |  |         |
|          |         |  |                              |  |         |
|          |         |  | Your booking with            |  |         |
|          |         |  | {organizer_name} has been    |  |         |
|          |         |  | confirmed.                   |  |         |
|          |         |  |                              |  |         |
|          |         |  | Date: {date}                 |  |         |
|          |         |  | Time: {start_time}           |  |         |
|          |         |  | Location: {location}         |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Variables: {title} {date}          |         |
|          |         |  {start_time} {attendee_name}       |         |
|          |         |  {organizer_name} {location}        |         |
|          |         |                                    |         |
|          |         |           [Edit] [Delete]           |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |         +------------------------------------+         |
|          |         |        ACTION 2                    |         |
|          |         |                                    |         |
|          |         |  Type: [Send SMS             \/]   |         |
|          |         |                                    |         |
|          |         |  Send to: [Attendee          \/]   |         |
|          |         |                                    |         |
|          |         |  Message:                           |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Reminder: You have a meeting |  |         |
|          |         |  | with {organizer_name} on     |  |         |
|          |         |  | {date} at {start_time}.      |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Sender ID:                         |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Cal.com                      |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |           [Edit] [Delete]           |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |         +------------------------------------+         |
|          |         |        ACTION 3                    |         |
|          |         |                                    |         |
|          |         |  Type: [Send Webhook         \/]   |         |
|          |         |                                    |         |
|          |         |  URL:                               |         |
|          |         |  +------------------------------+  |         |
|          |         |  | https://api.example.com/hook |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Payload: (auto-generated JSON)     |         |
|          |         |                                    |         |
|          |         |           [Edit] [Delete]           |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |              [+ Add Action]                            |
|          |                                                       |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  [Test Workflow]   [Cancel]   [  Save Workflow  ]   ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Header**: Back link, workflow name
- **Name Field**: Editable workflow name
- **Event Type Selector**: Multi-select or "All Event Types" toggle
- **Trigger Block**: Dropdown to select trigger event
- **Condition Block** (optional): Conditional logic with field/operator/value dropdowns, "Add Condition" button
- **Action Blocks**: Chained vertically, each with:
  - Action type selector (Email, SMS, Webhook)
  - Action-specific configuration fields
  - Template variables reference
  - Edit/Delete controls
- **Add Action Button**: Adds new action to the chain
- **Footer Actions**: Test Workflow, Cancel, Save Workflow

## Trigger Types

| Trigger              | Timing Options                       |
|----------------------|--------------------------------------|
| New Booking Created  | Immediately                          |
| Before Event         | 15min, 30min, 1h, 2h, 24h, custom   |
| After Event          | 15min, 30min, 1h, 2h, 24h, custom   |
| Booking Cancelled    | Immediately                          |
| Booking Rescheduled  | Immediately                          |
| Booking Confirmed    | Immediately                          |

## Action Types

| Action       | Fields                                      |
|--------------|---------------------------------------------|
| Send Email   | To, Subject, Body (rich text), Sender name  |
| Send SMS     | To, Message (plain text), Sender ID         |
| Send Webhook | URL, Method, Headers, Payload template      |

## Template Variables

| Variable            | Description                    |
|---------------------|--------------------------------|
| `{title}`           | Event type title               |
| `{date}`            | Booking date                   |
| `{start_time}`      | Start time                     |
| `{end_time}`        | End time                       |
| `{attendee_name}`   | Booker's name                  |
| `{attendee_email}`  | Booker's email                 |
| `{organizer_name}`  | Host's name                    |
| `{location}`        | Meeting location/link          |
| `{booking_url}`     | Link to manage booking         |

## States

- **Editing**: Normal editing state with all fields editable
- **Saving**: Loading spinner on Save button
- **Testing**: Test dialog showing simulated workflow execution
- **Error**: Validation errors highlighted on relevant fields
- **Unsaved Changes**: Warning indicator when navigating away

## Interactions

- Select trigger type -> configures trigger block, shows timing options if applicable
- Click "+ Add Condition" -> adds conditional row
- Select action type -> shows action-specific form fields
- Click template variable -> inserts variable into active text field
- Click "+ Add Action" -> adds new action block to chain
- Click "Delete" on action -> removes action with confirmation
- Click "Test Workflow" -> opens test dialog with sample data
- Click "Save Workflow" -> validates and saves
- Drag action blocks -> reorders action execution order
