# Reset Password

**Route:** `/auth/forgot-password/[token]`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Form for setting a new password after receiving a reset link via email. Validates the reset token and allows the user to create a new password with strength requirements.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                 Reset your password                      |
|             Enter your new password below                |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |  New password *                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  | ************                          [eye]   |  |  |
|  |  +----------------------------------------------+  |  |
|  |  [========--] Strength: Strong                     |  |
|  |  - At least 7 characters                    [x]   |  |
|  |  - Contains a number                        [x]   |  |
|  |  - Contains uppercase letter                [x]   |  |
|  |                                                    |  |
|  |  Confirm password *                                |  |
|  |  +----------------------------------------------+  |  |
|  |  | ************                          [eye]   |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |          Reset Password                       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|            [<-] Back to sign in [link]                    |
|                                                          |
+----------------------------------------------------------+


=== SUCCESS STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Password reset successfully                 |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ check-circle icon ]                |  |
|  |                                                    |  |
|  |    Your password has been updated.                 |  |
|  |    You can now sign in with your new password.     |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |             Go to Sign In                     |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== EXPIRED TOKEN STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                Link expired                              |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ alert-circle icon ]                |  |
|  |                                                    |  |
|  |    This password reset link has expired or          |  |
|  |    has already been used.                          |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |        Request a New Link                     |  |  |
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
- `PasswordField` - New password input with show/hide toggle
- `PasswordStrengthMeter` - Visual password strength indicator
- `PasswordField` - Confirm password input with show/hide toggle
- `Button` (variant: primary) - Reset Password submit button
- `Link` - Back to sign in navigation
- `Icon` (check-circle) - Success state icon
- `Icon` (alert-circle) - Expired token state icon

## User Actions
- Enter new password (with real-time strength feedback)
- Enter confirmation password
- Click "Reset Password" to submit
- Click "Back to sign in" to return to login
- In success state: click "Go to Sign In"
- In expired state: click "Request a New Link" to go to forgot password

## Navigation
- Back to sign in -> `/auth/login`
- Go to Sign In (success) -> `/auth/login`
- Request a New Link (expired) -> `/auth/forgot-password`

## States
- **Default:** Empty password fields, button disabled
- **Validating token:** Loading spinner while checking token validity
- **Token valid:** Form displayed, ready for input
- **Token expired/invalid:** Shows expired state with link to request new reset
- **Password typing:** Real-time strength meter and requirement checks
- **Passwords mismatch:** Red border on confirm field, "Passwords do not match"
- **Loading:** Button shows spinner, fields disabled
- **Error - Weak password:** Inline error with unmet requirements highlighted
- **Success:** Shows success confirmation with link to sign in
