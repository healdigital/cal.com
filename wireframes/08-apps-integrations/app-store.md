# App Store Homepage

## Route: `/apps`

## Description
The app store homepage where users browse, search, and discover integrations. Features a search bar, featured apps section, category filters, and a grid of app cards.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Apps                                                  |
|          |                                                       |
| Event    | +------------------------------------------------------+
| Types    | | [x] Search apps...                                   |
| Bookings | +------------------------------------------------------+
| Avail.   |                                                       |
| Teams    | [All] [Calendar] [Video] [Payment] [CRM] [Analytics]  |
| Apps   * | [Automation] [Messaging] [Other]                      |
| Workflows|                                                       |
| Settings | -- Featured Apps ------------------------------------  |
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Google Icon]  | | [Zoom Icon]    | | [Stripe Icon]  |
|          | |                | |                | |                |
|          | | Google Calendar| | Zoom           | | Stripe         |
|          | | Connect your   | | Video meetings | | Accept payments|
|          | | Google Cal...  | | for your...    | | for your...    |
|          | |                | |                | |                |
|          | | [Install Free] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Outlook Icon] | | [MS Teams Icon]| | [HubSpot Icon] |
|          | |                | |                | |                |
|          | | Outlook Cal    | | MS Teams       | | HubSpot        |
|          | | Connect your   | | Video meetings | | Sync contacts  |
|          | | Outlook...     | | with Microsoft | | and deals...   |
|          | |                | |                | |                |
|          | | [Install Free] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | -- Popular Apps ------------------------------------- |
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Zapier Icon]  | | [Cal Video]    | | [PayPal Icon]  |
|          | |                | |                | |                |
|          | | Zapier         | | Cal Video      | | PayPal         |
|          | | Automate your  | | Built-in video | | Accept PayPal  |
|          | | workflows...   | | conferencing   | | payments...    |
|          | |                | |                | |                |
|          | | [Install Free] | | [  Installed ] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          | +----------------+ +----------------+ +----------------+
|          | | [Salesforce]   | | [Daily.co]     | | [Giphy Icon]   |
|          | |                | |                | |                |
|          | | Salesforce     | | Daily.co       | | Giphy          |
|          | | Enterprise CRM | | Video conf     | | Add GIFs to    |
|          | | integration    | | platform       | | your booking   |
|          | |                | |                | |                |
|          | | [Install Free] | | [Install Free] | | [Install Free] |
|          | +----------------+ +----------------+ +----------------+
|          |                                                       |
|          |              [ View All Apps --> ]                     |
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Search Bar**: Full-width text input with search icon, filters apps in real-time
- **Category Tabs**: Horizontal scrollable tabs to filter by app category
- **Featured Section**: Curated row of highlighted/recommended apps
- **Popular Section**: Most-installed apps grid
- **App Card**: Icon, name, short description, install button
  - Install button shows "Installed" state with checkmark if already connected
  - Shows "Free" or price badge

## States

- **Default**: Shows featured + popular apps
- **Search Active**: Shows filtered results matching query
- **Category Selected**: Shows only apps in selected category
- **Loading**: Skeleton cards while apps load

## Interactions

- Click category tab -> filters visible apps
- Click search bar -> activates search with debounced filtering
- Click app card -> navigates to `/apps/[slug]`
- Click "Install" button -> navigates to `/apps/[slug]/setup`
- Click "View All Apps" -> shows full paginated list
