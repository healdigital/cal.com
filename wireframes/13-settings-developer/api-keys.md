# API Keys

## Route: `/settings/developer/api-keys`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Developer > API Keys                       |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Manage your API keys. Keys are used to     |
|   Appearance|  authenticate requests to the Cal.com API.  |
|             |                                            |
| > Security  |          +---------------------+           |
|   Password  |          | + Create New API Key |           |
|   Two-Factor|          +---------------------+           |
|   SSO       |                                            |
|   Compliance|  +--------------------------------------+  |
|   Imperson. |  | Name     | Key        |Created|Exp. |A|  |
|             |  |---------------------------------------|  |
| > Developer |  | Producti | cal_live.. | Jan 5 |Never|  |  |
|  [API Keys] |  | on Key   | .k9x3     | 2026  |     |  |  |
|   OAuth     |  |          |            |       |     |  |  |
|   Webhooks  |  |   [Copy Key]                  |[Del]|  |  |
|             |  |---------------------------------------|  |
| > Team      |  | Staging  | cal_test.. | Feb 1 |Mar  |  |  |
|   Settings  |  | Key      | .m4p2     | 2026  |2027 |  |  |
|   Profile   |  |          |            |       |     |  |  |
|   Members   |  |   [Copy Key]                  |[Del]|  |  |
|   Billing   |  |---------------------------------------|  |
|             |  | CI/CD    | cal_test.. | Mar 1 |Jun  |  |  |
|             |  | Pipeline | .j7w1     | 2026  |2026 |  |  |
|             |  |          |            |       |     |  |  |
|             |  |   [Copy Key]                  |[Del]|  |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Showing 3 of 3 keys                       |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - Create New API Key Modal

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Create New API Key                         [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  Key Name                                        |   |
|   |  +------------------------------------------+    |   |
|   |  | e.g. Production Key                      |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Expiration                                      |   |
|   |  +------------------------------------------+    |   |
|   |  | 30 days                               [v] |    |   |
|   |  +------------------------------------------+    |   |
|   |  Options: 7 days / 30 days / 60 days /           |   |
|   |           90 days / 1 year / Never               |   |
|   |                                                  |   |
|   |  Note (optional)                                 |   |
|   |  +------------------------------------------+    |   |
|   |  |                                          |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  +------------+  +--------------------+          |   |
|   |  | Cancel      |  | Create API Key    |          |   |
|   |  +------------+  +--------------------+          |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Wireframe - Key Created Success

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | API Key Created                            [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  [!] Copy your API key now. You won't be able    |   |
|   |      to see it again.                            |   |
|   |                                                  |   |
|   |  +------------------------------------------+    |   |
|   |  | cal_live_a1b2c3d4e5f6g7h8i9j0k1l2m3  [C] |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  +-----------------+                             |   |
|   |  | Done            |                             |   |
|   |  +-----------------+                             |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Create Button | `<Button>` | Opens creation modal |
| Keys Table | `<Table>` | Name, preview, created, expiry |
| Copy Key | `<Button>` | Copies full key to clipboard |
| Delete | `<IconButton>` | Trash icon, requires confirmation |
| Key Name Input | `<Input>` | Required field |
| Expiration Select | `<Select>` | Predefined expiry options |
| Created Key Display | `<CopyField>` | One-time display of full key |

## States

- **Empty**: "No API keys yet" with create button
- **List**: Table of existing keys
- **Creating**: Modal form open
- **Created**: Success modal with full key shown once
- **Deleting**: Confirmation dialog before removal
