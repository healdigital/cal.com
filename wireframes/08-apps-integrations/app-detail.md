# App Detail Page

## Route: `/apps/[slug]`

## Description
Detailed view of a single app/integration showing its full description, screenshots, configuration options, reviews, and install button.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | < Back to App Store                                   |
|          |                                                       |
| Event    | +----------------------------------------------------+ |
| Types    | |                                                    | |
| Bookings | |  +--------+  Google Calendar                       | |
| Avail.   | |  | [ICON] |  By Google                             | |
| Teams    | |  | 64x64  |  Category: Calendar                    | |
| Apps   * | |  +--------+  **** (4.8) 234 reviews                | |
| Workflows| |                                                    | |
| Settings | |  Connect your Google Calendar to automatically     | |
|          | |  sync your events and availability in real time.    | |
|          | |                                                    | |
|          | |  [  Install App - Free  ]   [ Visit Website ]       | |
|          | |                                                    | |
|          | +----------------------------------------------------+ |
|          |                                                       |
|          | -- Screenshots -------------------------------------- |
|          |                                                       |
|          | +------------+ +------------+ +------------+          |
|          | |            | |            | |            |          |
|          | | Screenshot | | Screenshot | | Screenshot |          |
|          | |     1      | |     2      | |     3      |          |
|          | |            | |            | |            |          |
|          | +------------+ +------------+ +------------+          |
|          |    ( o )           ( )           ( )                   |
|          |                                                       |
|          | -- About This App ----------------------------------- |
|          |                                                       |
|          | Google Calendar is the most popular calendar app.      |
|          | With this integration you can:                         |
|          |                                                       |
|          | * Automatically block busy times from your calendar    |
|          | * Create events in Google Calendar for new bookings    |
|          | * Two-way sync to keep everything up to date           |
|          | * Support for multiple Google calendars                |
|          |                                                       |
|          | -- How It Works ------------------------------------- |
|          |                                                       |
|          |  1. Click Install    2. Authorize     3. Select       |
|          |  +----------+       +----------+     +----------+     |
|          |  |  Install  |      |  Google  |     | Calendars|     |
|          |  |  button   |  ->  |  OAuth   |  -> | to sync  |     |
|          |  +----------+       +----------+     +----------+     |
|          |                                                       |
|          | -- Requires ----------------------------------------- |
|          |                                                       |
|          | [i] This app requires a Google account                 |
|          | [i] Calendar read/write permissions                    |
|          |                                                       |
|          | -- Reviews ------------------------------------------ |
|          |                                                       |
|          | +----------------------------------------------------+|
|          | | ***** "Works perfectly"              Jan 15, 2026   ||
|          | | Seamless integration, events sync instantly.        ||
|          | | - Sarah M.                                          ||
|          | +----------------------------------------------------+|
|          | +----------------------------------------------------+|
|          | | ****  "Great but minor issues"       Dec 3, 2025    ||
|          | | Occasionally takes a few minutes to sync.           ||
|          | | - John D.                                           ||
|          | +----------------------------------------------------+|
|          | +----------------------------------------------------+|
|          | | ***** "Must have"                    Nov 20, 2025   ||
|          | | Cannot imagine using Cal without this.              ||
|          | | - Alex R.                                           ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          |              [ Show More Reviews ]                    |
|          |                                                       |
|          | -- Similar Apps ------------------------------------- |
|          |                                                       |
|          | +------------+ +------------+ +------------+          |
|          | | Outlook    | | Apple Cal  | | ICS Feed   |          |
|          | | Calendar   | | Calendar   | |            |          |
|          | | [Install]  | | [Install]  | | [Install]  |          |
|          | +------------+ +------------+ +------------+          |
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **App Header**: Large icon (64x64), name, developer, category badge, star rating, review count
- **Install CTA**: Primary install button with pricing (Free / $X/mo), "Visit Website" secondary link
- **Screenshot Carousel**: Horizontal scrollable screenshots with dot pagination
- **About Section**: Rich text description with bullet points
- **How It Works**: Step-by-step visual flow
- **Requirements**: Info banners about prerequisites
- **Reviews Section**: Star rating, review text, reviewer name, date
- **Similar Apps**: Related app cards row

## States

- **Not Installed**: Shows "Install App" button
- **Installed**: Shows "Configure" and "Disconnect" buttons instead
- **Loading**: Skeleton placeholder for app content
- **Error**: Error message if app data fails to load

## Interactions

- Click "Install App" -> navigates to `/apps/[slug]/setup`
- Click screenshot -> opens lightbox/modal with full-size image
- Click category badge -> navigates to `/apps/categories/[category]`
- Click similar app -> navigates to that app's detail page
- Click "Show More Reviews" -> expands/loads more reviews
