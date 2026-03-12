# Connect and Join Wizard

## Overview
Multi-step wizard for new users to connect their calendar and join a team or organization.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|     Step 1 of 3                                                    |
|     [====]------[  2  ]------[  3  ]                               |
|     Connect      Join        Done                                  |
|                                                                    |
|                                                                    |
|     +--------------------------------------------------+          |
|     |                                                  |          |
|     |  Connect Your Calendar                           |          |
|     |                                                  |          |
|     |  Link your calendar to automatically check       |          |
|     |  for conflicts and add new bookings.             |          |
|     |                                                  |          |
|     |  +----------------------------------------------+|          |
|     |  |                                              ||          |
|     |  |  [G]  Google Calendar                        ||          |
|     |  |       Connect your Google account            ||          |
|     |  |                              [Connect]       ||          |
|     |  |                                              ||          |
|     |  +----------------------------------------------+|          |
|     |                                                  |          |
|     |  +----------------------------------------------+|          |
|     |  |                                              ||          |
|     |  |  [O]  Outlook / Office 365                   ||          |
|     |  |       Connect your Microsoft account         ||          |
|     |  |                              [Connect]       ||          |
|     |  |                                              ||          |
|     |  +----------------------------------------------+|          |
|     |                                                  |          |
|     |  +----------------------------------------------+|          |
|     |  |                                              ||          |
|     |  |  [A]  Apple Calendar                         ||          |
|     |  |       Connect via CalDAV                     ||          |
|     |  |                              [Connect]       ||          |
|     |  |                                              ||          |
|     |  +----------------------------------------------+|          |
|     |                                                  |          |
|     |                                                  |          |
|     |                       [Skip]  [Continue ->]      |          |
|     |                                                  |          |
|     +--------------------------------------------------+          |
|                                                                    |
+------------------------------------------------------------------+

Step 2 - Join Team:
+------------------------------------------------------------------+
|                                                                    |
|     Step 2 of 3                                                    |
|     [done]------[====]------[  3  ]                                |
|     Connect      Join        Done                                  |
|                                                                    |
|     +--------------------------------------------------+          |
|     |                                                  |          |
|     |  Join a Team                                     |          |
|     |                                                  |          |
|     |  You've been invited to join a team.             |          |
|     |                                                  |          |
|     |  +----------------------------------------------+|          |
|     |  |                                              ||          |
|     |  |  +------+                                    ||          |
|     |  |  | LOGO |  Acme Corporation                  ||          |
|     |  |  +------+  Engineering Team                  ||          |
|     |  |                                              ||          |
|     |  |  Invited by: John Smith                      ||          |
|     |  |  Role: Member                                ||          |
|     |  |  Members: 12                                 ||          |
|     |  |                                              ||          |
|     |  |         [Decline]  [Accept & Join]            ||          |
|     |  |                                              ||          |
|     |  +----------------------------------------------+|          |
|     |                                                  |          |
|     |  --- OR ---                                      |          |
|     |                                                  |          |
|     |  Have an invite code?                            |          |
|     |  +--------------------------------------+        |          |
|     |  | Enter invite code                    | [Join] |          |
|     |  +--------------------------------------+        |          |
|     |                                                  |          |
|     |                                                  |          |
|     |                       [Skip]  [Continue ->]      |          |
|     |                                                  |          |
|     +--------------------------------------------------+          |
|                                                                    |
+------------------------------------------------------------------+

Step 3 - Done:
+------------------------------------------------------------------+
|                                                                    |
|     Step 3 of 3                                                    |
|     [done]------[done]------[====]                                 |
|     Connect      Join        Done                                  |
|                                                                    |
|     +--------------------------------------------------+          |
|     |                                                  |          |
|     |               +--------+                         |          |
|     |               |        |                         |          |
|     |               |  [ok]  |                         |          |
|     |               |        |                         |          |
|     |               +--------+                         |          |
|     |                                                  |          |
|     |          You're All Set!                         |          |
|     |                                                  |          |
|     |    Your calendar is connected and you've         |          |
|     |    joined the Engineering Team.                  |          |
|     |                                                  |          |
|     |    What's next:                                  |          |
|     |    - Set up your availability                    |          |
|     |    - Create your first event type               |          |
|     |    - Share your booking link                     |          |
|     |                                                  |          |
|     |                                                  |          |
|     |            [Go to Dashboard]                     |          |
|     |                                                  |          |
|     +--------------------------------------------------+          |
|                                                                    |
+------------------------------------------------------------------+
```

## Steps

### Step 1: Connect Calendar
- List of calendar providers (Google, Outlook, Apple)
- Each with a Connect button triggering OAuth flow
- Connected calendars show green checkmark
- Skip option to proceed without connecting

### Step 2: Join Team
- Pending team invitations displayed as cards
- Accept or decline each invitation
- Manual invite code entry option
- Skip option if no invitations

### Step 3: Done
- Success confirmation
- Summary of what was connected/joined
- Next steps suggestions
- Go to Dashboard button

## Navigation
- Step indicator at top showing progress
- Back/Continue buttons at bottom of each step
- Skip option on each step

## States
- **Calendar connected**: Green checkmark replaces Connect button
- **OAuth in progress**: Loading spinner on Connect button
- **OAuth failed**: Error message with retry option
- **No invitations**: Step 2 shows only invite code input
- **All steps skipped**: Done page adjusts messaging
