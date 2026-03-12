# Blocklist Management

## Overview
Manage blocked email addresses and domains that cannot create bookings.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  Blocklist                                              |
| MENU    |  Block specific emails or entire domains from booking.  |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | ADD TO BLOCKLIST                                   | |
| > Block |  +----------------------------------------------------+ |
|   Apps  |  |                                                    | |
|   Flags |  |  Email or Domain *                                 | |
|   OAuth |  |  +----------------------------------+              | |
|   SMS   |  |  | e.g. spam@ex.com or spam.com     |  [+ Block]  | |
|   Imper |  |  +----------------------------------+              | |
|         |  |                                                    | |
|         |  |  (i) Use @ prefix for domains (e.g. @spam.com)    | |
|         |  |      to block all emails from that domain.         | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | BLOCKED ENTRIES                                    | |
|         |  +----------------------------------------------------+ |
|         |  | [Q Search blocklist...]   [Type: All v]            | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [envelope] spam@example.com                    || |
|         |  |  | Email  |  Added by Admin  |  Jan 15  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [globe] @malicious-domain.com                  || |
|         |  |  | Domain |  Added by Admin  |  Jan 20  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [envelope] bot@spammer.net                     || |
|         |  |  | Email  |  Added by Admin  |  Feb 03  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [globe] @throwaway-mail.org                    || |
|         |  |  | Domain |  Added by System |  Feb 10  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [envelope] fake@test.com                       || |
|         |  |  | Email  |  Added by Admin  |  Mar 01  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [globe] @disposable.email                      || |
|         |  |  | Domain |  Added by Admin  |  Mar 05  | [Remove]|| |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  Showing 1-6 of 42 entries                              |
|         |  [< Prev]  1  2  3  ...  7  [Next >]                   |
|         |                                                         |
+------------------------------------------------------------------+

Remove confirmation:
+---------------------------------------+
|  Remove from blocklist?               |
|                                       |
|  Are you sure you want to unblock     |
|  spam@example.com?                    |
|                                       |
|  They will be able to make bookings   |
|  again.                               |
|                                       |
|          [Cancel]  [Remove]           |
+---------------------------------------+
```

## Add Form

| Field           | Type  | Required | Notes                              |
|-----------------|-------|----------|------------------------------------|
| Email or Domain | Text  | Yes      | Validates as email or @domain      |

## Blocklist Entry Row

Each entry shows:
- Type icon (envelope for email, globe for domain)
- Blocked value
- Type label (Email / Domain)
- Who added it
- Date added
- Remove button

## Filters

- **Search**: Filter by email/domain text
- **Type**: All / Emails only / Domains only

## Actions

- **Block**: Add entry to blocklist
- **Remove**: Remove entry with confirmation

## States
- **Empty**: "No blocked entries" message
- **Duplicate**: Error "This entry is already blocked"
- **Invalid**: Error "Please enter a valid email or domain"
