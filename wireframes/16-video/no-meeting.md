# Meeting Not Found

## Overview
Error page shown when attempting to join a meeting that does not exist or has an invalid link.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                        +--------+                                  |
|                        |        |                                  |
|                        |  [!]   |                                  |
|                        |        |                                  |
|                        +--------+                                  |
|                                                                    |
|                   Meeting Not Found                                |
|                                                                    |
|              This meeting does not exist or                        |
|              the link you followed is invalid.                     |
|                                                                    |
|              This could happen if:                                 |
|              - The meeting was cancelled                           |
|              - The link has expired                                |
|              - The URL was entered incorrectly                     |
|                                                                    |
|                                                                    |
|                      [  Go Home  ]                                 |
|                                                                    |
|              Need help? Contact support                            |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+
```

## Components

### Error Icon
- Large warning/error icon centered on page
- Visually distinct and clear

### Error Message
- **Title**: "Meeting Not Found"
- **Description**: Explanation of why the meeting cannot be found
- **Possible reasons**: Bulleted list of common causes

### Actions
- **Go Home**: Primary button, navigates to cal.com home
- **Contact support**: Text link below the button

## States
- **Default**: As shown above
- **Authenticated user**: "Go Home" links to dashboard instead
- **With meeting ID**: Shows partial meeting reference in message
