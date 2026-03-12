# Settings - Appearance

## Overview
Theme settings including light/dark/system mode, brand color, and custom CSS toggle.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
|                                                                       |
| +--[ Settings Sidebar ]--+ +--------------------------------------+  |
| |                         | |                                      |  |
| | ACCOUNT                 | |  Appearance                          |  |
| | +---------------------+ | |                                      |  |
| | |     General         | | |  Customize how Cal.com looks for     |  |
| | |     Profile         | | |  you and your bookers.               |  |
| | | (*) Appearance      | | |                                      |  |
| | |     Calendars       | | |  +--[ Theme ]---------------------+  |  |
| | |     Conferencing    | | |  |                                 |  |  |
| | |     Features        | | |  |  Theme                          |  |  |
| | |     Out of Office   | | |  |  Choose your preferred color    |  |  |
| | |     Push Notif.     | | |  |  scheme.                        |  |  |
| | +---------------------+ | |  |                                 |  |  |
| | ...                     | |  |  +--------+ +--------+ +------+ |  |  |
| |                         | |  |  | Light  | | Dark   | |System| |  |  |
| +-------------------------+ |  |  |        | |        | |      | |  |  |
|                             |  |  | +----+ | | +----+ | |+----+| |  |  |
|                             |  |  | |    | | | |    | | ||    || |  |  |
|                             |  |  | | Aa | | | | Aa | | || Aa || |  |  |
|                             |  |  | |    | | | |    | | ||    || |  |  |
|                             |  |  | +----+ | | +----+ | |+----+| |  |  |
|                             |  |  | [____] | | [____] | |[____]| |  |  |
|                             |  |  | [____] | | [____] | |[____]| |  |  |
|                             |  |  |        | |        | |      | |  |  |
|                             |  |  +---*----+ +--------+ +------+ |  |  |
|                             |  |    selected                      |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Brand Color ]-+--------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Brand Color                    |  |  |
|                             |  |  This color is used on your     |  |  |
|                             |  |  booking pages for buttons      |  |  |
|                             |  |  and accents.                   |  |  |
|                             |  |                                 |  |  |
|                             |  |  +---+ +---------------------+  |  |  |
|                             |  |  |   | | #292929             |  |  |  |
|                             |  |  | O | +---------------------+  |  |  |
|                             |  |  |   |                          |  |  |
|                             |  |  +---+                          |  |  |
|                             |  |   color                         |  |  |
|                             |  |   swatch                        |  |  |
|                             |  |                                 |  |  |
|                             |  |  Preview:                       |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  |                             ||  |  |
|                             |  |  |  [==Confirm Booking==]      ||  |  |
|                             |  |  |                             ||  |  |
|                             |  |  |  Selected: [*Thu 13*] Fri   ||  |  |
|                             |  |  |                             ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Dark Mode Brand Color ]------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Dark Mode Brand Color          |  |  |
|                             |  |  Separate color for dark mode.  |  |  |
|                             |  |                                 |  |  |
|                             |  |  +---+ +---------------------+  |  |  |
|                             |  |  |   | | #FAFAFA             |  |  |  |
|                             |  |  | O | +---------------------+  |  |  |
|                             |  |  +---+                          |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Custom CSS ]-----------------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Custom CSS                     |  |  |
|                             |  |  Add custom styles to your      |  |  |
|                             |  |  booking pages.                 |  |  |
|                             |  |                                 |  |  |
|                             |  |  Enable Custom CSS              |  |  |
|                             |  |  +-----+                        |  |  |
|                             |  |  |[  O]|  Off                   |  |  |
|                             |  |  +-----+                        |  |  |
|                             |  |                                 |  |  |
|                             |  |  (Shown when toggle is ON:)     |  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |  | /* Your custom CSS */       ||  |  |
|                             |  |  | .booking-page {             ||  |  |
|                             |  |  |   font-family: Inter;       ||  |  |
|                             |  |  | }                           ||  |  |
|                             |  |  +-----------------------------+|  |  |
|                             |  |                                 |  |  |
|                             |  |  (!) Custom CSS may break your  |  |  |
|                             |  |  booking page layout.           |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |  +--[ Booking Page Options ]-------+  |  |
|                             |  |                                 |  |  |
|                             |  |  Hide Branding                  |  |  |
|                             |  |  +-----+                        |  |  |
|                             |  |  |[O  ]|  On                    |  |  |
|                             |  |  +-----+                        |  |  |
|                             |  |  Remove "Powered by Cal.com"    |  |  |
|                             |  |  from booking pages.            |  |  |
|                             |  |                                 |  |  |
|                             |  +---------------------------------+  |  |
|                             |                                      |  |
|                             |         +--------+ +-----------+     |  |
|                             |         | Cancel | | Save      |     |  |
|                             |         +--------+ +-----------+     |  |
|                             +--------------------------------------+  |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Theme Selector | CardRadioGroup | Visual cards with preview thumbnails |
| Brand Color | ColorPicker | Swatch + hex input, opens color picker popover |
| Dark Brand Color | ColorPicker | Separate from light mode color |
| Brand Preview | Preview panel | Live preview of button/accent styling |
| Custom CSS Toggle | Switch | Enables/disables CSS editor |
| CSS Editor | CodeEditor | Syntax-highlighted textarea, monospace font |
| Hide Branding | Switch | Pro/Team plan feature |
| Cancel/Save | Button pair | Standard form actions |

## States
- **Light Selected**: Light card has selected border/checkmark
- **Dark Selected**: Dark card selected, page preview updates
- **System Selected**: System card selected, follows OS preference
- **CSS Enabled**: Code editor appears with warning notice
- **CSS Disabled**: Editor hidden, toggle off
- **Free Plan**: Hide Branding toggle disabled with "Upgrade" badge
- **Color Picker Open**: Popover with hue/saturation picker and hex input
