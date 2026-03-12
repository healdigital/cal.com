# OAuth Clients Management

## Overview
Manage OAuth client applications that integrate with the Cal.com platform.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  OAuth Clients                         [+ New Client]   |
| MENU    |  Manage OAuth applications and API access.              |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | [Q Search clients...]                   [Status v] | |
| > OAuth |  +----------------------------------------------------+ |
|   Apps  |                                                         |
|   Block |  +----------------------------------------------------+ |
|   Flags |  |                                                    | |
|   SMS   |  |  +------------------------------------------------+| |
|   Imper |  |  | [APP]  My Integration App                      || |
|         |  |  |        Client ID: cal_oa_abc123def456           || |
|         |  |  |        Redirect: https://myapp.com/callback    || |
|         |  |  |        Created: Jan 15, 2025                   || |
|         |  |  |        Status: Active                          || |
|         |  |  |                   [Edit] [Revoke] [Delete]     || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [APP]  Zapier Integration                      || |
|         |  |  |        Client ID: cal_oa_xyz789ghi012           || |
|         |  |  |        Redirect: https://zapier.com/hooks      || |
|         |  |  |        Created: Feb 20, 2025                   || |
|         |  |  |        Status: Active                          || |
|         |  |  |                   [Edit] [Revoke] [Delete]     || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [APP]  Legacy CRM Connector                    || |
|         |  |  |        Client ID: cal_oa_old456mno789           || |
|         |  |  |        Redirect: https://crm.example.com/auth  || |
|         |  |  |        Created: Nov 01, 2024                   || |
|         |  |  |        Status: Revoked                         || |
|         |  |  |                   [Edit] [Reactivate] [Delete] || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
+------------------------------------------------------------------+

New/Edit Client dialog:
+-----------------------------------------------+
|  Create OAuth Client                          |
|                                               |
|  Application Name *                           |
|  +-------------------------------------------+|
|  | My Integration App                        ||
|  +-------------------------------------------+|
|                                               |
|  Redirect URI(s) *                            |
|  +-------------------------------------------+|
|  | https://myapp.com/callback                ||
|  +-------------------------------------------+|
|  [+ Add another redirect URI]                 |
|                                               |
|  Scopes                                       |
|  [x] read:bookings                            |
|  [x] write:bookings                           |
|  [ ] read:users                               |
|  [ ] write:users                              |
|  [ ] read:availability                         |
|  [x] read:event-types                          |
|  [ ] write:event-types                         |
|                                               |
|  Logo URL (optional)                          |
|  +-------------------------------------------+|
|  | https://myapp.com/logo.png                ||
|  +-------------------------------------------+|
|                                               |
|              [Cancel]  [Create Client]        |
+-----------------------------------------------+

Client created success dialog:
+-----------------------------------------------+
|  Client Created Successfully                  |
|                                               |
|  Client ID:                                   |
|  +-------------------------------------------+|
|  | cal_oa_abc123def456              [Copy]   ||
|  +-------------------------------------------+|
|                                               |
|  Client Secret:                               |
|  +-------------------------------------------+|
|  | cal_sk_secret_key_here           [Copy]   ||
|  +-------------------------------------------+|
|                                               |
|  (!) Save this secret now. It will not be     |
|      shown again.                             |
|                                               |
|                             [Done]            |
+-----------------------------------------------+
```

## Client Card Fields

- Application icon/name
- Client ID (partially masked)
- Redirect URI(s)
- Creation date
- Status (Active / Revoked)
- Action buttons

## Create/Edit Form Fields

| Field         | Type        | Required | Notes                       |
|---------------|-------------|----------|-----------------------------|
| App Name      | Text        | Yes      | Display name for the client |
| Redirect URIs | URL list    | Yes      | At least one required       |
| Scopes        | Checkboxes  | No       | Permission scopes           |
| Logo URL      | URL         | No       | App icon                    |

## Actions

- **Create**: Generate new client ID and secret
- **Edit**: Update name, redirects, scopes
- **Revoke**: Disable all active tokens
- **Reactivate**: Re-enable a revoked client
- **Delete**: Permanently remove with confirmation

## States
- **Empty**: "No OAuth clients configured" with create button
- **Active**: Full opacity, active badge
- **Revoked**: Muted styling, revoked badge
- **Secret shown**: Only on creation, never displayed again
