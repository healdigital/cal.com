# Auth Setup (First-Time Deployment)

**Route:** `/auth/setup`
**Type:** Public
**Parent Layout:** Minimal Auth Layout (centered, no navigation)

## Description
Initial authentication setup screen shown on first-time Cal.com deployment. Allows the instance administrator to create the first admin account. This screen is only accessible when no users exist in the database. Once the admin account is created, this route becomes inaccessible and redirects to the standard login page.

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                                                                 │
│                                                                 │
│                        ┌──────────┐                             │
│                        │ Cal.com  │                             │
│                        └──────────┘                             │
│                                                                 │
│         ┌───────────────────────────────────────────┐           │
│         │                                           │           │
│         │        Welcome to Cal.com                 │           │
│         │        ─────────────────                  │           │
│         │                                           │           │
│         │   Let's set up your admin account.        │           │
│         │   This will be the first user with full   │           │
│         │   administrative privileges.              │           │
│         │                                           │           │
│         │                                           │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │  ⚠  First-time setup              │   │           │
│         │   │  This page is only shown once.    │   │           │
│         │   │  The account you create here will │   │           │
│         │   │  have full admin access.          │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │                                           │           │
│         │                                           │           │
│         │    Administrator Username *                │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │ admin                             │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │                                           │           │
│         │    Full Name *                            │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │ Jane Smith                        │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │                                           │           │
│         │    Email Address *                        │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │ admin@yourcompany.com             │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │                                           │           │
│         │    Password *                             │           │
│         │   ┌─────────────────────────────┬─────┐   │           │
│         │   │ ••••••••••••                │ 👁  │   │           │
│         │   └─────────────────────────────┴─────┘   │           │
│         │    Min 8 chars, 1 uppercase, 1 number     │           │
│         │                                           │           │
│         │    ┌─────────────────────────────────┐    │           │
│         │    │ Strength: ████████░░  Strong    │    │           │
│         │    └─────────────────────────────────┘    │           │
│         │                                           │           │
│         │    Confirm Password *                     │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │ ••••••••••••                      │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │    ✓ Passwords match                      │           │
│         │                                           │           │
│         │                                           │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │      Create Admin Account         │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │                                           │           │
│         │                                           │           │
│         │   By creating an account, you agree to    │           │
│         │   Cal.com's Terms of Service and          │           │
│         │   Privacy Policy.                         │           │
│         │                                           │           │
│         └───────────────────────────────────────────┘           │
│                                                                 │
│         ┌───────────────────────────────────────────┐           │
│         │                                           │           │
│         │   Instance Configuration (optional)       │           │
│         │                                           │           │
│         │    License Key                            │           │
│         │   ┌───────────────────────────────────┐   │           │
│         │   │ cal_lic_xxxxxxxxxxxxxxxxxxxx      │   │           │
│         │   └───────────────────────────────────┘   │           │
│         │    Enter your license key to enable       │           │
│         │    enterprise features. You can add       │           │
│         │    this later in Admin Settings.          │           │
│         │                                           │           │
│         └───────────────────────────────────────────┘           │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components
- `Alert` (warning) - First-time setup notice explaining this is a one-time screen
- `TextField` - Administrator username input
- `TextField` - Full name input
- `TextField` (email) - Email address input
- `PasswordField` - Password input with show/hide toggle
- `PasswordStrengthMeter` - Visual bar indicating password strength (Weak/Fair/Strong)
- `PasswordField` - Confirm password input
- `PasswordMatchIndicator` - Checkmark or X showing whether passwords match
- `Button` (primary, full-width) - "Create Admin Account" submit button
- `LegalLinks` - Terms of Service and Privacy Policy links
- `TextField` - Optional license key input in collapsible section
- `HelperText` - Field-level helper text and validation messages

## User Actions
- Enter administrator username
- Enter full name
- Enter email address
- Enter password (strength meter updates in real-time)
- Toggle password visibility with eye icon
- Enter confirm password (match indicator updates in real-time)
- Optionally enter a license key
- Click "Create Admin Account" to create the account and start onboarding
- Click Terms of Service or Privacy Policy links to view them

## Navigation
- **Create Admin Account**: Creates the admin user and redirects to `/getting-started`
- **Terms of Service**: Opens in new tab
- **Privacy Policy**: Opens in new tab
- **After setup**: This route redirects to `/auth/login` for all future visits

## States
- **Initial**: All fields empty, button disabled until required fields are filled
- **Guard Check**: On page load, checks if any users exist; redirects to `/auth/login` if so
- **Typing**: Real-time validation as user types
- **Password Weak**: Strength meter red, "Weak" label
- **Password Fair**: Strength meter yellow, "Fair" label
- **Password Strong**: Strength meter green, "Strong" label
- **Passwords Match**: Green checkmark below confirm password
- **Passwords Mismatch**: Red X "Passwords do not match" below confirm password
- **Email Invalid**: Red border and "Please enter a valid email" error
- **Form Valid**: All fields pass validation, submit button enabled
- **Submitting**: Button shows spinner "Creating account...", all fields disabled
- **Success**: Redirect to `/getting-started` with success toast
- **Error**: Error message below form (e.g., "Failed to create account. Please try again.")
- **Already Setup**: Redirect to `/auth/login` with info message "Setup already completed"
