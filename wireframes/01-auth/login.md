# Login

**Route:** `/auth/login`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Primary login page for Cal.com. Allows users to sign in with email/password or via social/SSO providers. Redirects authenticated users to the dashboard.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Welcome back to Cal.com                     |
|          Sign in to manage your scheduling               |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |  +----------------------------------------------+  |  |
|  |  | [G] Continue with Google                      |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  | [S] Continue with SAML SSO                    |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +-------------------+  +------------------------+ |  |
|  |  |                   |  |                        | |  |
|  |  +-------------------+  +------------------------+ |  |
|  |              ---- or sign in with email ----       |  |
|  |                                                    |  |
|  |  Email address                                     |  |
|  |  +----------------------------------------------+  |  |
|  |  | user@example.com                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  Password                                          |  |
|  |  +----------------------------------------------+  |  |
|  |  | ************                          [eye]   |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |                          Forgot password? [link]   |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |              Sign In                          |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|         Don't have an account? Create one [link]         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Button` (variant: outline) - Google social login
- `Button` (variant: outline) - SAML SSO login
- `Divider` - "or sign in with email" separator
- `TextField` - Email input with validation
- `PasswordField` - Password input with show/hide toggle
- `Button` (variant: primary) - Sign In submit button
- `Link` - Forgot password navigation
- `Link` - Create account navigation
- `LocaleSelector` - Language switcher

## User Actions
- Click "Continue with Google" to initiate Google OAuth flow
- Click "Continue with SAML SSO" to navigate to SSO provider selection
- Enter email and password, then click "Sign In"
- Click "Forgot password?" to navigate to password reset
- Click "Create one" to navigate to signup page
- Toggle password visibility with eye icon
- Change locale via locale selector

## Navigation
- Google OAuth -> External Google auth -> `/getting-started` or `/event-types`
- SAML SSO -> `/auth/sso`
- Forgot password -> `/auth/forgot-password`
- Create account -> `/auth/signup`
- Successful login -> `/event-types` (default) or original requested URL

## States
- **Default:** Empty form, all fields enabled
- **Loading:** Sign In button shows spinner, fields disabled
- **Error - Invalid credentials:** Inline error banner "Invalid email or password"
- **Error - Account locked:** Banner "Account locked. Try again in 15 minutes."
- **Error - Unverified email:** Banner with "Verify your email" link
- **Success:** Redirect to dashboard
- **2FA required:** Redirect to `/auth/login?totp=true` for TOTP input
