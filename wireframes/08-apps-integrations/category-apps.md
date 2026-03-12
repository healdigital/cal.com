# Apps Filtered by Category

## Route: `/apps/categories/[category]`

## Description
Lists all apps within a specific category with search filtering. Shows category header with description and a grid of app cards.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Apps > Categories > Calendar                           |
|          |                                                       |
| Event    | [CAL ICON]  Calendar Apps                              |
| Types    | Connect your calendars to sync availability            |
| Bookings | and create events automatically.                       |
| Avail.   |                                                       |
| Teams    | +------------------------------------------------------+
| Apps   * | | [x] Search calendar apps...                          |
| Workflows| +------------------------------------------------------+
| Settings |                                                       |
|          | Showing 12 apps                  Sort: [Popular  \/]   |
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Google Icon]  | | [Outlook Icon] | | [Apple Icon]   |
|          | |                | |                | |                |
|          | | Google         | | Outlook        | | Apple          |
|          | | Calendar       | | Calendar       | | Calendar       |
|          | |                | |                | |                |
|          | | Connect your   | | Sync your      | | Connect Apple  |
|          | | Google Cal to  | | Outlook cal    | | Calendar for   |
|          | | sync events... | | and events...  | | availability...|
|          | |                | |                | |                |
|          | | **** (4.8)     | | **** (4.5)     | | ***  (3.9)     |
|          | | [  Installed ] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [CalDAV Icon]  | | [ICS Icon]     | | [Exchange]     |
|          | |                | |                | |                |
|          | | CalDAV         | | ICS Feed       | | Exchange       |
|          | | Calendar       | |                | | Calendar       |
|          | |                | |                | |                |
|          | | Generic CalDAV | | Subscribe to   | | Microsoft      |
|          | | support for    | | external ICS   | | Exchange       |
|          | | any provider   | | calendar feeds | | integration    |
|          | |                | |                | |                |
|          | | ***  (3.7)     | | ***  (3.5)     | | **** (4.2)     |
|          | | [Install Free] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Lark Icon]    | | [Zoho Icon]    | | [Amie Icon]    |
|          | |                | |                | |                |
|          | | Lark           | | Zoho           | | Amie           |
|          | | Calendar       | | Calendar       | | Calendar       |
|          | |                | |                | |                |
|          | | Lark suite     | | Zoho calendar  | | Beautiful      |
|          | | calendar...    | | integration... | | calendar app...|
|          | |                | |                | |                |
|          | | ***  (3.4)     | | ***  (3.6)     | | **** (4.1)     |
|          | | [Install Free] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          |         [1]  [2]  [>]    Pagination                   |
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Breadcrumb**: Apps > Categories > [Category Name]
- **Category Header**: Category icon, title, description text
- **Search Bar**: Filter apps within this category
- **Results Count & Sort**: "Showing X apps" with sort dropdown (Popular, Newest, Rating)
- **App Card Grid**: 3-column grid of app cards
  - App icon
  - App name
  - Short description (2 lines max, truncated)
  - Star rating with count
  - Install button / Installed badge
- **Pagination**: Page numbers for large categories

## States

- **Default**: All apps in category shown, sorted by popularity
- **Search Active**: Filtered results matching query
- **No Results**: Empty state with "No apps found" message and suggestion
- **Loading**: Skeleton grid while apps load

## Interactions

- Click app card -> navigates to `/apps/[slug]`
- Click "Install" -> navigates to `/apps/[slug]/setup`
- Click "Installed" badge -> navigates to installed app config
- Change sort -> re-orders the grid
- Type in search -> filters apps within category
- Click breadcrumb -> navigates back to categories or app store
