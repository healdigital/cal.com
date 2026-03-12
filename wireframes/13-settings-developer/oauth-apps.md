# OAuth Applications

## Route: `/settings/developer/oauth-apps`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Developer > OAuth Applications             |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Create OAuth apps to integrate with the    |
|   Appearance|  Cal.com platform on behalf of your users.  |
|             |                                            |
| > Security  |          +------------------------+        |
|   Password  |          | + Create New OAuth App |        |
|   Two-Factor|          +------------------------+        |
|   SSO       |                                            |
|   Compliance|  +--------------------------------------+  |
|   Imperson. |  |                                      |  |
|             |  |  +----+  My Scheduler App             |  |
| > Developer |  |  |LOGO|  https://myapp.example.com    |  |
|   API Keys  |  |  +----+  Created: Jan 15, 2026        |  |
|  [OAuth]    |  |          Status: [Active]              |  |
|   Webhooks  |  |                                      |  |
|             |  |  Client ID:                           |  |
| > Team      |  |  +----------------------------------+ |  |
|   Settings  |  |  | clnt_a1b2c3d4e5f6g7h8        [C] | |  |
|   Profile   |  |  +----------------------------------+ |  |
|   Members   |  |                                      |  |
|   Billing   |  |  Client Secret:                       |  |
|             |  |  +----------------------------------+ |  |
|             |  |  | ****************************  [S] | |  |
|             |  |  +----------------------------------+ |  |
|             |  |  [S] = Show/Hide toggle               |  |
|             |  |                                      |  |
|             |  |  [Edit]  [Regenerate Secret]  [Delete]|  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  +----+  Zapier Integration           |  |
|             |  |  |LOGO|  https://zapier.example.com   |  |
|             |  |  +----+  Created: Feb 20, 2026        |  |
|             |  |          Status: [Draft]               |  |
|             |  |                                      |  |
|             |  |  Client ID:                           |  |
|             |  |  +----------------------------------+ |  |
|             |  |  | clnt_x9y8z7w6v5u4t3s2        [C] | |  |
|             |  |  +----------------------------------+ |  |
|             |  |                                      |  |
|             |  |  Client Secret:                       |  |
|             |  |  +----------------------------------+ |  |
|             |  |  | ****************************  [S] | |  |
|             |  |  +----------------------------------+ |  |
|             |  |                                      |  |
|             |  |  [Edit]  [Regenerate Secret]  [Delete]|  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - Create/Edit OAuth App Modal

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Create OAuth Application                   [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  App Name *                                      |   |
|   |  +------------------------------------------+    |   |
|   |  | My Scheduler App                         |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  App Logo                                        |   |
|   |  +------------------------------------------+    |   |
|   |  | [Upload]  Drop image or click to upload  |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Homepage URL *                                  |   |
|   |  +------------------------------------------+    |   |
|   |  | https://myapp.example.com                |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Redirect URIs *                                 |   |
|   |  +------------------------------------------+    |   |
|   |  | https://myapp.example.com/callback        |    |   |
|   |  +------------------------------------------+    |   |
|   |  [+ Add another redirect URI]                    |   |
|   |                                                  |   |
|   |  Description                                     |   |
|   |  +------------------------------------------+    |   |
|   |  |                                          |    |   |
|   |  |                                          |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Permissions                                     |   |
|   |  [x] Read user profile                           |   |
|   |  [x] Read bookings                               |   |
|   |  [ ] Write bookings                              |   |
|   |  [ ] Read calendars                              |   |
|   |  [ ] Manage event types                          |   |
|   |                                                  |   |
|   |  +------------+  +---------------------+        |   |
|   |  | Cancel      |  | Create Application |        |   |
|   |  +------------+  +---------------------+        |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Create Button | `<Button>` | Opens creation modal |
| App Card | `<Card>` | Logo, name, URLs, credentials |
| Client ID | `<CopyField>` | Always visible, copyable |
| Client Secret | `<CopyField>` | Hidden by default, toggle to show |
| Redirect URIs | `<Input>` + list | Multiple URIs supported |
| Permissions | `<CheckboxGroup>` | Scope selection |
| Regenerate Secret | `<Button>` | Warning: invalidates old secret |
| Delete | `<Button>` | Destructive, requires confirmation |

## States

- **Empty**: No apps, prompt to create first
- **List**: Cards for each OAuth application
- **Creating/Editing**: Modal form
- **Secret Regenerated**: Warning + new secret displayed once
- **Deleting**: Confirmation with impact message
