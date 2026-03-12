# OAuth Authorization

**Route:** `/auth/oauth2/authorize`
**Type:** Authenticated
**Parent Layout:** AuthLayout (minimal header)

## Description
OAuth 2.0 consent screen displayed when a third-party application requests access to a user's Cal.com account. Shows the requesting application's details, requested permissions/scopes, and allows the user to approve or deny access.

## Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                    [Cal.com Logo]                         |
|                                                          |
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |                                                    |  |
|  |    +------------------------------------------+    |  |
|  |    |                                          |    |  |
|  |    |    [Third-Party App Icon]                |    |  |
|  |    |                                          |    |  |
|  |    |    Zapier                                |    |  |
|  |    |    by Zapier Inc.                        |    |  |
|  |    |    https://zapier.com                    |    |  |
|  |    |                                          |    |  |
|  |    +------------------------------------------+    |  |
|  |                                                    |  |
|  |    Zapier wants to access your Cal.com account     |  |
|  |                                                    |  |
|  |    +------------------------------------------+    |  |
|  |    |  Signed in as:                           |    |  |
|  |    |  [Avatar] john@example.com               |    |  |
|  |    |           Not you? Switch account [link] |    |  |
|  |    +------------------------------------------+    |  |
|  |                                                    |  |
|  |    This will allow Zapier to:                      |  |
|  |                                                    |  |
|  |    +------------------------------------------+    |  |
|  |    |                                          |    |  |
|  |    |  [check] Read your profile information   |    |  |
|  |    |          Name, email, timezone            |    |  |
|  |    |                                          |    |  |
|  |    |  [check] View your event types           |    |  |
|  |    |          List and read event types        |    |  |
|  |    |                                          |    |  |
|  |    |  [check] Manage your bookings            |    |  |
|  |    |          Create, read, update bookings    |    |  |
|  |    |                                          |    |  |
|  |    |  [check] Read your availability          |    |  |
|  |    |          View schedules and busy times    |    |  |
|  |    |                                          |    |  |
|  |    +------------------------------------------+    |  |
|  |                                                    |  |
|  |  +--  --  --  --  --  --  --  --  --  --  --  --+  |  |
|  |  |  (!) Zapier will NOT be able to:             |  |  |
|  |  |  - Change your password or account settings  |  |  |
|  |  |  - Delete your account                       |  |  |
|  |  |  - Access your payment information           |  |  |
|  |  +--  --  --  --  --  --  --  --  --  --  --  --+  |  |
|  |                                                    |  |
|  |  +---------------------+  +---------------------+  |  |
|  |  |       Deny          |  |       Allow         |  |  |
|  |  +---------------------+  +---------------------+  |  |
|  |                                                    |  |
|  |  By clicking Allow, you agree to Zapier's          |  |
|  |  Terms of Service [link] and Privacy Policy [link] |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

## Components
- `Logo` - Cal.com brand logo
- `Card` - Third-party app info (icon, name, developer, URL)
- `Avatar` - Current user avatar
- `Text` - Signed-in user email
- `Link` - Switch account
- `List` - Permissions/scopes list with check icons and descriptions
- `Alert` (variant: muted) - "Will NOT be able to" restrictions
- `Button` (variant: secondary) - Deny authorization
- `Button` (variant: primary) - Allow authorization
- `Link` - Third-party Terms of Service
- `Link` - Third-party Privacy Policy

## User Actions
- Review requested permissions
- Click "Allow" to grant the application access
- Click "Deny" to reject the authorization request
- Click "Switch account" to sign in as a different user
- Click third-party Terms/Privacy links (open in new tab)

## Navigation
- Allow -> Redirect to app's `redirect_uri` with authorization code
- Deny -> Redirect to app's `redirect_uri` with `error=access_denied`
- Switch account -> `/auth/login?returnTo=/auth/oauth2/authorize?[params]`

## States
- **Default:** Consent form with permissions displayed
- **Loading app info:** Spinner while fetching app details from client_id
- **Allow loading:** Allow button shows spinner, Deny disabled
- **Deny loading:** Deny button shows spinner, Allow disabled
- **Error - Invalid client_id:** "Unknown application. This request may be invalid."
- **Error - Invalid redirect_uri:** "Invalid redirect URL. Contact the app developer."
- **Error - Invalid scope:** "This application is requesting permissions that don't exist."
- **Error - Not authenticated:** Redirect to `/auth/login` with returnTo param
- **Already authorized:** If same scopes already granted, auto-redirect (optional, configurable)
