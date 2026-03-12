# Teams

**Route:** `/teams`
**Type:** Authenticated
**Parent Layout:** Main Nav

## Description
Teams listing page showing all teams the user belongs to or manages. Each team is displayed as a card with the team name, member count, a stacked avatar preview of members, and a manage button. A "Create Team" button allows creating new teams.

## Wireframe

```
+------------------------------------------------------------------+
| Cal.com                    [?] [Bell] [Avatar v]                 |
+----------+-------------------------------------------------------+
| Event    |                                                       |
| Types    |  Teams                                [+ Create Team] |
| Bookings |  -------------------------------------------------   |
| Availab. |                                                       |
| Teams    |  +--------------------------------------------------+ |
| Apps     |  |                                                    | |
|          |  |  [Logo]  Engineering Team                          | |
|          |  |                                                    | |
|          |  |  (@@@@)  12 members                               | |
|          |  |                                                    | |
|          |  |  cal.com/engineering                               | |
|          |  |                                                    | |
|          |  |                     [Manage]  [...]                | |
|          |  |                                                    | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  |                                                    | |
|          |  |  [Logo]  Design Team                               | |
|          |  |                                                    | |
|          |  |  (@@@@)  5 members                                | |
|          |  |                                                    | |
|          |  |  cal.com/design                                   | |
|          |  |                                                    | |
|          |  |                     [Manage]  [...]                | |
|          |  |                                                    | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  |                                                    | |
|          |  |  [Logo]  Sales                                    | |
|          |  |                                                    | |
|          |  |  (@@@@)  8 members                                | |
|          |  |                                                    | |
|          |  |  cal.com/sales                                    | |
|          |  |                                                    | |
|          |  |                       [View]  [...]                | |
|          |  |                                                    | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  Invitations                                          |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  |  [Logo]  Marketing Team                            | |
|          |  |  Invited by Jane Smith                             | |
|          |  |                                                    | |
|          |  |                     [Accept]  [Decline]            | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
+----------+-------------------------------------------------------+

Avatar Stack Detail:
(@@@@) = overlapping circular avatars
+---+--+--+--+------+
| A | B| C| D| +8   |
+---+--+--+--+------+
Shows first 4 member avatars + count of remaining

[...] Menu (expanded):
+--------------------+
| Copy link          |
| Team settings      |
|--------------------|
| Leave team         |
+--------------------+

[...] Menu (Owner):
+--------------------+
| Copy link          |
| Team settings      |
|--------------------|
| Disband team       |
+--------------------+
```

## Components
- Shell / Main Navigation sidebar
- Page header with title and "Create Team" button
- Team card (repeated)
  - Team logo/avatar
  - Team name
  - Member avatar stack (first 4 avatars + "+N" overflow)
  - Member count label
  - Team URL (cal.com/team-slug)
  - Primary action button: "Manage" (for admins/owners) or "View" (for members)
  - Overflow menu
- Invitations section (only shown if pending invitations exist)
  - Invitation card with team name, inviter, Accept/Decline buttons

## User Actions
- Click "Create Team" to start team creation flow
- Click "Manage" to go to team settings/members page (admin/owner only)
- Click "View" to see team profile (member role)
- Click "..." to open overflow menu
  - Copy link: copies the team booking URL
  - Team settings: navigates to team settings
  - Leave team: confirmation dialog, then removes user from team
  - Disband team (owner only): confirmation dialog, then deletes team
- Accept/Decline team invitations

## Navigation
- "Create Team" -> `/teams/new` (or modal flow)
- "Manage" -> `/settings/teams/[teamId]/members`
- "View" -> `/team/[teamSlug]` (public team page)
- "Team settings" -> `/settings/teams/[teamId]/profile`
- Sidebar links to other main sections

## States
- **Loading:** Skeleton team cards (2-3 placeholders with pulsing animation)
- **Empty:** Illustration with "You're not part of any teams yet" message, "Create a Team" CTA button, and "Teams allow you to collaborate on scheduling" description
- **No invitations:** Invitations section hidden entirely
- **Error:** Banner: "Failed to load teams. Please try again." with retry button
- **Member role:** "Manage" button replaced with "View" button, overflow menu shows "Leave team" instead of "Disband team"
