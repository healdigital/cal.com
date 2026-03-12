# Impersonation Settings

## Route: `/settings/security/impersonation`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > Impersonation                   |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Allow Impersonation                        |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  When enabled, Cal.com support staff can    |
|   Password  |  log in as your account to help debug       |
|   Two-Factor|  issues. Impersonation sessions are logged  |
|   SSO       |  and time-limited.                          |
|  [Imperson.]|                                            |
|   Compliance|  Allow Cal.com Support to Impersonate       |
|             |  +-------+                                 |
| > Developer |  |  OFF  |  <-- toggle switch              |
|   API Keys  |  +-------+                                 |
|   OAuth     |                                            |
|   Webhooks  |  ========================================  |
|             |                                            |
| > Team      |  Active Sessions                            |
|   Settings  |  ----------------------------------------  |
|   Profile   |                                            |
|   Members   |  +--------------------------------------+  |
|   Billing   |  | Device / Browser  | Location | Act.  |  |
|             |  |---------------------------------------|  |
|             |  | Chrome on macOS   | San Fran | [Rev]  |  |
|             |  | IP: 192.168.x.x   | cisco,CA |        |  |
|             |  | Last active: 2 min ago       |        |  |
|             |  |---------------------------------------|  |
|             |  | Firefox on Windows| New York | [Rev]  |  |
|             |  | IP: 10.0.x.x      | , NY     |        |  |
|             |  | Last active: 3 hours ago     |        |  |
|             |  |---------------------------------------|  |
|             |  | Mobile Safari     | London,  | [Rev]  |  |
|             |  | IP: 172.16.x.x    | UK       |        |  |
|             |  | Last active: 1 day ago       |        |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  +---------------------------+             |
|             |  | Revoke All Other Sessions |             |
|             |  +---------------------------+             |
|             |  (destructive style)                       |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Impersonation Log                          |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | Date       | By          | Duration  |  |
|             |  |---------------------------------------|  |
|             |  | Mar 10     | support@cal | 12 min    |  |
|             |  | 2026       | .com        |           |  |
|             |  |---------------------------------------|  |
|             |  | Feb 28     | admin@cal   | 5 min     |  |
|             |  | 2026       | .com        |           |  |
|             |  |---------------------------------------|  |
|             |  | (empty state if no impersonations)   |  |
|             |  +--------------------------------------+  |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Impersonation Toggle | `<Switch>` | On/Off with confirmation |
| Sessions Table | `<Table>` | Device, location, actions |
| Revoke Button | `<Button>` | Per-session revoke |
| Revoke All | `<Button>` | Destructive, revokes all except current |
| Impersonation Log | `<Table>` | Read-only audit log |

## States

- **Default**: Toggle off, sessions list visible
- **Toggle On**: Confirmation dialog before enabling
- **Active Impersonation**: Yellow banner at top of page
- **Revoking**: Loading spinner on revoke button
- **Empty Log**: "No impersonation sessions recorded" message

## Interactions

1. Toggle impersonation on/off (requires confirmation)
2. View active sessions with device/location info
3. Revoke individual sessions
4. Revoke all sessions except current
5. View impersonation audit log
