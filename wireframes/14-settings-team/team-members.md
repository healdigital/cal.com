# Team Members

## Route: `/settings/teams/:teamId/members`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Members                             |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  +---------------------------+             |
|   Appearance|  | + Invite Team Member      |             |
|             |  +---------------------------+             |
| > Security  |                                            |
|   Password  |  +--------------------+                    |
|   Two-Factor|  | Search members...  |                    |
|   SSO       |  +--------------------+                    |
|   Compliance|                                            |
|   Imperson. |  Filter: [All] [Owner] [Admin] [Member]    |
|             |                                            |
| > Developer |  +--------------------------------------+  |
|   API Keys  |  | Member         | Role    | Status |A|  |
|   OAuth     |  |---------------------------------------|  |
|   Webhooks  |  | +--+                                 |  |
|             |  | |AV| Jane Smith       | Owner  |Active|  |
| > Team      |  | +--+ jane@acme.com    |        |     |  |
|   Settings  |  |                       |        |     |  |
|   Profile   |  |---------------------------------------|  |
|   Appearance|  | +--+                                 |  |
|  [Members]  |  | |AV| John Doe         | Admin  |Active|  |
|   Roles     |  | +--+ john@acme.com    | [v]    |     |  |
|   Features  |  |                                      |  |
|   Billing   |  |           [Change Role] [Remove]     |  |
|             |  |---------------------------------------|  |
|             |  | +--+                                 |  |
|             |  | |AV| Alice Johnson    | Member |Active|  |
|             |  | +--+ alice@acme.com   | [v]    |     |  |
|             |  |                                      |  |
|             |  |           [Change Role] [Remove]     |  |
|             |  |---------------------------------------|  |
|             |  | +--+                                 |  |
|             |  | |AV| Bob Williams     | Member |Pend-|  |
|             |  | +--+ bob@acme.com     |        | ing |  |
|             |  |                                      |  |
|             |  |           [Resend Invite] [Revoke]   |  |
|             |  |---------------------------------------|  |
|             |  | +--+                                 |  |
|             |  | |AV| Carol Davis      | Member |Active|  |
|             |  | +--+ carol@acme.com   | [v]    |     |  |
|             |  |                                      |  |
|             |  |           [Change Role] [Remove]     |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Showing 5 of 5 members                    |
|             |                                            |
|             |  [< Prev]  Page 1 of 1  [Next >]          |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - Invite Member Modal

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Invite Team Member                         [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  Email Address *                                 |   |
|   |  +------------------------------------------+    |   |
|   |  | email@example.com                        |    |   |
|   |  +------------------------------------------+    |   |
|   |  [+ Add another email]                           |   |
|   |                                                  |   |
|   |  Added:                                          |   |
|   |  +------------------------------------------+    |   |
|   |  | sarah@acme.com                      [ x ] |    |   |
|   |  | mike@acme.com                       [ x ] |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Role                                            |   |
|   |  +------------------------------------------+    |   |
|   |  | Member                                [v] |    |   |
|   |  +------------------------------------------+    |   |
|   |  Options: Member / Admin                         |   |
|   |                                                  |   |
|   |  Custom Message (optional)                       |   |
|   |  +------------------------------------------+    |   |
|   |  | Join our team on Cal.com!                |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  +------------+  +---------------------+        |   |
|   |  | Cancel      |  | Send Invitations   |        |   |
|   |  +------------+  +---------------------+        |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Wireframe - Change Role Dialog

```
+--------------------------------------------------+
| Change Role for John Doe                   [ X ]  |
+--------------------------------------------------+
|                                                  |
|  Current Role: Admin                             |
|                                                  |
|  New Role:                                       |
|  ( ) Owner   - Full team control                 |
|  (o) Admin   - Manage members and settings       |
|  ( ) Member  - Access team event types           |
|                                                  |
|  +------------+  +------------------+            |
|  | Cancel      |  | Update Role     |            |
|  +------------+  +------------------+            |
|                                                  |
+--------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Invite Button | `<Button>` | Opens invite modal |
| Search | `<Input>` | Filters member list |
| Role Filter | `<TabGroup>` | All/Owner/Admin/Member |
| Member Row | `<TableRow>` | Avatar, name, email, role, status |
| Role Dropdown | `<Select>` | Change member role |
| Remove | `<Button>` | Destructive, confirmation required |
| Resend Invite | `<Button>` | For pending members |
| Revoke | `<Button>` | Cancel pending invitation |
| Invite Modal | `<Dialog>` | Multi-email invite form |

## States

- **Default**: Full member list
- **Searching**: Filtered member list
- **Inviting**: Modal open with email input
- **Pending**: Yellow badge for unaccepted invites
- **Removing**: Confirmation dialog
- **Empty**: "No members match your search" message
