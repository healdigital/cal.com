# Logout

**Route:** `/auth/logout`
**Type:** Authenticated
**Parent Layout:** AuthLayout

## Description
Logout confirmation page. Ends the user's session, clears authentication cookies, and redirects to the login page. Provides a brief confirmation before redirect. Handles both voluntary logout and forced session expiration.

## Wireframe

```
=== LOGGING OUT STATE (brief, auto-redirect) ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                  Signing you out...                       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ spinning loader ]                  |  |
|  |                                                    |  |
|  |          Ending your session securely.             |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== LOGGED OUT STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                 You've been signed out                    |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |              [ logout/wave icon ]                  |  |
|  |                                                    |  |
|  |    You have been successfully signed out            |  |
|  |    of your Cal.com account.                        |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |            Sign In Again                      |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |    You will be redirected in 5 seconds...          |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== SESSION EXPIRED STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|                Session expired                           |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |              [ clock/expired icon ]                |  |
|  |                                                    |  |
|  |    Your session has expired for security            |  |
|  |    reasons. Please sign in again to continue.      |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |              Sign In                          |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Spinner` - Logging out loading indicator
- `Icon` (wave/logout) - Logged out state illustration
- `Icon` (clock) - Session expired illustration
- `Text` - Status message
- `Text` - Auto-redirect countdown
- `Button` (variant: primary) - Sign In Again

## User Actions
- Wait for automatic redirect to login page (5 seconds)
- Click "Sign In Again" to immediately go to login page
- In session expired state: click "Sign In" to go to login page

## Navigation
- Sign In Again -> `/auth/login`
- Auto-redirect (5s) -> `/auth/login`
- Sign In (session expired) -> `/auth/login`

## States
- **Logging out:** Spinner shown while session is being destroyed
- **Logged out:** Confirmation message with auto-redirect countdown
- **Session expired:** Shown when session timeout triggered the logout
- **Error - Logout failed:** Rare; shows "There was an issue signing you out. Please clear your cookies."
