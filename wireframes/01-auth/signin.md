# Sign In (Returning Users)

**Route:** `/auth/signin`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Streamlined sign-in page for returning users. Detects previously used auth method and highlights it. May pre-fill email from a cookie or URL parameter. Redirects to `/auth/login` if no prior session info is found.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                   Welcome back!                          |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |  [Avatar]                                     |  |  |
|  |  |                                               |  |  |
|  |  |  john@example.com                             |  |  |
|  |  |  Last signed in with Google                   |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  | [G] Continue with Google              [arrow] |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |              ---- or use another method ----       |  |
|  |                                                    |  |
|  |  Email address                                     |  |
|  |  +----------------------------------------------+  |  |
|  |  | john@example.com                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  Password                                          |  |
|  |  +----------------------------------------------+  |  |
|  |  | ************                          [eye]   |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |              Sign In                          |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |                          Forgot password? [link]   |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|          Not you? Sign in with a different               |
|                   account [link]                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Avatar` - User's profile image from previous session
- `Card` - Previous session info display
- `Button` (variant: primary, outline) - Preferred auth method (Google shown)
- `Divider` - "or use another method" separator
- `TextField` - Email input (pre-filled)
- `PasswordField` - Password input with show/hide toggle
- `Button` (variant: primary) - Sign In submit button
- `Link` - Forgot password navigation
- `Link` - "Sign in with a different account" clears session cookie

## User Actions
- Click preferred provider button to re-authenticate with saved method
- Enter password to sign in with email/password
- Click "Forgot password?" to navigate to password reset
- Click "Sign in with a different account" to clear saved info and go to `/auth/login`
- Toggle password visibility

## Navigation
- Preferred provider -> External OAuth -> `/event-types`
- Sign In (password) -> `/event-types` or original requested URL
- Forgot password -> `/auth/forgot-password`
- Different account -> `/auth/login` (clears returning user cookie)
- No saved session detected -> Redirect to `/auth/login`

## States
- **Default:** Pre-filled email, preferred method highlighted
- **No saved session:** Redirect to `/auth/login`
- **Loading:** Active button shows spinner
- **Error - Invalid password:** Inline error "Incorrect password"
- **Error - Provider failure:** Banner "Could not connect to Google. Try again."
- **Success:** Redirect to dashboard
