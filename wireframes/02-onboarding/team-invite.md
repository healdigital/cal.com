# Team Invite

**Route:** `/settings/teams/{teamId}/invite`
**Type:** Authenticated
**Parent Layout:** Settings Layout

## Description
Team member invitation screen where team admins invite colleagues by email. Features a dynamic email input list where multiple emails can be added, each with a role selector (Member or Admin). Includes a bulk invite option and a send button. Users can skip this step and invite members later.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ← Back to Team Settings                                       │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │            Invite Team Members                        │     │
│   │    Add your teammates to "Engineering Team".          │     │
│   │    They'll receive an email invitation.               │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Email Address                  Role                │     │
│   │   ┌──────────────────────────┐  ┌───────────┐  ┌──┐  │     │
│   │   │ alice@company.com        │  │ Member  ▼ │  │ ✕│  │     │
│   │   └──────────────────────────┘  └───────────┘  └──┘  │     │
│   │                                                       │     │
│   │   ┌──────────────────────────┐  ┌───────────┐  ┌──┐  │     │
│   │   │ bob@company.com          │  │ Admin   ▼ │  │ ✕│  │     │
│   │   └──────────────────────────┘  └───────────┘  └──┘  │     │
│   │                                                       │     │
│   │   ┌──────────────────────────┐  ┌───────────┐  ┌──┐  │     │
│   │   │ carol@company.com        │  │ Member  ▼ │  │ ✕│  │     │
│   │   └──────────────────────────┘  └───────────┘  └──┘  │     │
│   │                                                       │     │
│   │   ┌──────────────────────────┐  ┌───────────┐        │     │
│   │   │ Enter email address...   │  │ Member  ▼ │        │     │
│   │   └──────────────────────────┘  └───────────┘        │     │
│   │                                                       │     │
│   │   + Add another                                       │     │
│   │                                                       │     │
│   │   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │     │
│   │                                                       │     │
│   │   Or invite via link                                  │     │
│   │   ┌───────────────────────────────────┬──────────┐    │     │
│   │   │ https://cal.com/teams/abc12/inv.. │  Copy    │    │     │
│   │   └───────────────────────────────────┴──────────┘    │     │
│   │   Anyone with this link can join as a Member.         │     │
│   │                                                       │     │
│   │   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │     │
│   │                                                       │     │
│   │   Role permissions:                                   │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │  Member                                       │   │     │
│   │   │  • Can view team event types                  │   │     │
│   │   │  • Can be assigned to events                  │   │     │
│   │   │  • Cannot manage team settings                │   │     │
│   │   │                                               │   │     │
│   │   │  Admin                                        │   │     │
│   │   │  • All Member permissions                     │   │     │
│   │   │  • Can manage team settings                   │   │     │
│   │   │  • Can invite and remove members              │   │     │
│   │   │  • Can manage team event types                │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │   ┌──────────────────────────────────────────────┐    │     │
│   │   │          Send Invitations (3)                │    │     │
│   │   └──────────────────────────────────────────────┘    │     │
│   │                                                       │     │
│   │                  Skip, I'll do this later             │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `InviteRow` - Email input + role select + remove button, repeatable
- `TextField` (email) - Email address input with validation
- `Select` - Role dropdown with "Member" and "Admin" options
- `IconButton` - Remove (X) button to delete an invite row
- `Link` - "+ Add another" to append a new empty invite row
- `TextField` (readonly) - Invite link with copy button
- `Button` (outline) - "Copy" to copy invite link to clipboard
- `RolePermissions` - Collapsible info panel explaining role differences
- `Button` (primary, full-width) - "Send Invitations (N)" with count
- `Link` - "Skip, I'll do this later" to skip inviting

## User Actions
- Type an email address in any row
- Select a role (Member or Admin) from the dropdown per row
- Click "X" to remove an invite row
- Click "+ Add another" to add a new blank row
- Click "Copy" to copy the team invite link
- Review role permissions in the info panel
- Click "Send Invitations" to send all invites at once
- Click "Skip" to finish team setup without inviting anyone
- Press Enter in email field to add another row automatically

## Navigation
- **Send Invitations**: Sends invites and redirects to team dashboard
- **Skip**: Redirects to team dashboard without sending invites
- **Back to Team Settings**: Returns to team settings page

## States
- **Empty**: One blank email row with role defaulting to "Member"
- **Typing**: Email field with active cursor, no validation yet
- **Valid Email**: No visual indicator (clean state)
- **Invalid Email**: Red border and "Please enter a valid email" error below the field
- **Duplicate Email**: Orange warning "This email is already in the list"
- **Already Member**: Warning "This person is already a team member"
- **Row Removing**: Brief fade-out animation when removing a row
- **Link Copied**: "Copy" button text changes to "Copied!" for 2 seconds
- **Sending**: Button shows spinner and "Sending..." text, all fields disabled
- **Send Success**: Success toast "3 invitations sent!" then redirect
- **Send Partial Failure**: Toast listing which invites failed, successful ones noted
- **Send Error**: Error toast, fields re-enabled to retry
