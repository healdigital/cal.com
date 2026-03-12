# Sign Up

**Route:** `/auth/signup`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Registration page for new Cal.com users. Collects name, email, and password. Supports social signup via Google. Requires acceptance of terms of service. Sends verification email upon successful registration.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Create your Cal.com account                 |
|           Start scheduling in under 2 minutes            |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  | [G] Sign up with Google                       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |              ---- or sign up with email ----       |  |
|  |                                                    |  |
|  |  Full name *                                       |  |
|  |  +----------------------------------------------+  |  |
|  |  | John Doe                                      |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  Username *                                        |  |
|  |  +----------------------------------------------+  |  |
|  |  | cal.com/ | johndoe                            |  |  |
|  |  +----------------------------------------------+  |  |
|  |  (i) This will be your Cal.com URL                 |  |
|  |                                                    |  |
|  |  Email address *                                   |  |
|  |  +----------------------------------------------+  |  |
|  |  | john@example.com                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  Password *                                        |  |
|  |  +----------------------------------------------+  |  |
|  |  | ************                          [eye]   |  |  |
|  |  +----------------------------------------------+  |  |
|  |  [====------] Strength: Medium                     |  |
|  |  - At least 7 characters                    [x]   |  |
|  |  - Contains a number                        [x]   |  |
|  |  - Contains uppercase letter                [ ]   |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  | [x] I agree to the Terms of Service [link]   |  |  |
|  |  |     and Privacy Policy [link]                 |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |           Create Account                      |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|       Already have an account? Sign in [link]            |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Button` (variant: outline) - Google social signup
- `Divider` - "or sign up with email" separator
- `TextField` - Full name input (required)
- `TextField` - Username input with `cal.com/` prefix and availability check
- `TextField` - Email input with validation (required)
- `PasswordField` - Password input with strength indicator (required)
- `PasswordStrengthMeter` - Visual password strength indicator
- `Checkbox` - Terms of Service and Privacy Policy agreement
- `Button` (variant: primary) - Create Account submit button
- `Link` - Sign in navigation for existing users
- `Link` - Terms of Service (opens in new tab)
- `Link` - Privacy Policy (opens in new tab)

## User Actions
- Click "Sign up with Google" to initiate Google OAuth registration
- Fill out name, username, email, and password fields
- Check terms of service checkbox (required)
- Click "Create Account" to submit registration
- Click "Sign in" to navigate to login page
- Toggle password visibility
- View password strength feedback in real-time

## Navigation
- Google OAuth -> External Google auth -> `/getting-started`
- Create Account (success) -> `/auth/verify-email`
- Sign in -> `/auth/login`
- Terms of Service -> `/terms` (new tab)
- Privacy Policy -> `/privacy` (new tab)

## States
- **Default:** Empty form, Create Account button disabled until required fields filled
- **Username checking:** Spinner next to username field, "Checking availability..."
- **Username taken:** Red border, "This username is already taken"
- **Username available:** Green check mark, "Username is available"
- **Password typing:** Real-time strength meter and requirement checks
- **Loading:** Create Account button shows spinner, fields disabled
- **Error - Email exists:** "An account with this email already exists. Sign in instead?"
- **Error - Validation:** Inline field-level errors (red borders, helper text)
- **Error - Rate limited:** Banner "Too many attempts. Please try again later."
- **Success:** Redirect to email verification page
