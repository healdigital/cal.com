# Team Members

**Route:** `/settings/teams/[teamId]/members`
**Type:** Authenticated (Admin/Owner only)
**Parent Layout:** Team Settings Layout

## Description
Team members management page showing all current members with their roles. Allows inviting new members, searching/filtering the member list, changing roles, and removing members. Role-based access controls determine which actions are available.

## Wireframe

```
+------------------------------------------------------------------+
| Cal.com                    [?] [Bell] [Avatar v]                 |
+----------+-------------------------------------------------------+
| Event    |                                                       |
| Types    |  Engineering Team > Members                           |
| Bookings |                                                       |
| Availab. |  +--------------------------------------------------+ |
| Teams    |  | [Search members...]          [+ Invite Member]    | |
| Apps     |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Members (12)                                         |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) John Smith                                    | |
|          |  |     john@company.com             [Owner]     ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) Sarah Johnson                                 | |
|          |  |     sarah@company.com            [Admin]     ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) Mike Chen                                     | |
|          |  |     mike@company.com             [Member]    ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) Lisa Wang                                     | |
|          |  |     lisa@company.com             [Member]    ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) Alex Rivera                                   | |
|          |  |     alex@company.com             [Member]    ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  Showing 5 of 12               [< 1  2  3 >]        |
|          |                                                       |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  Pending Invitations (2)                              |
|          |  -------------------------------------------------   |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) kate@company.com                              | |
|          |  |     Invited Mar 10, 2026         [Member]    ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
|          |  +--------------------------------------------------+ |
|          |  | (@) tom@newco.io                                  | |
|          |  |     Invited Mar 8, 2026          [Admin]     ...  | |
|          |  +--------------------------------------------------+ |
|          |                                                       |
+----------+-------------------------------------------------------+

Member Action Menu [...] (for Owner viewing a Member):
+------------------------+
| Change role            |
|   > Owner              |
|   > Admin              |
|   > Member (current)   |
|------------------------|
| Remove from team       |
+------------------------+

Member Action Menu [...] (for Admin viewing a Member):
+------------------------+
| Change role            |
|   > Admin              |
|   > Member (current)   |
|------------------------|
| Remove from team       |
+------------------------+

Pending Invitation Action Menu [...]:
+------------------------+
| Resend invitation      |
| Copy invite link       |
|------------------------|
| Revoke invitation      |
+------------------------+

Invite Member Dialog:
+------------------------------------------+
|  Invite Team Member                 [X]  |
|                                          |
|  Email Address                           |
|  +------------------------------------+  |
|  | email@example.com                  |  |
|  +------------------------------------+  |
|                                          |
|  Role                                    |
|  +------------------------------------+  |
|  | Member                          [v]|  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | email2@example.com          [x]    |  |
|  | email3@example.com          [x]    |  |
|  +------------------------------------+  |
|  (Multiple emails can be added)          |
|                                          |
|              [Cancel]  [Send Invite]     |
+------------------------------------------+
```

## Components
- Breadcrumb (Team Name > Members)
- Search bar with text input for filtering members by name or email
- "Invite Member" button
- Member count label
- Member list rows (repeated)
  - Avatar (circular, with initials fallback)
  - Full name
  - Email address
  - Role badge: Owner (purple), Admin (blue), Member (gray)
  - Action overflow menu (role-dependent)
- Pagination controls (if more than 10 members)
- Pending invitations section
  - Invitation rows with email, invite date, assigned role, action menu
- Invite member modal
  - Email input (supports adding multiple emails)
  - Role dropdown (Member / Admin / Owner)
  - Cancel / Send Invite buttons

## User Actions
- Search/filter members by name or email
- Click "Invite Member" to open invite dialog
  - Enter one or more email addresses
  - Select role for invitees
  - Send invitations
- Click "..." on a member to open action menu
  - Change role (submenu with role options; current role indicated)
  - Remove from team (confirmation dialog)
- Click "..." on a pending invitation
  - Resend invitation
  - Copy invite link
  - Revoke invitation (confirmation dialog)
- Navigate through pagination

## Navigation
- Breadcrumb "Engineering Team" -> `/settings/teams/[teamId]/profile`
- Sidebar links to other main sections
- Team settings sub-navigation (Profile, Members, Appearance, etc.)

## States
- **Loading:** Skeleton rows (5 placeholder rows with pulsing avatar circles and text lines)
- **Empty (no members besides owner):** Message: "Invite your team members to start collaborating" with prominent invite button
- **No search results:** "No members matching '[query]'" with clear search button
- **No pending invitations:** Pending invitations section hidden
- **Error:** Banner: "Failed to load members. Please try again." with retry button
- **Role change in progress:** Role badge shows spinner briefly, then updates
- **Invite sending:** "Send Invite" button shows spinner, disabled state
- **Invite success:** Toast: "Invitation sent to kate@company.com"
- **Invite error (already member):** Inline error: "This email is already a team member"
- **Permission restricted:** Admins cannot change Owner role or remove other Admins; those menu items are hidden
- **Self-view:** Current user's row shows "(You)" next to name; "Remove from team" replaced with "Leave team"
