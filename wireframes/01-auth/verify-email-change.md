# Verify Email Change

**Route:** `/auth/verify-email-change?token=[token]`
**Type:** Public (token-gated)
**Parent Layout:** AuthLayout

## Description
Confirmation screen shown when a user clicks the verification link after requesting an email address change from their account settings. Validates the token and confirms the email update.

## Wireframe

```
=== VERIFYING STATE (initial load) ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Verifying email change...                   |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ spinning loader ]                  |  |
|  |                                                    |  |
|  |        Confirming your new email address...        |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== SUCCESS STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                Email updated!                            |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ check-circle icon ]                |  |
|  |                                                    |  |
|  |    Your email has been changed to:                 |  |
|  |                                                    |  |
|  |         newemail@example.com                       |  |
|  |                                                    |  |
|  |    You will use this email to sign in              |  |
|  |    going forward.                                  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |           Go to Dashboard                     |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== ERROR STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Verification failed                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ alert-circle icon ]                |  |
|  |                                                    |  |
|  |    This email change link is invalid or has        |  |
|  |    expired. Email change links are valid for       |  |
|  |    24 hours.                                       |  |
|  |                                                    |  |
|  |    To change your email, go to your account        |  |
|  |    settings and request a new change.              |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |          Go to Settings                       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |            [<-] Back to sign in [link]             |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Spinner` - Loading state during token verification
- `Icon` (check-circle) - Success state icon
- `Icon` (alert-circle) - Error state icon
- `Text` - New email address (bold)
- `Button` (variant: primary) - "Go to Dashboard" or "Go to Settings"
- `Link` - Back to sign in

## User Actions
- Wait for automatic token verification on page load
- In success state: click "Go to Dashboard" to continue
- In error state: click "Go to Settings" to re-initiate email change
- In error state: click "Back to sign in" to return to login

## Navigation
- Go to Dashboard (success) -> `/event-types`
- Go to Settings (error) -> `/settings/my-account/profile`
- Back to sign in -> `/auth/login`

## States
- **Verifying:** Spinner shown while token is checked server-side
- **Success:** New email displayed, dashboard button shown
- **Error - Expired token:** Token older than 24 hours
- **Error - Invalid token:** Malformed or tampered token
- **Error - Already used:** Token has already been consumed
- **Error - Email taken:** The new email was claimed by another user in the meantime
