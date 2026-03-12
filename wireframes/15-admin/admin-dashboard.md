# Admin Dashboard

## Overview
Main admin overview showing key metrics, system health, and quick actions.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  Admin Dashboard                                       |
| MENU    |                                                         |
|         |  +------------+  +------------+  +------------+  +----+ |
| > Dash  |  | USERS      |  | BOOKINGS   |  | APPS       |  |SYS | |
|   Users |  |            |  |            |  |            |  |HLT | |
|   Apps  |  |  [icon]    |  |  [icon]    |  |  [icon]    |  |    | |
|   Block |  |   1,247    |  |   8,932    |  |     34     |  |[ic]| |
|   Flags |  |            |  |            |  |            |  | OK | |
|   OAuth |  | +12 today  |  | +89 today  |  | 4 pending  |  |    | |
|   SMS   |  +------------+  +------------+  +------------+  +----+ |
|   Imper |                                                         |
|         |  +-------------------------------+  +-----------------+ |
|         |  | RECENT ACTIVITY               |  | SYSTEM HEALTH   | |
|         |  +-------------------------------+  +-----------------+ |
|         |  |                               |  |                 | |
|         |  | [*] User john@... signed up   |  | API       [===] | |
|         |  |     2 minutes ago             |  | 99.9% uptime    | |
|         |  |                               |  |                 | |
|         |  | [*] Booking #8932 created     |  | Database  [===] | |
|         |  |     5 minutes ago             |  | 45ms avg        | |
|         |  |                               |  |                 | |
|         |  | [*] App "Zoom" enabled        |  | Queue     [===] | |
|         |  |     12 minutes ago            |  | 12 pending      | |
|         |  |                               |  |                 | |
|         |  | [*] User jane@... updated     |  | Storage   [===] | |
|         |  |     18 minutes ago            |  | 62% used        | |
|         |  |                               |  |                 | |
|         |  | [*] Feature flag toggled      |  | Memory    [===] | |
|         |  |     25 minutes ago            |  | 4.2GB / 8GB     | |
|         |  |                               |  |                 | |
|         |  | [View all activity]           |  | [View details]  | |
|         |  +-------------------------------+  +-----------------+ |
|         |                                                         |
|         |  +----------------------------------------------------+ |
|         |  | BOOKINGS OVER TIME                                  | |
|         |  +----------------------------------------------------+ |
|         |  |          .                                          | |
|         |  |    .    / \       .                                 | |
|         |  |   / \  /   \    / \     .                          | |
|         |  |  /   \/     \  /   \   / \                         | |
|         |  | /            \/     \_/   \___                     | |
|         |  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--------+ |
|         |    Mon Tue Wed Thu Fri Sat Sun Mon Tue Wed             |
|         |                                                         |
+------------------------------------------------------------------+
```

## Components

### Stat Cards (Top Row)
- **Users**: Total registered users with daily change
- **Bookings**: Total bookings with daily change
- **Active Apps**: Enabled integrations with pending count
- **System Health**: Overall status indicator (OK/Warning/Critical)

### Recent Activity Feed
- Chronological list of admin-relevant events
- Each entry: icon, description, timestamp
- Link to view full activity log

### System Health Panel
- API uptime percentage with bar
- Database response time
- Queue status and pending jobs
- Storage utilization
- Memory usage

### Bookings Chart
- Line chart of bookings over the last 7-14 days
- Hover for daily details

## States
- **Healthy**: All indicators green
- **Warning**: Yellow indicators for degraded metrics
- **Critical**: Red indicators, alert banner at top
