# Two-Factor Authentication Settings

## Route: `/settings/security/two-factor`

## Wireframe - 2FA Disabled

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > Two-Factor Authentication       |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Two-Factor Authentication                 |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  Add an extra layer of security to your    |
|   Password  |  account by requiring a verification code  |
|  [Two-Facto]|  in addition to your password.             |
|   SSO       |                                            |
|   Compliance|  Status: ( ) Disabled                      |
|   Imperson. |                                            |
|             |  +--------------------+                    |
| > Developer |  | Enable 2FA         |                    |
|   API Keys  |  +--------------------+                    |
|   OAuth     |                                            |
|   Webhooks  |                                            |
|             |                                            |
| > Team      |                                            |
|   Settings  |                                            |
|   Profile   |                                            |
|   Members   |                                            |
|   Billing   |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - 2FA Setup Modal

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Set Up Two-Factor Authentication           [ X ]  |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  Step 1: Scan QR Code                            |   |
|   |                                                  |   |
|   |  Scan this QR code with your authenticator       |   |
|   |  app (Google Authenticator, Authy, etc.)         |   |
|   |                                                  |   |
|   |        +--------------------+                    |   |
|   |        |                    |                    |   |
|   |        |    [QR CODE ART]   |                    |   |
|   |        |                    |                    |   |
|   |        |    +-----------+   |                    |   |
|   |        |    |  # # # #  |   |                    |   |
|   |        |    |  # # # #  |   |                    |   |
|   |        |    |  # # # #  |   |                    |   |
|   |        |    +-----------+   |                    |   |
|   |        |                    |                    |   |
|   |        +--------------------+                    |   |
|   |                                                  |   |
|   |  Can't scan? Use this code:                      |   |
|   |  +------------------------------------------+    |   |
|   |  | ABCD EFGH IJKL MNOP QRST UVWX       [C] |    |   |
|   |  +------------------------------------------+    |   |
|   |                                                  |   |
|   |  Step 2: Enter Verification Code                 |   |
|   |                                                  |   |
|   |  +----+ +----+ +----+ +----+ +----+ +----+      |   |
|   |  |    | |    | |    | |    | |    | |    |      |   |
|   |  +----+ +----+ +----+ +----+ +----+ +----+      |   |
|   |                                                  |   |
|   |  +------------+  +--------------------+          |   |
|   |  | Cancel      |  | Verify & Enable   |          |   |
|   |  +------------+  +--------------------+          |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Wireframe - 2FA Enabled

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Security > Two-Factor Authentication       |
| > General   |  ========================================  |
|             |                                            |
| > Security  |  Two-Factor Authentication                 |
|   Password  |  ----------------------------------------  |
|  [Two-Facto]|                                            |
|   SSO       |  Status: (o) Enabled  [Green Badge]        |
|   Compliance|                                            |
|   Imperson. |  ----------------------------------------  |
|             |                                            |
| > Developer |  Backup Codes                              |
|             |                                            |
|             |  Save these codes in a safe place. Each    |
|             |  code can only be used once.               |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |  a1b2-c3d4    e5f6-g7h8              |  |
|             |  |  i9j0-k1l2    m3n4-o5p6              |  |
|             |  |  q7r8-s9t0    u1v2-w3x4              |  |
|             |  |  y5z6-a7b8    c9d0-e1f2              |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  [Download]  [Copy]  [Regenerate]          |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------+                    |
|             |  | Disable 2FA        |  (Danger style)    |
|             |  +--------------------+                    |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Enable 2FA | `<Button>` | Opens setup modal |
| QR Code | `<QRCode>` | Generated from TOTP secret |
| Manual Code | `<CopyField>` | Fallback for QR scan |
| Verification Input | `<OTPInput>` | 6-digit code entry |
| Backup Codes | `<CodeBlock>` | 8 one-time backup codes |
| Download | `<Button>` | Downloads codes as .txt |
| Copy | `<Button>` | Copies codes to clipboard |
| Regenerate | `<Button>` | Generates new backup codes |
| Disable 2FA | `<Button>` | Destructive, requires confirmation |

## States

- **Disabled**: Shows enable button and explanation
- **Setup**: Modal with QR code and verification
- **Enabled**: Shows status, backup codes, disable option
- **Verifying**: Spinner on verify button
- **Error**: Invalid code message below OTP input

## Interactions

1. Click "Enable 2FA" opens setup modal
2. User scans QR code with authenticator app
3. User enters 6-digit verification code
4. On success, backup codes are displayed
5. User can download/copy backup codes
6. "Disable 2FA" requires password confirmation
