# App Categories

## Route: `/apps/categories`

## Description
Grid view of all available app categories with icons, names, and app counts. Serves as a browsing hub for discovering integrations by type.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Apps > Categories                                     |
|          |                                                       |
| Event    | Browse by Category                                    |
| Types    | Find the right integrations for your workflow          |
| Bookings |                                                       |
| Avail.   | +------------------+ +------------------+             |
| Teams    | |                  | |                  |             |
| Apps   * | |    [CAL ICON]    | |   [VIDEO ICON]   |             |
| Workflows| |                  | |                  |             |
| Settings | |    Calendar      | |    Video         |             |
| Routing  | |    12 apps       | |    8 apps        |             |
|          | |                  | |                  |             |
|          | +------------------+ +------------------+             |
|          |                                                       |
|          | +------------------+ +------------------+             |
|          | |                  | |                  |             |
|          | |  [PAYMENT ICON]  | |   [CRM ICON]     |             |
|          | |                  | |                  |             |
|          | |    Payment       | |    CRM           |             |
|          | |    6 apps        | |    5 apps        |             |
|          | |                  | |                  |             |
|          | +------------------+ +------------------+             |
|          |                                                       |
|          | +------------------+ +------------------+             |
|          | |                  | |                  |             |
|          | | [ANALYTICS ICON] | | [AUTOMATE ICON]  |             |
|          | |                  | |                  |             |
|          | |    Analytics     | |    Automation    |             |
|          | |    4 apps        | |    7 apps        |             |
|          | |                  | |                  |             |
|          | +------------------+ +------------------+             |
|          |                                                       |
|          | +------------------+ +------------------+             |
|          | |                  | |                  |             |
|          | | [MESSAGE ICON]   | |  [EMBED ICON]    |             |
|          | |                  | |                  |             |
|          | |    Messaging     | |    Embedding     |             |
|          | |    3 apps        | |    2 apps        |             |
|          | |                  | |                  |             |
|          | +------------------+ +------------------+             |
|          |                                                       |
|          | +------------------+ +------------------+             |
|          | |                  | |                  |             |
|          | |  [OTHER ICON]    | |  [ROUTING ICON]  |             |
|          | |                  | |                  |             |
|          | |    Other         | |    Routing       |             |
|          | |    9 apps        | |    2 apps        |             |
|          | |                  | |                  |             |
|          | +------------------+ +------------------+             |
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Page Header**: Breadcrumb (Apps > Categories), title, subtitle
- **Category Card Grid**: 2-column grid of category cards
  - Category icon (large, centered)
  - Category name
  - App count badge (e.g., "12 apps")
  - Hover effect with slight elevation
- **Responsive Layout**: Grid adjusts from 2 columns to 3 on wider screens

## Categories

| Category    | Icon        | Description                        |
|-------------|-------------|------------------------------------|
| Calendar    | Calendar    | Calendar sync and management       |
| Video       | Video cam   | Video conferencing integrations    |
| Payment     | Credit card | Payment collection                 |
| CRM         | Users       | Customer relationship management   |
| Analytics   | Chart       | Tracking and analytics             |
| Automation  | Zap/bolt    | Workflow automation tools          |
| Messaging   | Chat bubble | Communication platforms            |
| Embedding   | Code        | Embed and widget tools             |
| Routing     | Git branch  | Form routing and logic             |
| Other       | Grid        | Miscellaneous integrations         |

## States

- **Default**: All category cards visible
- **Loading**: Skeleton cards while categories load
- **Empty Category**: Card still shown but with "0 apps" (dimmed)

## Interactions

- Click category card -> navigates to `/apps/categories/[category]`
- Hover category card -> subtle elevation/highlight effect
