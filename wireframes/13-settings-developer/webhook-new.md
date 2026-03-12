# New Webhook Form

## Route: `/settings/developer/webhooks/new`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Developer > Webhooks > New Webhook          |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  [< Back to Webhooks]                      |
|   Appearance|                                            |
|             |  Create Webhook                             |
| > Security  |  ----------------------------------------  |
|   Password  |                                            |
|   Two-Factor|  Subscriber URL *                           |
|   SSO       |  +--------------------------------------+  |
|   Compliance|  | https://                               |  |
|   Imperson. |  +--------------------------------------+  |
|             |  The URL where webhook payloads will be     |
| > Developer |  sent via POST request.                     |
|   API Keys  |                                            |
|   OAuth     |  ========================================  |
|  [Webhooks] |                                            |
|             |  Event Triggers *                            |
| > Team      |  ----------------------------------------  |
|   Settings  |                                            |
|   Profile   |  Select which events will trigger this      |
|   Members   |  webhook.                                   |
|   Billing   |                                            |
|             |  Booking Events                             |
|             |  [x] BOOKING_CREATED                        |
|             |  [x] BOOKING_CONFIRMED                      |
|             |  [x] BOOKING_CANCELLED                      |
|             |  [ ] BOOKING_RESCHEDULED                    |
|             |  [ ] BOOKING_REJECTED                       |
|             |  [ ] BOOKING_REQUESTED                      |
|             |  [ ] BOOKING_PAYMENT_INITIATED              |
|             |                                            |
|             |  Meeting Events                             |
|             |  [ ] MEETING_STARTED                        |
|             |  [ ] MEETING_ENDED                          |
|             |  [ ] RECORDING_READY                        |
|             |                                            |
|             |  Form Events                                |
|             |  [ ] FORM_SUBMITTED                         |
|             |                                            |
|             |  [Select All]  [Deselect All]              |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Webhook Secret (optional)                   |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | whsec_                               |  |
|             |  +--------------------------------------+  |
|             |  Used to verify webhook signatures. If      |
|             |  set, each delivery will include an         |
|             |  X-Cal-Signature header.                    |
|             |                                            |
|             |  [Generate Random Secret]                   |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Custom Headers (optional)                   |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------------+ +------------------+  |
|             |  | Header Name      | | Header Value     |  |
|             |  +------------------+ +------------------+  |
|             |  | Authorization    | | Bearer tok_xxx   |  |
|             |  +------------------+ +------------------+  |
|             |  [+ Add Header]                            |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Payload Template (optional)                 |
|             |  ----------------------------------------  |
|             |                                            |
|             |  ( ) Default payload                        |
|             |  ( ) Custom template                        |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Settings                                   |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Active                                     |
|             |  +-------+                                 |
|             |  |  ON   |  <-- toggle switch              |
|             |  +-------+                                 |
|             |  Webhook will start receiving events        |
|             |  immediately when active.                   |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------+  +------------------+      |
|             |  | Cancel      |  | Save Webhook    |      |
|             |  +------------+  +------------------+      |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Back Link | `<Link>` | Returns to webhook list |
| Subscriber URL | `<Input>` | Required, URL validation |
| Event Checkboxes | `<CheckboxGroup>` | Grouped by category |
| Select/Deselect All | `<Button>` | Convenience toggles |
| Webhook Secret | `<Input>` | Optional, for signature verification |
| Generate Secret | `<Button>` | Creates random secret string |
| Custom Headers | `<KeyValueInput>` | Dynamic add/remove pairs |
| Payload Template | `<RadioGroup>` | Default or custom |
| Active Toggle | `<Switch>` | Enable/disable webhook |
| Cancel | `<Button>` | Secondary, returns to list |
| Save Webhook | `<Button>` | Primary, creates webhook |

## Validation

- Subscriber URL: Required, must be valid HTTPS URL
- Event Triggers: At least one event must be selected
- Secret: Optional, auto-validated format
- Custom Headers: Name required if value provided

## States

- **Default**: Empty form with active toggle on
- **Filling**: Real-time URL validation
- **Error**: Inline validation messages on invalid fields
- **Saving**: Button loading spinner
- **Success**: Redirect to webhook list with toast
