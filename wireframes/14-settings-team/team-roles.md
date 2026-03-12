# Team Roles & Permissions

## Route: `/settings/teams/:teamId/roles`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Roles & Permissions                 |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Manage what each role can do within your   |
|   Appearance|  team.                                      |
|             |                                            |
| > Security  |  ========================================  |
|   Password  |                                            |
|   Two-Factor|  Role Definitions                           |
|   SSO       |  ----------------------------------------  |
|   Compliance|                                            |
|   Imperson. |  +--------------------------------------+  |
|             |  |                                      |  |
| > Developer |  |  Owner                                |  |
|   API Keys  |  |  Full control over the team. Can      |  |
|   OAuth     |  |  delete the team and manage billing.  |  |
|   Webhooks  |  |  Only one owner per team.             |  |
|             |  |                                      |  |
| > Team      |  +--------------------------------------+  |
|   Settings  |                                            |
|   Profile   |  +--------------------------------------+  |
|   Appearance|  |                                      |  |
|   Members   |  |  Admin                                |  |
|  [Roles]    |  |  Can manage team members, event       |  |
|   Features  |  |  types, and most settings. Cannot     |  |
|   Billing   |  |  delete the team or manage billing.   |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  Member                               |  |
|             |  |  Can view team bookings and manage    |  |
|             |  |  their own event types within the     |  |
|             |  |  team. Limited settings access.       |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Permissions Matrix                         |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | Permission        |Owner|Admin|Member|  |
|             |  |---------------------------------------|  |
|             |  |                                      |  |
|             |  | TEAM MANAGEMENT                      |  |
|             |  |---------------------------------------|  |
|             |  | Edit team settings|  X  |  X  |      |  |
|             |  | Delete team       |  X  |     |      |  |
|             |  | Manage billing    |  X  |     |      |  |
|             |  | View audit logs   |  X  |  X  |      |  |
|             |  |---------------------------------------|  |
|             |  |                                      |  |
|             |  | MEMBER MANAGEMENT                    |  |
|             |  |---------------------------------------|  |
|             |  | Invite members    |  X  |  X  |      |  |
|             |  | Remove members    |  X  |  X  |      |  |
|             |  | Change roles      |  X  |  X* |      |  |
|             |  | Transfer ownership|  X  |     |      |  |
|             |  |---------------------------------------|  |
|             |  |                                      |  |
|             |  | EVENT TYPES                          |  |
|             |  |---------------------------------------|  |
|             |  | Create team events|  X  |  X  |  X   |  |
|             |  | Edit any event    |  X  |  X  |      |  |
|             |  | Edit own events   |  X  |  X  |  X   |  |
|             |  | Delete any event  |  X  |  X  |      |  |
|             |  | Delete own events |  X  |  X  |  X   |  |
|             |  |---------------------------------------|  |
|             |  |                                      |  |
|             |  | BOOKINGS                             |  |
|             |  |---------------------------------------|  |
|             |  | View all bookings |  X  |  X  |      |  |
|             |  | View own bookings |  X  |  X  |  X   |  |
|             |  | Cancel any booking|  X  |  X  |      |  |
|             |  | Cancel own booking|  X  |  X  |  X   |  |
|             |  | Reschedule any    |  X  |  X  |      |  |
|             |  |---------------------------------------|  |
|             |  |                                      |  |
|             |  | INTEGRATIONS                         |  |
|             |  |---------------------------------------|  |
|             |  | Manage team apps  |  X  |  X  |      |  |
|             |  | View integrations |  X  |  X  |  X   |  |
|             |  | Manage webhooks   |  X  |  X  |      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  * Admins cannot promote to Owner or        |
|             |    demote other Admins.                     |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Role Cards | `<Card>` | Description of each role |
| Permissions Matrix | `<Table>` | Read-only grid with checkmarks |
| X marks | Text | Indicates permission granted |
| Empty cells | Text | Indicates no permission |
| Footnotes | Text | Clarifying notes on restrictions |

## States

- **Default**: Full permissions matrix displayed
- **Enterprise**: Additional custom roles section visible
- **Collapsed**: Sections can be collapsed/expanded by category

## Notes

- Permissions matrix is read-only on standard plans
- Enterprise plans may allow custom role creation
- Owner role cannot be customized
- Changes to roles affect all members with that role
