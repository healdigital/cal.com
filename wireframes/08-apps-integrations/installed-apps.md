# Installed Apps

## Route: `/apps/installed/[category]`

## Description
Lists all installed apps for the current user, filtered by category. Shows connection status, configuration options, and disconnect controls.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                [?] [Bell] [Avatar \/]    |
+----------+-------------------------------------------------------+
| SIDEBAR  | Installed Apps                                         |
|          |                                                       |
| Event    | [Calendar] [Video] [Payment] [Automation] [Other]     |
| Types    |  --------                                             |
| Bookings |                                                       |
| Avail.   | Calendar Integrations (3 installed)                    |
| Teams    |                                                       |
| Apps   * | +----------------------------------------------------+|
| Workflows| | [G]  Google Calendar                                ||
| Settings | |      john@company.com                               ||
|          | |                                                    ||
|          | |      Status: [*] Connected                         ||
|          | |      Checking conflicts: Work Cal, Personal Cal     ||
|          | |      Adding events to: Work Calendar                ||
|          | |      Last synced: 2 minutes ago                     ||
|          | |                                                    ||
|          | |      [Configure]  [Disconnect]                      ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | | [O]  Outlook Calendar                               ||
|          | |      john@outlook.com                               ||
|          | |                                                    ||
|          | |      Status: [*] Connected                         ||
|          | |      Checking conflicts: Main Calendar              ||
|          | |      Adding events to: Main Calendar                ||
|          | |      Last synced: 5 minutes ago                     ||
|          | |                                                    ||
|          | |      [Configure]  [Disconnect]                      ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | | [A]  Apple Calendar                                  ||
|          | |      john@icloud.com                                ||
|          | |                                                    ||
|          | |      Status: [!] Needs Re-authentication            ||
|          | |                                                    ||
|          | |      (!) Your Apple Calendar connection has          ||
|          | |      expired. Please re-authenticate to              ||
|          | |      continue syncing.                               ||
|          | |                                                    ||
|          | |      [Re-connect]  [Remove]                          ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | +----------------------------------------------------+|
|          | |                                                    ||
|          | |  + Add another calendar integration                 ||
|          | |                                                    ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | -- Default Calendars --------------------------------- |
|          |                                                       |
|          | Check for conflicts:                                   |
|          | +----------------------------------------------------+|
|          | | [x] Work Calendar (Google)                          ||
|          | | [x] Personal Calendar (Google)                      ||
|          | | [x] Main Calendar (Outlook)                         ||
|          | | [ ] Holidays (Google)                               ||
|          | +----------------------------------------------------+|
|          |                                                       |
|          | Add events to:                                         |
|          | +----------------------------------------------------+|
|          | | Work Calendar (Google)                          [\/]||
|          | +----------------------------------------------------+|
|          |                                                       |
+----------+-------------------------------------------------------+
```

## Components

- **Category Tabs**: Filter installed apps by category (Calendar, Video, Payment, etc.)
- **Installed App Card**: Expanded card for each installed app
  - App icon and name
  - Connected account email/identifier
  - Status indicator (Connected / Needs Attention / Disconnected)
  - Configuration summary (which calendars, settings)
  - Last synced timestamp
  - Action buttons: Configure, Disconnect / Re-connect, Remove
- **Error/Warning Banner**: Shown on cards needing attention (expired auth, sync errors)
- **Add More Link**: "Add another [category] integration" at bottom
- **Default Calendars Section** (Calendar category only):
  - Conflict-check calendar checkboxes
  - Destination calendar dropdown

## Status Indicators

| Status               | Icon  | Color  | Description                           |
|----------------------|-------|--------|---------------------------------------|
| Connected            | [*]   | Green  | Working properly                      |
| Needs Re-auth        | [!]   | Yellow | OAuth token expired, needs reconnect  |
| Sync Error           | [x]   | Red    | Persistent sync failures              |
| Disconnected         | [--]  | Gray   | Manually disconnected, data retained  |

## States

- **Default**: Shows all installed apps in selected category
- **Empty Category**: "No [category] apps installed. Browse [category] apps."
- **Loading**: Skeleton cards while loading
- **Disconnecting**: Confirmation dialog before disconnect

## Interactions

- Click category tab -> filters to that category's installed apps
- Click "Configure" -> opens inline settings or navigates to `/apps/[slug]/setup`
- Click "Disconnect" -> shows confirmation dialog, then disconnects
- Click "Re-connect" -> initiates OAuth flow to refresh token
- Click "Remove" -> confirmation dialog, then removes app entirely
- Click "Add another..." -> navigates to app store filtered by category
- Toggle conflict calendars -> updates availability checking preferences
- Change destination calendar -> updates where new events are created
