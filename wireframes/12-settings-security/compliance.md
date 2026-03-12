# Compliance & Privacy Settings

## Route: `/settings/security/compliance`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > Compliance & Privacy            |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Data Export (GDPR Article 20)              |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  Download a copy of all your personal data  |
|   Password  |  stored in Cal.com. The export includes     |
|   Two-Factor|  your profile, bookings, calendars, and     |
|  [Complianc]|  integrations.                              |
|   SSO       |                                            |
|   Imperson. |  Format:                                    |
|             |  (o) JSON   ( ) CSV                         |
| > Developer |                                            |
|   API Keys  |  +---------------------+                   |
|   OAuth     |  | Request Data Export  |                   |
|   Webhooks  |  +---------------------+                   |
|             |                                            |
| > Team      |  [i] Export will be emailed to you within   |
|   Settings  |      24 hours.                              |
|   Profile   |                                            |
|   Members   |  ========================================  |
|   Billing   |                                            |
|             |  Data Retention                             |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Automatically delete booking data after:   |
|             |  +--------------------------------------+  |
|             |  | 12 months                         [v] |  |
|             |  +--------------------------------------+  |
|             |  Options: Never / 6 months / 12 months /   |
|             |           24 months / 36 months             |
|             |                                            |
|             |  [x] Delete cancelled bookings after 30d   |
|             |  [ ] Anonymize attendee data in old records |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Cookie & Tracking Preferences              |
|             |  ----------------------------------------  |
|             |                                            |
|             |  [x] Essential cookies (required)           |
|             |  [ ] Analytics cookies                      |
|             |  [ ] Marketing cookies                      |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Preferences |                      |
|             |  +------------------+                      |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Danger Zone                                |
|             |  ----------------------------------------  |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  Delete Account                      |  |
|             |  |                                      |  |
|             |  |  Permanently delete your account and  |  |
|             |  |  all associated data. This action     |  |
|             |  |  cannot be undone.                    |  |
|             |  |                                      |  |
|             |  |  +----------------------------+      |  |
|             |  |  | Delete My Account          |      |  |
|             |  |  +----------------------------+      |  |
|             |  |  (red/destructive button)             |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |  (red border container)                    |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - Delete Account Confirmation Modal

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Delete Account                             [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  [!] This action is permanent and cannot be      |   |
|   |      reversed.                                   |   |
|   |                                                  |   |
|   |  Deleting your account will:                     |   |
|   |  - Remove all your bookings                      |   |
|   |  - Cancel all upcoming events                    |   |
|   |  - Remove calendar integrations                  |   |
|   |  - Delete your booking pages                     |   |
|   |                                                  |   |
|   |  Type "DELETE" to confirm:                       |   |
|   |  +------------------------------------------+    |   |
|   |  |                                          |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Enter your password:                            |   |
|   |  +------------------------------------------+    |   |
|   |  | ********************************         |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  +------------+  +------------------------+     |   |
|   |  | Cancel      |  | Permanently Delete    |     |   |
|   |  +------------+  +------------------------+     |   |
|   |                   (red/destructive)              |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Format Radio | `<RadioGroup>` | JSON or CSV |
| Request Export | `<Button>` | Primary, triggers email |
| Retention Select | `<Select>` | Data retention period |
| Cookie Checkboxes | `<Checkbox>` | Cookie preferences |
| Save Preferences | `<Button>` | Saves cookie settings |
| Delete Account | `<Button>` | Destructive red button |
| Confirm Modal | `<Dialog>` | Requires typing DELETE + password |

## States

- **Default**: All sections visible with current settings
- **Export Requested**: Success message, button disabled for 24h
- **Deleting**: Loading state on confirmation modal
- **Error**: Validation errors (wrong password, didn't type DELETE)
