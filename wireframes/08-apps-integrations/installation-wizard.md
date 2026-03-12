# Multi-Step Installation Wizard

## Route: `/apps/installation/[[...step]]`

## Description
A multi-step wizard flow for first-time app installation, typically triggered during onboarding or when installing apps that require multiple configuration steps. Uses a catch-all route to handle variable step counts.

## ASCII Wireframe

```
+------------------------------------------------------------------+
| Cal.com                                                          |
+------------------------------------------------------------------+
|                                                                  |
|    +----------------------------------------------------------+  |
|    |                                                          |  |
|    |   Install Your Apps                                      |  |
|    |                                                          |  |
|    |   (1)-----(2)-----(3)-----(4)                             |  |
|    |  Connect  Video  Payment  Done                           |  |
|    |  Calendar                                                |  |
|    |                                                          |  |
|    +----------------------------------------------------------+  |
|                                                                  |
|                                                                  |
|    -- Step 1: Connect Calendar --------------------------------  |
|                                                                  |
|    +----------------------------------------------------------+  |
|    |                                                          |  |
|    |  Connect your calendar to manage availability            |  |
|    |                                                          |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [G]  Google Calendar                              |  |  |
|    |  |       Sync with Google Calendar            [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [O]  Outlook / Office 365                         |  |  |
|    |  |       Sync with Microsoft Calendar         [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [A]  Apple Calendar                               |  |  |
|    |  |       Sync with iCloud Calendar            [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [C]  CalDAV                                       |  |  |
|    |  |       Any CalDAV-compatible calendar        [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |                                                          |  |
|    |  Connected: [*] Google Calendar (john@company.com)       |  |
|    |                                                          |  |
|    |                           [Skip]  [Continue -->]         |  |
|    |                                                          |  |
|    +----------------------------------------------------------+  |
|                                                                  |
|                                                                  |
|    -- Step 2: Video Conferencing ------------------------------   |
|                                                                  |
|    +----------------------------------------------------------+  |
|    |                                                          |  |
|    |  Set up video conferencing for your meetings             |  |
|    |                                                          |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [Z]  Zoom                                         |  |  |
|    |  |       Add Zoom meetings to bookings        [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [T]  Microsoft Teams                              |  |  |
|    |  |       Add Teams meetings to bookings       [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [M]  Google Meet                                  |  |  |
|    |  |       Add Meet links to bookings           [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [V]  Cal Video                                    |  |  |
|    |  |       Built-in video conferencing     [  Default ] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |                                                          |  |
|    |                     [<-- Back]  [Skip]  [Continue -->]   |  |
|    |                                                          |  |
|    +----------------------------------------------------------+  |
|                                                                  |
|                                                                  |
|    -- Step 3: Payment (Optional) ------------------------------  |
|                                                                  |
|    +----------------------------------------------------------+  |
|    |                                                          |  |
|    |  Accept payments for your bookings (optional)            |  |
|    |                                                          |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [S]  Stripe                                       |  |  |
|    |  |       Accept credit card payments          [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |  |                                                    |  |  |
|    |  |  [P]  PayPal                                       |  |  |
|    |  |       Accept PayPal payments               [Add >] |  |  |
|    |  |                                                    |  |  |
|    |  +----------------------------------------------------+  |  |
|    |                                                          |  |
|    |                     [<-- Back]  [Skip]  [Continue -->]   |  |
|    |                                                          |  |
|    +----------------------------------------------------------+  |
|                                                                  |
|                                                                  |
|    -- Step 4: All Done ----------------------------------------  |
|                                                                  |
|    +----------------------------------------------------------+  |
|    |                                                          |  |
|    |                    [CHECK ICON]                           |  |
|    |                                                          |  |
|    |              You're all set!                              |  |
|    |                                                          |  |
|    |   Your apps are configured and ready to go.              |  |
|    |                                                          |  |
|    |   Connected:                                             |  |
|    |   [*] Google Calendar                                    |  |
|    |   [*] Zoom                                               |  |
|    |   [--] Payment (skipped)                                 |  |
|    |                                                          |  |
|    |   You can manage your apps anytime from                  |  |
|    |   Settings > Apps.                                       |  |
|    |                                                          |  |
|    |            [  Go to Dashboard  ]                          |  |
|    |                                                          |  |
|    +----------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
```

## Components

- **Step Progress Bar**: Numbered circles connected by lines, current step highlighted
- **Step Header**: Step title and description
- **App Option List**: Vertical list of available apps per step
  - App icon and name
  - Short description
  - "Add" button / "Default" badge / "Connected" status
- **Connected Summary**: Shows which apps were connected in current step
- **Navigation**: Back / Skip / Continue buttons
- **Completion Screen**: Success icon, summary of connected apps, CTA to dashboard

## Steps (Typical Flow)

| Step | Name           | Required | Description                          |
|------|----------------|----------|--------------------------------------|
| 1    | Calendar       | Yes      | Connect at least one calendar        |
| 2    | Video          | No       | Set up video conferencing            |
| 3    | Payment        | No       | Configure payment collection         |
| 4    | Done           | --       | Summary and redirect                 |

## States

- **Step Active**: Current step highlighted in progress bar
- **Step Complete**: Checkmark on completed steps
- **Step Skipped**: Dimmed/dashed in progress bar
- **App Connecting**: Loading spinner on "Add" button during OAuth
- **App Connected**: Green checkmark replaces "Add" button
- **OAuth Error**: Error banner if connection fails

## Interactions

- Click "Add" on app -> initiates OAuth flow for that app
- Click "Skip" -> advances to next step without connecting
- Click "Continue" -> advances to next step (enabled after connecting at least one)
- Click "Back" -> returns to previous step
- Click "Go to Dashboard" -> navigates to main dashboard
- Step indicators are clickable to jump between completed steps
