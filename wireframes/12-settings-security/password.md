# Password Settings

## Route: `/settings/security/password`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > Password                       |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Change Password                           |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  Current Password                          |
|  [Password] |  +--------------------------------------+  |
|   Two-Factor|  | ********************************     |  |
|   SSO       |  +--------------------------------------+  |
|   Compliance|                                            |
|   Imperson. |  New Password                              |
|             |  +--------------------------------------+  |
| > Developer |  | ********************************     |  |
|   API Keys  |  +--------------------------------------+  |
|   OAuth     |  [!] Min 8 chars, 1 uppercase, 1 number   |
|   Webhooks  |                                            |
|             |  Confirm New Password                      |
| > Team      |  +--------------------------------------+  |
|   Settings  |  | ********************************     |  |
|   Profile   |  +--------------------------------------+  |
|   Members   |                                            |
|   Billing   |  +------------------+                      |
|             |  | Update Password  |                      |
|             |  +------------------+                      |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Password Requirements                     |
|             |  [ ] Minimum 8 characters                  |
|             |  [ ] At least one uppercase letter          |
|             |  [ ] At least one number                    |
|             |  [ ] At least one special character         |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Current Password | `<PasswordInput>` | Required, masked |
| New Password | `<PasswordInput>` | Required, masked, strength indicator |
| Confirm Password | `<PasswordInput>` | Must match new password |
| Update Password | `<Button>` | Primary, disabled until valid |
| Requirements | Checklist | Real-time validation feedback |

## States

- **Default**: Empty form fields
- **Validating**: Real-time password strength check
- **Error**: Mismatch or weak password highlighted in red
- **Success**: Toast notification "Password updated successfully"
- **Loading**: Button shows spinner during submission

## Interactions

1. User enters current password
2. User enters new password (strength meter updates)
3. User confirms new password (match check)
4. Click "Update Password" submits form
5. On success, all fields clear and toast appears
