# Verify Email

**Route:** `/auth/verify-email`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Shown after signup to prompt the user to verify their email address. Displays instructions and allows resending the verification email. Also handles the verification token callback when the user clicks the link in their email.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                 Verify your email                        |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |                 [ inbox icon ]                     |  |
|  |                                                    |  |
|  |        We've sent a verification email to          |  |
|  |                                                    |  |
|  |            john@example.com                        |  |
|  |                                                    |  |
|  |    Click the link in the email to verify your      |  |
|  |    account and get started with Cal.com.           |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |                                              |  |  |
|  |  |   +------+  +------+  +------+  +------+    |  |  |
|  |  |   |      |  |      |  |      |  |      |    |  |  |
|  |  |   +------+  +------+  +------+  +------+    |  |  |
|  |  |                                              |  |  |
|  |  |       ( illustrative email graphic )         |  |  |
|  |  |                                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  +  |  |
|  |  |  Didn't get the email?                       |  |  |
|  |  |                                              |  |  |
|  |  |  - Check your spam/junk folder               |  |  |
|  |  |  - Make sure john@example.com is correct     |  |  |
|  |  |                                              |  |  |
|  |  |  +----------------------------------------+  |  |  |
|  |  |  |        Resend Verification Email       |  |  |  |
|  |  |  +----------------------------------------+  |  |  |
|  |  |                                              |  |  |
|  |  |  Resend available in 58s                     |  |  |
|  |  +-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  +  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|     Wrong email? Sign up with a different one [link]     |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+


=== VERIFICATION SUCCESS STATE (after clicking email link) ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                 Email verified!                          |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ check-circle icon ]                |  |
|  |                                                    |  |
|  |    Your email has been verified successfully.       |  |
|  |    You can now sign in to your account.            |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |              Continue                         |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Icon` (inbox) - Email inbox illustration
- `Text` - User's email address (bold)
- `Text` - Instructions paragraph
- `Button` (variant: secondary) - Resend Verification Email
- `Text` - Countdown timer for resend cooldown
- `Link` - "Sign up with a different one" navigation
- `Icon` (check-circle) - Verification success icon
- `Button` (variant: primary) - Continue after verification

## User Actions
- Click "Resend Verification Email" to trigger another email (with cooldown)
- Click "Sign up with a different one" to go back to signup
- Click verification link in email (opens this page with token)
- Click "Continue" after successful verification

## Navigation
- Sign up with different email -> `/auth/signup`
- Verification link in email -> `/auth/verify-email?token=[token]`
- Continue (after verification) -> `/getting-started`
- Already verified + logged in -> `/event-types`

## States
- **Default:** Waiting for verification, email displayed
- **Resend cooldown:** Button disabled, countdown timer shown (60s)
- **Resend loading:** Button shows spinner
- **Resend success:** Toast "Verification email sent"
- **Resend error:** Toast "Failed to send email. Try again."
- **Verifying token:** Loading spinner while token is validated
- **Verification success:** Green check, "Continue" button shown
- **Verification failed:** Error message "Invalid or expired link. Request a new one."
