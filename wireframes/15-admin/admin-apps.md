# Admin Apps Management

## Overview
Global app/integration management organized by category with enable/disable controls.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  App Management                                        |
| MENU    |  Manage which apps are available to your users.         |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | [Q Search apps...]          [Category v] [Status v] | |
| > Apps  |  +----------------------------------------------------+ |
|   Block |                                                         |
|   Flags |  CALENDAR  (6 apps)                                     |
|   OAuth |  +----------------------------------------------------+ |
|   SMS   |  |                                                    | |
|   Imper |  |  +--------+  +--------+  +--------+  +--------+   | |
|         |  |  |[G logo]|  |[O logo]|  |[A logo]|  |[C logo]|   | |
|         |  |  | Google |  | Outlook|  | Apple  |  | CalDAV |   | |
|         |  |  | Cal.   |  | / 365  |  | Cal.   |  |        |   | |
|         |  |  |        |  |        |  |        |  |        |   | |
|         |  |  | [=ON=] |  | [=ON=] |  | [=ON=] |  | [OFF=] |   | |
|         |  |  | 892    |  | 234    |  | 156    |  | 12     |   | |
|         |  |  | users  |  | users  |  | users  |  | users  |   | |
|         |  |  +--------+  +--------+  +--------+  +--------+   | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  VIDEO CONFERENCING  (4 apps)                           |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  +--------+  +--------+  +--------+  +--------+   | |
|         |  |  |[Z logo]|  |[M logo]|  |[T logo]|  |[W logo]|   | |
|         |  |  | Zoom   |  | Google |  | Teams  |  | Whereby|   | |
|         |  |  |        |  | Meet   |  |        |  |        |   | |
|         |  |  |        |  |        |  |        |  |        |   | |
|         |  |  | [=ON=] |  | [=ON=] |  | [=ON=] |  | [OFF=] |   | |
|         |  |  | 567    |  | 445    |  | 123    |  | 8      |   | |
|         |  |  | users  |  | users  |  | users  |  | users  |   | |
|         |  |  +--------+  +--------+  +--------+  +--------+   | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  PAYMENT  (3 apps)                                      |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  +--------+  +--------+  +--------+               | |
|         |  |  |[S logo]|  |[P logo]|  |[A logo]|               | |
|         |  |  | Stripe |  | PayPal |  | Alby   |               | |
|         |  |  |        |  |        |  |        |               | |
|         |  |  | [=ON=] |  | [OFF=] |  | [OFF=] |               | |
|         |  |  | 89     |  | 0      |  | 0      |               | |
|         |  |  | users  |  | users  |  | users  |               | |
|         |  |  +--------+  +--------+  +--------+               | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  CRM  (3 apps)                                          |
|         |  +----------------------------------------------------+ |
|         |  |                                                    | |
|         |  |  +--------+  +--------+  +--------+               | |
|         |  |  |[H logo]|  |[S logo]|  |[P logo]|               | |
|         |  |  |HubSpot |  | Sales  |  | Pipe   |               | |
|         |  |  |        |  | force  |  | drive  |               | |
|         |  |  | [=ON=] |  | [=ON=] |  | [OFF=] |               | |
|         |  |  | 45     |  | 34     |  | 0      |               | |
|         |  |  | users  |  | users  |  | users  |               | |
|         |  |  +--------+  +--------+  +--------+               | |
|         |  |                                                    | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
+------------------------------------------------------------------+

Disable confirmation dialog:
+---------------------------------------+
|  Disable Zoom?                        |
|                                       |
|  567 users currently have Zoom        |
|  connected. Disabling this app will:  |
|                                       |
|  - Prevent new connections            |
|  - Existing connections will stop     |
|    working for new bookings           |
|                                       |
|          [Cancel]  [Disable App]      |
+---------------------------------------+
```

## App Card Structure

Each card displays:
- App icon/logo
- App name
- Enable/disable toggle
- Number of connected users

## Categories

- Calendar (Google, Outlook, Apple, CalDAV, etc.)
- Video Conferencing (Zoom, Google Meet, Teams, Whereby, etc.)
- Payment (Stripe, PayPal, Alby)
- CRM (HubSpot, Salesforce, Pipedrive)
- Automation (Zapier, Make, n8n)
- Analytics & Messaging

## Filters

- **Search**: Filter by app name
- **Category**: Filter by category
- **Status**: Enabled / Disabled / All

## States
- **Enabled**: Toggle on, card at full opacity
- **Disabled**: Toggle off, card slightly muted
- **Disabling**: Confirmation dialog with impact information
