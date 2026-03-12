# Settings - Conferencing

## Overview
Default conferencing app selection and connected video/conferencing app management.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Conferencing                        |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Manage your video conferencing      |  |
| | |     Profile         | | |  apps and default meeting link.      |  |
| | |     Appearance      | | |                                      |  |
| | |     Calendars       | | |  +--[ Default Conferencing ]-------+ |  |
| | | (*) Conferencing    | | |  |                                  | |  |
| | |     Features        | | |  |  Default Conferencing App        | |  |
| | |     Out of Office   | | |  |  This app is used for new event  | |  |
| | |     Push Notif.     | | |  |  types by default.               | |  |
| | +---------------------+ | |  |                                  | |  |
| | ...                     | |  |  +------------------------------+| |  |
| |                         | |  |  | [Zoom icon] Zoom          [v] || |  |
| +-------------------------+ |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  Options:                        | |  |
|                             |  |  - Cal Video (built-in)          | |  |
|                             |  |  - Zoom                          | |  |
|                             |  |  - Google Meet                   | |  |
|                             |  |  - MS Teams                      | |  |
|                             |  |  (only connected apps shown)     | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Connected Apps ]--------------+ |  |
|                             |  |                                  | |  |
|                             |  |  Connected Video Apps            | |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | [Z] Zoom                     || |  |
|                             |  |  |     jane@company.com          || |  |
|                             |  |  |     Connected Feb 1, 2026     || |  |
|                             |  |  |     Status: Active            || |  |
|                             |  |  |                               || |  |
|                             |  |  |     [Set as Default]  [Discon]|| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | [G] Google Meet               || |  |
|                             |  |  |     jane@gmail.com            || |  |
|                             |  |  |     Connected Jan 15, 2026    || |  |
|                             |  |  |     Status: Active            || |  |
|                             |  |  |                               || |  |
|                             |  |  |     [Set as Default]  [Discon]|| |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  |  +------------------------------+| |  |
|                             |  |  | [C] Cal Video (built-in)     || |  |
|                             |  |  |     Always available           || |  |
|                             |  |  |     No setup required          || |  |
|                             |  |  |                               || |  |
|                             |  |  |     [Set as Default]          || |  |
|                             |  |  +------------------------------+| |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |  +--[ Add Conferencing App ]--------+ |  |
|                             |  |                                  | |  |
|                             |  |  Add a new conferencing app      | |  |
|                             |  |                                  | |  |
|                             |  |  +--------+ +--------+ +------+ | |  |
|                             |  |  | [Z]    | | [T]    | | [W]  | | |  |
|                             |  |  | Zoom   | | MS     | | Webex| | |  |
|                             |  |  |        | | Teams  | |      | | |  |
|                             |  |  |[Connct]| |[Connct]| |[Conn]| | |  |
|                             |  |  +--------+ +--------+ +------+ | |  |
|                             |  |                                  | |  |
|                             |  |  +--------+ +--------+          | |  |
|                             |  |  | [J]    | | [D]    |          | |  |
|                             |  |  | Jitsi  | | Daily  |          | |  |
|                             |  |  |        | | .co    |          | |  |
|                             |  |  |[Connct]| |[Connct]|          | |  |
|                             |  |  +--------+ +--------+          | |  |
|                             |  |                                  | |  |
|                             |  |  Already connected apps are      | |  |
|                             |  |  hidden from this list.          | |  |
|                             |  |                                  | |  |
|                             |  +----------------------------------+ |  |
|                             |                                      |  |
|                             |         +--------+ +-----------+     |  |
|                             |         | Cancel | | Save      |     |  |
|                             |         +--------+ +-----------+     |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Default App Select | Select | Only shows connected apps + Cal Video |
| Connected App Card | Card | Provider icon, email, status, actions |
| Set as Default | Button (ghost) | Updates default conferencing selection |
| Disconnect Button | Button (destructive ghost) | Removes app connection |
| App Grid | CardGrid | Available apps to connect |
| Connect Button | Button (secondary) | Starts OAuth flow for that provider |
| Cancel/Save | Button pair | Standard form actions |

## States
- **No Apps Connected**: Only Cal Video shown, "Connect a video app" prompt
- **Connecting**: OAuth popup/redirect, loading state on Connect button
- **Connection Error**: Red banner "Failed to connect [App]. Try again?"
- **Default Badge**: Green "Default" badge on the currently selected app card
- **Disconnecting**: Confirmation dialog "This will remove Zoom from all event types using it."
- **App Already Connected**: Connect button replaced with "Connected" checkmark
