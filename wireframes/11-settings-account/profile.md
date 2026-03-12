# Settings - Profile

## Overview
User profile management including avatar, name, username, bio, and custom links.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Profile                             |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Manage your public-facing profile   |  |
| | | (*) Profile         | | |  information.                       |  |
| | |     Appearance      | | |                                      |  |
| | |     Calendars       | | |  +--[ Avatar ]--------------------+  |  |
| | |     Conferencing    | | |  |                                 |  |  |
| | |     Features        | | |  |  Profile Picture                |  |  |
| | |     Out of Office   | | |  |                                 |  |  |
| | |     Push Notif.     | | |  |  +------+                       |  |  |
| | +---------------------+ | |  |  |      |  [Upload Image]       |  |  |
| | ...                     | |  |  | [Av] |  [Remove]             |  |  |
| |                         | |  |  |      |                       |  |  |
| +-------------------------+ |  |  +------+  JPG, PNG or GIF.     |  |  |
|                             |  |            Max 5MB.              |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Basic Info ]-----------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Full Name                      |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | Jane Doe                    ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |                                 |  |  |
|                             |  |  Username                       |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | cal.com/ | janedoe          ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  (i) Your booking page URL      |  |  |
|                             |  |                                 |  |  |
|                             |  |  Email                          |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | jane@company.com       [🔒] ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  Managed by organization        |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ About ]----------------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Bio                            |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | Senior Account Executive    ||  |  |
|                             |  |  | at Acme Corp. I help teams  ||  |  |
|                             |  |  | find the right solutions.   ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  150/300 characters             |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Custom Links ]---------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Add links to your profile      |  |  |
|                             |  |  page (max 5).                  |  |  |
|                             |  |                                 |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | Label      | URL            ||  |  |
|                             |  |  |------------+----------------||  |  |
|                             |  |  | LinkedIn   | linkedin.com/  ||  |  |
|                             |  |  |            | in/janedoe [X] ||  |  |
|                             |  |  |------------+----------------||  |  |
|                             |  |  | Website    | janedoe.com    ||  |  |
|                             |  |  |            |            [X] ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |                                 |  |  |
|                             |  |  [+ Add Link]                   |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Danger Zone ]----------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Delete Account                 |  |  |
|                             |  |  Permanently delete your        |  |  |
|                             |  |  account and all associated     |  |  |
|                             |  |  data. This cannot be undone.   |  |  |
|                             |  |                                 |  |  |
|                             |  |  [Delete Account]  (red)        |  |  |
|                             |  +---------------------------------+  |  |
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
| Avatar Upload | ImageUpload | Crop/resize modal, drag-and-drop |
| Full Name | TextInput | Required field |
| Username | TextInput | Prefix "cal.com/", validates uniqueness |
| Email | TextInput | Read-only if org-managed, lock icon |
| Bio | Textarea | Max 300 chars, character counter |
| Custom Links | Repeater | Label + URL pairs, max 5, removable |
| Add Link Button | Button (ghost) | Adds new empty link row |
| Delete Account | Button (destructive) | Opens confirmation dialog |
| Cancel/Save | Button pair | Standard form actions |

## States
- **Pristine**: Save disabled
- **Dirty**: Save enabled, unsaved changes indicator
- **Username Taken**: Red border + "Username already taken" error
- **Email Locked**: Dimmed field with lock icon, tooltip explains org management
- **Upload Progress**: Progress bar on avatar during upload
- **Delete Confirmation**: Modal with "Type your username to confirm" input
