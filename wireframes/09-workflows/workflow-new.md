# New Workflow Creation

## Route: `/workflow/new`

## Description
Form for creating a new workflow from scratch or from a template. Guides users through selecting a trigger, adding actions, and configuring the workflow before saving.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | < Back to Workflows                                   |
|          |                                                       |
| Event    | Create New Workflow                                    |
| Types    |                                                       |
| Bookings | -- Start from Template or Blank -------------------- - |
| Avail.   |                                                       |
| Teams    | +----------------+ +----------------+ +----------------+
| Apps   * | |                | |                | |                |
| Workflows| | [BLANK ICON]   | | [EMAIL ICON]   | | [SMS ICON]     |
| Settings | |                | |                | |                |
|          | | Blank           | | Booking        | | SMS Reminder   |
|          | | Workflow        | | Confirmation   | | Before Event   |
|          | |                | |                | |                |
|          | | Start from     | | Send email     | | Send SMS 24h   |
|          | | scratch        | | when booking   | | before the     |
|          | |                | | is created     | | meeting        |
|          | |                | |                | |                |
|          | | [  Select  ]   | | [  Select  ]   | | [  Select  ]   |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [WEBHOOK ICON] | | [FOLLOWUP]     | | [CANCEL ICON]  |
|          | |                | |                | |                |
|          | | Webhook on     | | Follow-up      | | Cancellation   |
|          | | New Booking    | | After Meeting  | | Notice         |
|          | |                | |                | |                |
|          | | Fire webhook   | | Send follow-up | | Notify host    |
|          | | when new       | | email 1 hour   | | when booking   |
|          | | bookings...    | | after meeting  | | is cancelled   |
|          | |                | |                | |                |
|          | | [  Select  ]   | | [  Select  ]   | | [  Select  ]   |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          |                                                       |
|          | == BLANK WORKFLOW FORM =============================== |
|          |                                                       |
|          | Workflow Name:                                         |
|          | +----------------------------------------------------+|
|          | | My New Workflow                                     ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |                                                       |
|          |         +------------------------------------+         |
|          |         |         TRIGGER                    |         |
|          |         |                                    |         |
|          |         |  When should this workflow run?     |         |
|          |         |                                    |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Select a trigger...      [\/]|  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Trigger options:                   |         |
|          |         |  +------------------------------+  |         |
|          |         |  | ( ) New Booking              |  |         |
|          |         |  | ( ) Before Event             |  |         |
|          |         |  |     Time before: [___] [\/]  |  |         |
|          |         |  | ( ) After Event              |  |         |
|          |         |  |     Time after: [___] [\/]   |  |         |
|          |         |  | ( ) Booking Cancelled        |  |         |
|          |         |  | ( ) Booking Rescheduled      |  |         |
|          |         |  | ( ) Booking Confirmed        |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |         +------------------------------------+         |
|          |         |       ADD FIRST ACTION             |         |
|          |         |                                    |         |
|          |         |  What should happen?                |         |
|          |         |                                    |         |
|          |         |  +------------------------------+  |         |
|          |         |  | [MAIL]  Send Email           |  |         |
|          |         |  +------------------------------+  |         |
|          |         |  | [MSG]   Send SMS             |  |         |
|          |         |  +------------------------------+  |         |
|          |         |  | [HOOK]  Send Webhook         |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         +------------------------------------+         |
|          |                                                       |
|          |                                                       |
|          | -- After selecting Email action: -------------------- |
|          |                                                       |
|          |         +------------------------------------+         |
|          |         |        ACTION 1: Email             |         |
|          |         |                                    |         |
|          |         |  Send to:                           |         |
|          |         |  +------------------------------+  |         |
|          |         |  | Attendee                 [\/]|  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Subject:                           |         |
|          |         |  +------------------------------+  |         |
|          |         |  |                              |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Body:                              |         |
|          |         |  +------------------------------+  |         |
|          |         |  | [B] [I] [Link] [Variable \/] |  |         |
|          |         |  |------------------------------|  |         |
|          |         |  |                              |  |         |
|          |         |  |                              |  |         |
|          |         |  |                              |  |         |
|          |         |  |                              |  |         |
|          |         |  +------------------------------+  |         |
|          |         |                                    |         |
|          |         |  Available variables:               |         |
|          |         |  {title} {date} {start_time}        |         |
|          |         |  {attendee_name} {organizer_name}   |         |
|          |         |  {location} {booking_url}           |         |
|          |         |                                    |         |
|          |         +------------------------------------+         |
|          |                        |                               |
|          |                        v                               |
|          |              [+ Add Another Action]                    |
|          |                                                       |
|          |                                                       |
|          | Apply to event types:                                  |
|          | +----------------------------------------------------+|
|          | | (o) All event types                                 ||
|          | | ( ) Specific event types:                           ||
|          | |     [ ] 30 Min Meeting                              ||
|          | |     [ ] 60 Min Consultation                         ||
|          | |     [ ] Quick Chat                                  ||
|          | |     [ ] Team Standup                                ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | Activate immediately:                                  |
|          | [x] Enable this workflow after saving                  |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  [Cancel]                  [  Create Workflow  ]    ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Template Selector**: Grid of preset workflow templates + blank option
  - Each template card: icon, name, short description, select button
- **Workflow Name Field**: Text input for naming the workflow
- **Trigger Selector**: Radio list of available trigger types
  - Before/After Event shows additional time offset field
- **Action Selector**: Card list of action types (Email, SMS, Webhook)
- **Action Configuration**: Type-specific form fields
  - Email: To selector, Subject, Rich text body with variable insertion
  - SMS: To selector, Message text with variables
  - Webhook: URL, Method, Headers, Payload
- **Variable Reference**: Clickable list of available template variables
- **Event Type Selector**: "All" radio or specific event type checkboxes
- **Activate Toggle**: Checkbox to enable workflow immediately on save
- **Footer Actions**: Cancel, Create Workflow buttons

## Templates

| Template             | Trigger          | Actions            |
|----------------------|------------------|--------------------|
| Blank Workflow       | (user chooses)   | (user adds)        |
| Booking Confirmation | New Booking      | Email to attendee  |
| SMS Reminder         | Before Event 24h | SMS to attendee    |
| Webhook on Booking   | New Booking      | Webhook POST       |
| Follow-up Email      | After Event 1h   | Email to attendee  |
| Cancellation Notice  | Cancelled        | Email to host      |

## States

- **Template Selection**: Initial state, showing template grid
- **Blank Form**: After selecting "Blank Workflow"
- **Pre-filled Form**: After selecting a template (fields pre-populated)
- **Trigger Selected**: Trigger configured, ready to add actions
- **Action Added**: At least one action configured
- **Ready to Save**: All required fields filled, create button enabled
- **Saving**: Loading spinner on create button
- **Validation Error**: Required fields highlighted with error messages

## Interactions

- Click template card -> pre-fills workflow with template configuration
- Select trigger type -> shows trigger-specific options
- Click action type -> adds action block with configuration form
- Click variable tag -> inserts variable into active text field
- Click "+ Add Another Action" -> shows action type selector again
- Toggle "All event types" / "Specific" -> shows/hides event type checkboxes
- Click "Create Workflow" -> validates, saves, redirects to `/workflows/[id]`
- Click "Cancel" -> navigates back to `/workflows` (with unsaved changes warning)
