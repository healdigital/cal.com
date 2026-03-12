# Auth Error

**Route:** `/auth/error`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
Generic authentication error page displayed when auth flows fail unexpectedly. Handles various error types including OAuth failures, SAML errors, session issues, and misconfigured providers. Displays a user-friendly message with actionable recovery steps.

## Wireframe

```
=== DEFAULT ERROR STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|               Something went wrong                       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |              [ alert-triangle icon ]               |  |
|  |                                                    |  |
|  |    We encountered a problem while trying to        |  |
|  |    sign you in.                                    |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |  Error: OAuthAccountNotLinked               |  |  |
|  |  |                                              |  |  |
|  |  |  An account with this email already exists   |  |  |
|  |  |  using a different sign-in method. Try        |  |  |
|  |  |  signing in with your original method.       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |    What you can try:                               |  |
|  |                                                    |  |
|  |    1. Sign in with a different method              |  |
|  |    2. Use the "Forgot password" flow to            |  |
|  |       reset your credentials                       |  |
|  |    3. Contact support if the issue persists        |  |
|  |                                                    |  |
|  |  +---------------------+  +---------------------+  |  |
|  |  |   Go to Sign In     |  |  Contact Support    |  |  |
|  |  +---------------------+  +---------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== OAUTH CALLBACK ERROR ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Authentication failed                       |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |              [ shield-x icon ]                     |  |
|  |                                                    |  |
|  |    The authentication provider returned an          |  |
|  |    error. This may be a temporary issue.           |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |  Provider: Google                            |  |  |
|  |  |  Error: access_denied                        |  |  |
|  |  |                                              |  |  |
|  |  |  You may have denied access or there was     |  |  |
|  |  |  a problem with the provider.                |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |              Try Again                        |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |         Or sign in another way [link]              |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== CONFIGURATION ERROR ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Configuration error                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |              [ settings icon ]                     |  |
|  |                                                    |  |
|  |    This sign-in method is not properly              |  |
|  |    configured. Please contact your                 |  |
|  |    administrator.                                  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |  Error code: SAML_CONFIGURATION_ERROR        |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |           Go to Sign In                       |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Icon` (alert-triangle) - Generic error icon
- `Icon` (shield-x) - Auth provider error icon
- `Icon` (settings) - Configuration error icon
- `Alert` (variant: error) - Error details box with code and description
- `Text` - Recovery steps (numbered list)
- `Button` (variant: primary) - Primary action (Go to Sign In / Try Again)
- `Button` (variant: secondary) - Secondary action (Contact Support)
- `Link` - Alternative navigation

## User Actions
- Click "Go to Sign In" to return to login page
- Click "Try Again" to retry the failed auth flow
- Click "Contact Support" to open support page
- Click "sign in another way" to go to login with method selection

## Navigation
- Go to Sign In -> `/auth/login`
- Try Again -> Retry previous auth flow (e.g., `/api/auth/signin/google`)
- Contact Support -> `/support` or external support URL
- Sign in another way -> `/auth/login`

## States

### Error Types and Messages
- **OAuthAccountNotLinked:** Email exists with different provider. Suggest original sign-in method.
- **OAuthSignin:** Failed to start OAuth flow. "Try Again" button.
- **OAuthCallback:** Provider returned an error (access_denied, server_error).
- **OAuthCreateAccount:** Could not create account from OAuth data.
- **EmailCreateAccount:** Could not create account with email.
- **Callback:** Error in auth callback handler.
- **OAuthProfileParseError:** Could not parse profile from provider.
- **SessionRequired:** User must be signed in. Redirect to login.
- **SAML_CONFIGURATION_ERROR:** SAML SSO is misconfigured for this org.
- **AccessDenied:** User denied access at the provider.
- **Verification:** Email verification token expired or invalid.
- **Default:** Unknown error with generic message and recovery steps.
