# Profile Setup

**Route:** `/getting-started/profile`
**Type:** Authenticated
**Parent Layout:** Onboarding Layout (Getting Started Wizard - Step 1)

## Description
First step of onboarding where users set up their public profile. Includes avatar upload, full name, unique username (which determines their booking URL), timezone selection, and an optional bio. The username is validated in real-time for availability.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    (●)───────(○)───────(○)───────(○)───────(○)                  │
│   Profile  Calendar  Avail.   Settings  Complete                │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                                                       │     │
│   │              Set Up Your Profile                      │     │
│   │    This is how you'll appear to people booking        │     │
│   │    time with you.                                     │     │
│   │                                                       │     │
│   │         ┌─────────────────────┐                       │     │
│   │         │    ┌───────────┐    │                       │     │
│   │         │    │           │    │                       │     │
│   │         │    │   👤      │    │                       │     │
│   │         │    │  96x96    │    │                       │     │
│   │         │    │           │    │                       │     │
│   │         │    └───────────┘    │                       │     │
│   │         │   Upload Avatar     │                       │     │
│   │         │   PNG, JPG < 5MB    │                       │     │
│   │         └─────────────────────┘                       │     │
│   │                                                       │     │
│   │    Full Name *                                        │     │
│   │   ┌───────────────────────────────────────────┐       │     │
│   │   │ Jane Smith                                │       │     │
│   │   └───────────────────────────────────────────┘       │     │
│   │                                                       │     │
│   │    Username *                                         │     │
│   │   ┌──────────────────────────────────┬────────┐       │     │
│   │   │ cal.com/ │ janesmith             │  ✓     │       │     │
│   │   └──────────────────────────────────┴────────┘       │     │
│   │    ✓ cal.com/janesmith is available                   │     │
│   │                                                       │     │
│   │    Timezone *                                         │     │
│   │   ┌───────────────────────────────────────────┐       │     │
│   │   │ America/New_York (EST, UTC-5)          ▼  │       │     │
│   │   └───────────────────────────────────────────┘       │     │
│   │    Auto-detected from your browser                    │     │
│   │                                                       │     │
│   │    About (optional)                                   │     │
│   │   ┌───────────────────────────────────────────┐       │     │
│   │   │                                           │       │     │
│   │   │ A few words about yourself...             │       │     │
│   │   │                                           │       │     │
│   │   │                                           │       │     │
│   │   └───────────────────────────────────────────┘       │     │
│   │    0/300 characters                                   │     │
│   │                                                       │     │
│   │                                                       │     │
│   │                                    ┌────────────────┐ │     │
│   │                                    │  Continue →     │ │     │
│   │                                    └────────────────┘ │     │
│   │                                                       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `Avatar` - Circular avatar display with upload overlay
- `ImageUploader` - Drag-and-drop or click-to-upload for avatar image
- `TextField` - Full name input (pre-filled from auth provider if available)
- `TextField` (with prefix) - Username input with `cal.com/` prefix and availability indicator
- `TimezoneSelect` - Searchable dropdown of IANA timezones, auto-detects from browser
- `TextArea` - Bio/about textarea with character counter (max 300)
- `Button` (primary) - "Continue" to proceed to next step
- `Label` - Field labels with required indicator (*)

## User Actions
- Click or drag-drop to upload avatar image
- Type full name (required)
- Type username; real-time availability check with debounce
- Select timezone from searchable dropdown (auto-detected default)
- Type optional bio text
- Click "Continue" to save and proceed

## Navigation
- **Continue**: Saves profile data and advances to Calendar Connect step
- **Step indicator**: Can click back to this step after completing it

## States
- **Initial**: Fields pre-filled from OAuth provider data (name, email-based username)
- **Avatar Uploading**: Spinner overlay on avatar circle during upload
- **Avatar Uploaded**: Shows uploaded image with "Remove" option
- **Username Checking**: Spinner icon in username field during availability check
- **Username Available**: Green checkmark and "available" text
- **Username Taken**: Red X and "taken" text with suggestions below
- **Timezone Auto-detected**: Helper text "Auto-detected from your browser"
- **Validation Errors**: Red border on invalid fields with error message below
- **Saving**: Continue button shows spinner, fields disabled
