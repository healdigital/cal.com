# SSO Configuration

## Route: `/settings/security/sso`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > SSO Configuration               |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  [i] SSO is available on Enterprise plans.  |
|   Appearance|                                            |
|             |  SSO Provider                               |
| > Security  |  ----------------------------------------  |
|   Password  |                                            |
|   Two-Factor|  Protocol                                  |
|  [SSO]      |  +--------------------------------------+  |
|   Compliance|  | SAML 2.0                          [v] |  |
|   Imperson. |  +--------------------------------------+  |
|             |                                            |
| > Developer |  ========================================  |
|   API Keys  |                                            |
|   OAuth     |  SAML Configuration                        |
|   Webhooks  |  ----------------------------------------  |
|             |                                            |
| > Team      |  Identity Provider Metadata URL             |
|   Settings  |  +--------------------------------------+  |
|   Profile   |  | https://idp.example.com/metadata     |  |
|   Members   |  +--------------------------------------+  |
|   Billing   |                                            |
|             |  -- OR upload metadata XML --               |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | [Upload] Drop XML file or click      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Entity ID / Issuer                         |
|             |  +--------------------------------------+  |
|             |  | https://app.cal.com/saml              |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ACS URL (Assertion Consumer Service)       |
|             |  +--------------------------------------+  |
|             |  | https://app.cal.com/api/auth/saml  [C]|  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  SSO Login URL                              |
|             |  +--------------------------------------+  |
|             |  | https://idp.example.com/sso/login    |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  X.509 Certificate                          |
|             |  +--------------------------------------+  |
|             |  | -----BEGIN CERTIFICATE-----          |  |
|             |  | MIIDXTCCAkWgAwIBAgIJALm...           |  |
|             |  | -----END CERTIFICATE-----            |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Advanced Options                           |
|             |  ----------------------------------------  |
|             |                                            |
|             |  [x] Require SSO for all team members       |
|             |  [ ] Allow password login as fallback       |
|             |  [ ] Auto-provision new users               |
|             |                                            |
|             |  Default Role for New Users                 |
|             |  +--------------------------------------+  |
|             |  | Member                            [v] |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +---------------+  +------------------+   |
|             |  | Test Config   |  | Save SSO Config  |   |
|             |  +---------------+  +------------------+   |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - OIDC Protocol Selected

```
+----------------------------------------------------------+
|             |                                            |
|             |  Protocol                                  |
|             |  +--------------------------------------+  |
|             |  | OpenID Connect (OIDC)             [v] |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  OIDC Configuration                        |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Discovery URL                              |
|             |  +--------------------------------------+  |
|             |  | https://idp.example.com/.well-known  |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Client ID                                  |
|             |  +--------------------------------------+  |
|             |  | cal-com-client-id-xxxxx              |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Client Secret                              |
|             |  +--------------------------------------+  |
|             |  | ********************************     |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Redirect URI                               |
|             |  +--------------------------------------+  |
|             |  | https://app.cal.com/auth/oidc/cb  [C]|  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Scopes                                     |
|             |  +--------------------------------------+  |
|             |  | openid profile email                 |  |
|             |  +--------------------------------------+  |
|             |                                            |
+----------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Protocol Select | `<Select>` | SAML 2.0 / OIDC toggle |
| Metadata URL | `<Input>` | URL to IdP metadata |
| XML Upload | `<FileUpload>` | Alternative to URL |
| Entity ID | `<Input>` | Auto-generated, editable |
| ACS URL | `<CopyField>` | Read-only, with copy button |
| Certificate | `<Textarea>` | X.509 cert in PEM format |
| Require SSO | `<Checkbox>` | Enforces SSO for all members |
| Test Config | `<Button>` | Secondary, opens test flow |
| Save | `<Button>` | Primary, saves configuration |

## States

- **No SSO**: Empty form, enterprise plan notice
- **Configuring**: Form with validation messages
- **Testing**: Test flow in progress, status indicators
- **Active**: Green status badge, configuration summary
- **Error**: Red validation messages on invalid fields
