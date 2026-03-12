# SSO Provider Login

**Route:** `/auth/sso/[provider]`
**Type:** Public
**Parent Layout:** AuthLayout

## Description
SSO (Single Sign-On) entry point. Users enter their work email or select their organization, and the system identifies the correct SAML/OIDC provider to redirect them to. Supports direct provider links for organizations that share a fixed SSO URL with employees.

## Wireframe

```
=== DEFAULT STATE (email entry) ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Sign in with SSO                            |
|        Enter your work email to continue                 |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |  Work email address                                |  |
|  |  +----------------------------------------------+  |  |
|  |  | user@company.com                              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |            Continue with SSO                  |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|     Or sign in with email and password [link]            |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|    [locale selector]            (c) Cal.com 2026         |
|                                                          |
+----------------------------------------------------------+


=== REDIRECTING STATE ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Redirecting to your provider                 |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |               [ spinning loader ]                  |  |
|  |                                                    |  |
|  |    Redirecting you to                              |  |
|  |                                                    |  |
|  |    +------------------------------------------+    |  |
|  |    |  [Company Logo]                          |    |  |
|  |    |                                          |    |  |
|  |    |  Acme Corp Identity Provider             |    |  |
|  |    |  via Okta                                |    |  |
|  |    +------------------------------------------+    |  |
|  |                                                    |  |
|  |    Taking too long?                                |  |
|  |    Click here to redirect manually [link]          |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+


=== DIRECT PROVIDER STATE (org-specific URL) ===

+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
|              Sign in to Acme Corp                        |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |    +------------------------------------------+    |  |
|  |    |  [Acme Corp Logo]                        |    |  |
|  |    |                                          |    |  |
|  |    |  Acme Corp                               |    |  |
|  |    |  Organization SSO                        |    |  |
|  |    +------------------------------------------+    |  |
|  |                                                    |  |
|  |  +----------------------------------------------+  |  |
|  |  |       Continue to Acme Corp SSO              |  |  |
|  |  +----------------------------------------------+  |  |
|  |                                                    |  |
|  |  Or sign in with a different method [link]         |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `TextField` - Work email input
- `Button` (variant: primary) - Continue with SSO
- `Spinner` - Redirect loading indicator
- `Card` - Provider info display (logo, name, provider type)
- `Link` - Manual redirect fallback
- `Link` - Alternative sign-in method
- `Image` - Organization/provider logo

## User Actions
- Enter work email and click "Continue with SSO"
- Wait for automatic redirect to identity provider
- Click manual redirect link if auto-redirect fails
- Click "sign in with email and password" to go back to standard login
- In direct provider state: click "Continue to [Org] SSO"

## Navigation
- Continue with SSO -> External identity provider (Okta, Azure AD, etc.)
- After SSO callback -> `/auth/sso/callback` -> `/event-types`
- Sign in with email/password -> `/auth/login`
- Sign in with different method -> `/auth/login`

## States
- **Default:** Email entry form
- **Looking up provider:** Button loading while domain is checked
- **Provider found:** Redirecting state with provider info
- **Direct provider:** Organization-specific SSO page (no email needed)
- **Auto-redirect:** Automatic redirect after 2s with manual fallback
- **Error - No SSO configured:** "No SSO provider found for this domain"
- **Error - SSO callback failure:** "Authentication failed. Please try again."
- **Error - Account not provisioned:** "No Cal.com account found. Contact your admin."
