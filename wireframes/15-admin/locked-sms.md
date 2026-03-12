# Locked SMS Numbers

## Overview
Manage SMS phone numbers that are locked or restricted from receiving booking notifications.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  Locked SMS Numbers                                    |
| MENU    |  Manage phone numbers restricted from SMS               |
|         |  notifications.                                         |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | ADD LOCKED NUMBER                                  | |
| > SMS   |  +----------------------------------------------------+ |
|   Apps  |  |                                                    | |
|   Block |  |  Phone Number *                                    | |
|   Flags |  |  +----------------------------------+              | |
|   OAuth |  |  | +1 (___) ___-____                |  [+ Lock]   | |
|   Imper |  |  +----------------------------------+              | |
|         |  |                                                    | |
|         |  |  Reason                                            | |
|         |  |  +----------------------------------+              | |
|         |  |  | e.g. Spam reports                |              | |
|         |  |  +----------------------------------+              | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | LOCKED NUMBERS                                     | |
|         |  +----------------------------------------------------+ |
|         |  | [Q Search numbers...]                              | |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [phone] +1 (555) 123-4567                      || |
|         |  |  | Reason: Spam reports                           || |
|         |  |  | Locked by: Admin  |  Mar 10, 2025              || |
|         |  |  |                              [Unlock] [Delete] || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [phone] +44 7911 123456                        || |
|         |  |  | Reason: User request                           || |
|         |  |  | Locked by: Admin  |  Mar 05, 2025              || |
|         |  |  |                              [Unlock] [Delete] || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [phone] +1 (555) 987-6543                      || |
|         |  |  | Reason: Carrier complaint                      || |
|         |  |  | Locked by: System |  Feb 28, 2025              || |
|         |  |  |                              [Unlock] [Delete] || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  |  +------------------------------------------------+| |
|         |  |  | [phone] +1 (212) 555-0100                      || |
|         |  |  | Reason: Invalid number                         || |
|         |  |  | Locked by: System |  Feb 15, 2025              || |
|         |  |  |                              [Unlock] [Delete] || |
|         |  |  +------------------------------------------------+| |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  Showing 1-4 of 18 numbers                              |
|         |  [< Prev]  1  2  3  [Next >]                           |
|         |                                                         |
+------------------------------------------------------------------+

Unlock confirmation:
+---------------------------------------+
|  Unlock Number?                       |
|                                       |
|  Are you sure you want to unlock      |
|  +1 (555) 123-4567?                  |
|                                       |
|  SMS notifications will be sent to    |
|  this number again.                   |
|                                       |
|          [Cancel]  [Unlock]           |
+---------------------------------------+
```

## Add Form

| Field        | Type  | Required | Notes                        |
|--------------|-------|----------|------------------------------|
| Phone Number | Phone | Yes      | International format         |
| Reason       | Text  | No       | Why the number is locked     |

## Locked Number Entry

Each entry shows:
- Phone icon
- Phone number (formatted)
- Reason for locking
- Who locked it (Admin name or System)
- Date locked
- Unlock and Delete buttons

## Actions

- **Lock**: Add number to locked list
- **Unlock**: Remove restriction, allow SMS again
- **Delete**: Permanently remove from list

## States
- **Empty**: "No locked numbers" message
- **Duplicate**: Error "This number is already locked"
- **Invalid**: Error "Please enter a valid phone number"
- **System locked**: Row indicates locked by system (auto-detected)
