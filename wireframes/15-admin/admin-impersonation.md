# Admin Impersonation

## Overview
Search for and impersonate users for troubleshooting. View active impersonation sessions.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  User Impersonation                                    |
| MENU    |  Sign in as another user to troubleshoot issues.        |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | (!) Impersonation sessions are logged and audited. | |
| > Imper |  |     All actions taken while impersonating are       | |
|   Apps  |  |     recorded.                                      | |
|   Block |  +----------------------------------------------------+ |
|   Flags |                                                         |
|   OAuth |  +----------------------------------------------------+ |
|   SMS   |  | IMPERSONATE USER                                   | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Search by name or email                           | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | [Q] Start typing to search...                |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  +----------------------------------------------+  | |
|         |  |  |  [AV] John Smith                             |  | |
|         |  |  |       john@company.com  |  Member  | Active  |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |  |  [AV] John Doe                               |  | |
|         |  |  |       johndoe@mail.com  |  Admin   | Active  |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |  |  [AV] Johnny Appleseed                       |  | |
|         |  |  |       johnny@test.org   |  Member  | Pending |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Reason for impersonation (required):              | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | e.g. Investigating booking issue #4521       |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |              [Start Impersonation]                 | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | ACTIVE SESSIONS                                    | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  [!] You are currently impersonating:              | |
|         |  |  (none)                                            | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | RECENT IMPERSONATION LOG                           | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Admin User -> John Smith                          | |
|         |  |  Reason: Investigating calendar sync issue         | |
|         |  |  Started: Mar 10, 2:30 PM  |  Duration: 12 min    | |
|         |  |  Status: Ended                                     | |
|         |  |  ------------------------------------------------  | |
|         |  |                                                    | |
|         |  |  Admin User -> Jane Doe                            | |
|         |  |  Reason: Verifying booking display bug             | |
|         |  |  Started: Mar 9, 11:15 AM  |  Duration: 5 min     | |
|         |  |  Status: Ended                                     | |
|         |  |  ------------------------------------------------  | |
|         |  |                                                    | |
|         |  |  Admin User -> Bob Wilson                          | |
|         |  |  Reason: Testing payment integration               | |
|         |  |  Started: Mar 8, 4:00 PM   |  Duration: 22 min    | |
|         |  |  Status: Ended                                     | |
|         |  |                                                    | |
|         |  |  [View full audit log]                             | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
+------------------------------------------------------------------+

Active impersonation banner (shown at top of all pages):
+------------------------------------------------------------------+
| [!] You are impersonating John Smith (john@company.com)           |
|                                         [Stop Impersonating]     |
+------------------------------------------------------------------+

Confirmation dialog:
+---------------------------------------+
|  Start Impersonation?                 |
|                                       |
|  You are about to sign in as:         |
|  John Smith (john@company.com)        |
|                                       |
|  Reason: Investigating booking        |
|  issue #4521                          |
|                                       |
|  This session will be logged.         |
|                                       |
|        [Cancel]  [Impersonate]        |
+---------------------------------------+
```

## Search Component

- Type-ahead search by name or email
- Results show avatar, name, email, role, status
- Click to select user

## Form Fields

| Field  | Type     | Required | Notes                          |
|--------|----------|----------|--------------------------------|
| User   | Search   | Yes      | Autocomplete user search       |
| Reason | Text     | Yes      | Why impersonation is needed    |

## Impersonation Log Entry

- Admin who impersonated
- Target user
- Reason provided
- Start time
- Duration
- Status (Active / Ended)

## States
- **No active session**: Shows "(none)" in active sessions
- **Active session**: Shows impersonation banner on all pages
- **Search results**: Dropdown with matching users
- **No results**: "No users found" in search dropdown
