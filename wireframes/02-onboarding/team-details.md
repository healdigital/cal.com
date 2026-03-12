# Team Details

**Route:** `/settings/teams/new`
**Type:** Authenticated
**Parent Layout:** Settings Layout

## Description
Team creation screen where users set up a new team. Includes fields for team name, a unique URL slug for the team's booking page, and an optional team logo upload. This is the first step of team setup before inviting members.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ← Back to Settings                                            │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │              Create Your Team                         │     │
│   │    Set up a team to share event types and manage      │     │
│   │    scheduling together.                               │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Team Logo (optional)                               │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │                                               │   │     │
│   │   │      ┌──────────────────────────┐             │   │     │
│   │   │      │  ┌──────────────────┐    │             │   │     │
│   │   │      │  │                  │    │             │   │     │
│   │   │      │  │    ┌────────┐    │    │             │   │     │
│   │   │      │  │    │ TEAM   │    │    │             │   │     │
│   │   │      │  │    │ 128x128│    │    │             │   │     │
│   │   │      │  │    └────────┘    │    │             │   │     │
│   │   │      │  │                  │    │             │   │     │
│   │   │      │  └──────────────────┘    │             │   │     │
│   │   │      │                          │             │   │     │
│   │   │      │  Click to upload or      │             │   │     │
│   │   │      │  drag and drop           │             │   │     │
│   │   │      │                          │             │   │     │
│   │   │      │  PNG, JPG, SVG           │             │   │     │
│   │   │      │  Max 5MB                 │             │   │     │
│   │   │      └──────────────────────────┘             │   │     │
│   │   │                                               │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Team Name *                                        │     │
│   │   ┌───────────────────────────────────────────────┐   │     │
│   │   │ Engineering Team                              │   │     │
│   │   └───────────────────────────────────────────────┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │    Team URL *                                         │     │
│   │   ┌──────────────────────────────────┬────────┐       │     │
│   │   │ cal.com/ │ engineering-team       │  ✓     │       │     │
│   │   └──────────────────────────────────┴────────┘       │     │
│   │    ✓ cal.com/engineering-team is available             │     │
│   │                                                       │     │
│   │    This is your team's public booking page URL.       │     │
│   │    You can change it later in team settings.          │     │
│   │                                                       │     │
│   │                                                       │     │
│   │   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │     │
│   │   │  Preview:                                     │   │     │
│   │   │  ┌───────────────────────────────────────┐    │   │     │
│   │   │  │ ┌────┐  Engineering Team              │    │   │     │
│   │   │  │ │logo│  cal.com/engineering-team       │    │   │     │
│   │   │  │ └────┘                                │    │   │     │
│   │   │  └───────────────────────────────────────┘    │   │     │
│   │   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │   ┌──────────────┐              ┌────────────────┐    │     │
│   │   │   Cancel      │              │  Continue →     │    │     │
│   │   └──────────────┘              └────────────────┘    │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `ImageUploader` - Drag-and-drop zone for team logo (supports PNG, JPG, SVG, max 5MB)
- `Avatar` - Preview of uploaded team logo at 128x128
- `TextField` - Team name input (required)
- `TextField` (with prefix) - Team URL slug with `cal.com/` prefix and availability check
- `HelperText` - Descriptive text below URL field
- `TeamPreview` - Live preview card showing how the team will appear
- `Button` (primary) - "Continue" to proceed to team invite step
- `Button` (secondary) - "Cancel" to abandon team creation

## User Actions
- Upload team logo by clicking the drop zone or dragging a file
- Remove uploaded logo by clicking an "X" overlay on the image
- Enter team name (auto-generates URL slug from name)
- Edit team URL slug manually (overrides auto-generated value)
- View live preview of team profile card
- Click "Continue" to save and proceed to invite members
- Click "Cancel" to abandon team creation

## Navigation
- **Continue**: Creates the team and advances to Team Invite step
- **Cancel**: Returns to Settings page without creating a team
- **Back to Settings**: Link at top returns to settings

## States
- **Empty**: All fields blank, upload zone shows placeholder
- **Logo Uploading**: Spinner overlay on drop zone during upload
- **Logo Uploaded**: Shows logo preview with remove button overlay
- **Logo Error**: "File too large" or "Invalid format" error below drop zone
- **Name Entered**: Auto-generates slug from name (e.g., "Engineering Team" -> "engineering-team")
- **Slug Checking**: Spinner in URL field during availability check
- **Slug Available**: Green checkmark and "available" text
- **Slug Taken**: Red X with "taken" text and alternative suggestions
- **Slug Invalid**: Error for invalid characters (only lowercase, numbers, hyphens allowed)
- **Preview Updating**: Live preview reflects current name, slug, and logo
- **Creating Team**: Continue button shows spinner, all fields disabled
- **Creation Error**: Error toast with message, fields re-enabled
