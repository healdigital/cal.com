# Users Management

## Overview
Admin table listing all users with search, filters, and bulk actions.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  Users                                    [+ Add User]  |
| MENU    |                                                         |
|         |  +----------------------------------------------------+ |
| > Dash  |  | [Q Search users...]   [Role v] [Status v] [Export] | |
|   Users |  +----------------------------------------------------+ |
|         |                                                         |
|   Apps  |  +----------------------------------------------------+ |
|   Block |  | [ ] | Avatar | Name        | Email       | Role    | |
|   Flags |  |     |        |             |             |         | |
|   OAuth |  |     |        |             |             | Status  | |
|   SMS   |  |     |        |             |             |         | |
|   Imper |  |     |        |             |             | Created | |
|         |  |     |        |             |             |         | |
|         |  |     |        |             |             | Actions | |
|         |  +----------------------------------------------------+ |
|         |  |     |        |             |             |         | |
|         |  | [ ] | [AV]   | John Smith  | john@co.com | Admin   | |
|         |  |     |        |             |             | Active  | |
|         |  |     |        |             |             | Jan 15  | |
|         |  |     |        |             |             | [*][*][*]|
|         |  +----------------------------------------------------+ |
|         |  |     |        |             |             |         | |
|         |  | [ ] | [AV]   | Jane Doe    | jane@co.com | Member  | |
|         |  |     |        |             |             | Active  | |
|         |  |     |        |             |             | Feb 03  | |
|         |  |     |        |             |             | [*][*][*]|
|         |  +----------------------------------------------------+ |
|         |  |     |        |             |             |         | |
|         |  | [ ] | [AV]   | Bob Wilson  | bob@ex.com  | Member  | |
|         |  |     |        |             |             | Banned  | |
|         |  |     |        |             |             | Mar 22  | |
|         |  |     |        |             |             | [*][*][*]|
|         |  +----------------------------------------------------+ |
|         |  |     |        |             |             |         | |
|         |  | [ ] | [AV]   | Alice Chen  | alice@io.co | Admin   | |
|         |  |     |        |             |             | Pending | |
|         |  |     |        |             |             | Mar 01  | |
|         |  |     |        |             |             | [*][*][*]|
|         |  +----------------------------------------------------+ |
|         |  |     |        |             |             |         | |
|         |  | [ ] | [AV]   | Tom Brown   | tom@org.net | Member  | |
|         |  |     |        |             |             | Active  | |
|         |  |     |        |             |             | Dec 10  | |
|         |  |     |        |             |             | [*][*][*]|
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  Showing 1-5 of 1,247 users                             |
|         |  [< Prev]  1  2  3  ...  250  [Next >]                 |
|         |                                                         |
+------------------------------------------------------------------+

Actions dropdown per row:
+------------------+
| [pencil] Edit    |
| [eye] Impersonate|
| [ban] Ban User   |
+------------------+

Bulk actions bar (appears when rows selected):
+----------------------------------------------------+
| [x] 3 selected   [Ban Selected] [Export Selected]  |
+----------------------------------------------------+
```

## Table Columns

| Column   | Description                          |
|----------|--------------------------------------|
| Checkbox | Bulk selection                       |
| Avatar   | User avatar or initials              |
| Name     | Full name, clickable to edit         |
| Email    | Email address                        |
| Role     | Admin, Member, or custom role        |
| Status   | Active, Pending, Banned, Suspended   |
| Created  | Account creation date                |
| Actions  | Edit, Impersonate, Ban               |

## Filters

- **Role**: All / Admin / Member
- **Status**: All / Active / Pending / Banned / Suspended
- **Search**: Searches name and email fields

## Actions

- **Edit**: Opens user edit page
- **Impersonate**: Starts impersonation session
- **Ban**: Confirms then bans user account
- **Export**: Downloads CSV of filtered results

## States
- **Empty**: "No users found" with illustration
- **Filtered empty**: "No users match your filters" with clear filters link
- **Loading**: Skeleton rows
- **Banned row**: Row styled with muted/strikethrough text
