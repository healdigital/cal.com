# Edit User

## Overview
Admin form to edit user details, change role/status, and perform dangerous actions.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  [< Back to Users]                                     |
| MENU    |                                                         |
|         |  Edit User                                              |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  |  +----+                                            | |
|         |  |  |    |  John Smith                                | |
|         |  |  | AV |  john@company.com                          | |
|         |  |  |    |  Member since Jan 15, 2025                 | |
|         |  |  +----+                                            | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | PROFILE INFORMATION                                | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Full Name *                                       | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | John Smith                                   |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Email Address *                                   | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | john@company.com                             |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Username                                          | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | johnsmith                                    |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |  cal.com/johnsmith                                 | |
|         |  |                                                    | |
|         |  |  Bio                                               | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Software engineer and avid scheduler.        |  | |
|         |  |  |                                              |  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | ROLE & STATUS                                      | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Role *                                            | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Member                                    [v]|  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  Status *                                          | |
|         |  |  +----------------------------------------------+  | |
|         |  |  | Active                                    [v]|  | |
|         |  |  +----------------------------------------------+  | |
|         |  |                                                    | |
|         |  |  [x] Email verified                                | |
|         |  |  [ ] Two-factor authentication enabled             | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |              [Cancel]  [Save Changes]                   |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | !! DANGER ZONE                                     | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  Impersonate User                                  | |
|         |  |  Sign in as this user to troubleshoot issues.      | |
|         |  |  [Impersonate]                                     | |
|         |  |                                                    | |
|         |  |  ------------------------------------------------  | |
|         |  |                                                    | |
|         |  |  Ban User                                          | |
|         |  |  Prevent this user from accessing their account.   | |
|         |  |  [Ban User]                                        | |
|         |  |                                                    | |
|         |  |  ------------------------------------------------  | |
|         |  |                                                    | |
|         |  |  Delete User                                       | |
|         |  |  Permanently delete this user and all their data.  | |
|         |  |  This action cannot be undone.                     | |
|         |  |  [Delete User]                                     | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
+------------------------------------------------------------------+

Ban confirmation dialog:
+-------------------------------------+
|  Ban User                           |
|                                     |
|  Are you sure you want to ban       |
|  John Smith? They will not be       |
|  able to log in or access their     |
|  account.                           |
|                                     |
|  Reason (optional):                 |
|  +-------------------------------+  |
|  |                               |  |
|  +-------------------------------+  |
|                                     |
|          [Cancel]  [Ban User]       |
+-------------------------------------+

Delete confirmation dialog:
+-------------------------------------+
|  Delete User                        |
|                                     |
|  This will permanently delete       |
|  John Smith and all associated      |
|  data including:                    |
|  - 23 event types                   |
|  - 156 bookings                     |
|  - 3 connected calendars            |
|                                     |
|  Type "DELETE" to confirm:          |
|  +-------------------------------+  |
|  |                               |  |
|  +-------------------------------+  |
|                                     |
|        [Cancel]  [Delete User]      |
+-------------------------------------+
```

## Form Fields

| Field         | Type     | Required | Notes                         |
|---------------|----------|----------|-------------------------------|
| Full Name     | Text     | Yes      | Min 2 characters              |
| Email         | Email    | Yes      | Must be unique                |
| Username      | Text     | No       | Unique, alphanumeric          |
| Bio           | Textarea | No       | Max 500 characters            |
| Role          | Select   | Yes      | Admin / Member                |
| Status        | Select   | Yes      | Active / Suspended / Banned   |

## Danger Zone Actions

- **Impersonate**: Opens new session as user
- **Ban**: Requires confirmation, optional reason
- **Delete**: Requires typing "DELETE" to confirm

## States
- **Loading**: Skeleton form
- **Editing**: Form with current values
- **Saving**: Spinner on save button
- **Banned user**: Status shows banned, danger zone shows "Unban" option
