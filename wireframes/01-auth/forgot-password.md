# Forgot Password

**Route:** `/auth/forgot-password`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Allows users to request a password reset link sent to their email. Shows a confirmation message after submission regardless of whether the email exists (to prevent email enumeration).

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                 Forgot your password?                    |
|       Enter your email and we'll send you a link         |
|              to reset your password.                     |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |  Email address                                     |  |
|  |  +----------------------------------------------+  |  |
|  |  | user@example.com                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |         Send Reset Link                       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|            [<-] Back to sign in [link]                    |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+


=== SUCCESS STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                    Check your email                       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |                  [ envelope icon ]                 |  |
|  |                                                    |  |
|  |    If an account exists for user@example.com,      |  |
|  |    you will receive a password reset link           |  |
|  |    shortly.                                        |  |
|  |                                                    |  |
|  |    Didn't receive the email?                       |  |
|  |    Check your spam folder or                       |  |
|  |    try another email address [link]                |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |          Back to Sign In                      |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `TextField` - Email input with validation
- `Button` (variant: primary) - Send Reset Link submit button
- `Link` - Back to sign in navigation
- `Icon` (envelope) - Success state illustration
- `Alert` (variant: info) - Success confirmation message

## User Actions
- Enter email address
- Click "Send Reset Link" to submit
- Click "Back to sign in" to return to login page
- In success state: click "try another email address" to reset form
- In success state: click "Back to Sign In" to return to login

## Navigation
- Back to sign in -> `/auth/login`
- Try another email -> Resets to default state (same page)
- Successful submit -> Shows success state on same page
- Reset link in email -> `/auth/forgot-password/[token]` (reset password page)

## States
- **Default:** Empty email field, button enabled
- **Loading:** Button shows spinner, field disabled
- **Success:** Shows "Check your email" confirmation (always, for security)
- **Error - Invalid email format:** Inline field error "Please enter a valid email"
- **Error - Rate limited:** Banner "Too many requests. Please wait a few minutes."
