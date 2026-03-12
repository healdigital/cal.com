# Team General Settings

## Route: `/settings/teams/:teamId`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > General Settings                    |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Team Information                           |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  Team Name *                                |
|   Password  |  +--------------------------------------+  |
|   Two-Factor|  | Acme Engineering                      |  |
|   SSO       |  +--------------------------------------+  |
|   Compliance|                                            |
|   Imperson. |  Team URL *                                 |
|             |  +--------------------------------------+  |
| > Developer |  | cal.com/team/ acme-engineering        |  |
|   API Keys  |  +--------------------------------------+  |
|   OAuth     |  [i] Changing the URL will break existing  |
|   Webhooks  |      shared links.                         |
|             |                                            |
| > Team      |  Description                               |
| [Settings]  |  +--------------------------------------+  |
|   Profile   |  | We build amazing scheduling           |  |
|   Appearance|  | software for the modern world.        |  |
|   Members   |  |                                      |  |
|   Roles     |  +--------------------------------------+  |
|   Features  |  0/300 characters                          |
|   Billing   |                                            |
|             |  Timezone                                   |
|             |  +--------------------------------------+  |
|             |  | America/New_York (EST, UTC-5)     [v] |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Changes     |                      |
|             |  +------------------+                      |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Team Booking Page                          |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Your team booking page is live at:         |
|             |  +--------------------------------------+  |
|             |  | https://cal.com/team/acme-eng    [C]  |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  [ ] Hide team from public directory        |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Danger Zone                                |
|             |  ----------------------------------------  |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  Disband Team                         |  |
|             |  |                                      |  |
|             |  |  This will permanently delete the     |  |
|             |  |  team, all team event types, and      |  |
|             |  |  remove all members. Individual       |  |
|             |  |  member accounts will not be deleted. |  |
|             |  |                                      |  |
|             |  |  +----------------------------+      |  |
|             |  |  | Disband This Team          |      |  |
|             |  |  +----------------------------+      |  |
|             |  |  (red/destructive button)             |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |  (red border container)                    |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Team Name | `<Input>` | Required, editable |
| Team URL | `<Input>` | Prefixed with cal.com/team/ |
| Description | `<Textarea>` | Max 300 chars |
| Timezone | `<Select>` | Timezone picker |
| Save Changes | `<Button>` | Primary |
| Booking URL | `<CopyField>` | Read-only, copyable |
| Hide Toggle | `<Checkbox>` | Directory visibility |
| Disband Team | `<Button>` | Destructive, confirmation required |

## States

- **Default**: Form populated with current team data
- **Dirty**: Save button enabled when changes detected
- **Saving**: Button loading spinner
- **Error**: Inline validation (URL taken, name too short)
- **Disbanding**: Confirmation modal with team name input
