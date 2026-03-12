# Team Appearance

## Route: `/settings/teams/:teamId/appearance`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Appearance                          |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Brand Color                                |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  Primary Color                              |
|   Password  |  +----------+ +-------------------------+  |
|   Two-Factor|  | [##]     | | #292929                 |  |
|   SSO       |  | (swatch) | |                         |  |
|   Compliance|  +----------+ +-------------------------+  |
|   Imperson. |                                            |
|             |  Secondary Color                            |
| > Developer |  +----------+ +-------------------------+  |
|   API Keys  |  | [##]     | | #F3F4F6                 |  |
|   OAuth     |  | (swatch) | |                         |  |
|   Webhooks  |  +----------+ +-------------------------+  |
|             |                                            |
| > Team      |  ========================================  |
|   Settings  |                                            |
|  [Appearan] |  Team Logo                                  |
|   Profile   |  ----------------------------------------  |
|   Members   |                                            |
|   Roles     |  This logo appears on your team booking     |
|   Features  |  pages and emails.                          |
|   Billing   |                                            |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |      [Drop logo here or click]       |  |
|             |  |      PNG, SVG, max 2MB                |  |
|             |  |      Recommended: 240x80px            |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Theme                                      |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------+  +------------+            |
|             |  | +--------+ |  | +--------+ |            |
|             |  | |        | |  | |########| |            |
|             |  | | Light  | |  | | Dark   | |            |
|             |  | |        | |  | |        | |            |
|             |  | +--------+ |  | +--------+ |            |
|             |  |  (o) Light |  |  ( ) Dark  |            |
|             |  +------------+  +------------+            |
|             |                                            |
|             |  [ ] Allow users to override with their     |
|             |      own theme preference                   |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Custom CSS (Advanced)                      |
|             |  ----------------------------------------  |
|             |                                            |
|             |  [i] Enterprise plan only. Override         |
|             |      default styles on booking pages.       |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | /* Custom CSS here */                 |  |
|             |  |                                      |  |
|             |  | .booking-page {                       |  |
|             |  |   font-family: 'Inter', sans-serif;   |  |
|             |  | }                                     |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Preview                                    |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | +----------------------------------+ |  |
|             |  | |  [LOGO]  Acme Engineering        | |  |
|             |  | |                                  | |  |
|             |  | |  30 Minute Meeting               | |  |
|             |  | |  +----------------------------+  | |  |
|             |  | |  |  [Calendar Preview]        |  | |  |
|             |  | |  +----------------------------+  | |  |
|             |  | |                                  | |  |
|             |  | |  +----------------------------+  | |  |
|             |  | |  | Confirm Booking            |  | |  |
|             |  | |  +----------------------------+  | |  |
|             |  | |  (uses brand primary color)      | |  |
|             |  | +----------------------------------+ |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Appearance  |                      |
|             |  +------------------+                      |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Color Picker | `<ColorPicker>` | Swatch + hex input |
| Logo Upload | `<FileUpload>` | PNG/SVG, max 2MB |
| Theme Selector | `<RadioGroup>` | Light/Dark with previews |
| User Override | `<Checkbox>` | Allow personal theme |
| Custom CSS | `<CodeEditor>` | Enterprise only, syntax highlight |
| Preview | `<Card>` | Live preview of booking page |
| Save | `<Button>` | Primary |

## States

- **Default**: Current appearance settings loaded
- **Editing**: Live preview updates as settings change
- **Enterprise Locked**: Custom CSS grayed out with upgrade prompt
- **Saving**: Button spinner
- **Error**: Invalid color format, oversized logo
