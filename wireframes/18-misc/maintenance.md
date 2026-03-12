# Maintenance Page

## Overview
Displayed when the platform is undergoing scheduled or emergency maintenance.

## Wireframe

```
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
|                       [Cal.com Logo]                               |
|                                                                    |
|                                                                    |
|                        +--------+                                  |
|                        |        |                                  |
|                        | [tool] |                                  |
|                        |        |                                  |
|                        +--------+                                  |
|                                                                    |
|                                                                    |
|                  We'll Be Back Soon                                |
|                                                                    |
|           We're currently performing scheduled                     |
|           maintenance to improve your experience.                  |
|                                                                    |
|                                                                    |
|              +-------------------------------+                     |
|              |                               |                     |
|              |  Estimated time remaining:    |                     |
|              |                               |                     |
|              |        ~ 30 minutes           |                     |
|              |                               |                     |
|              +-------------------------------+                     |
|                                                                    |
|                                                                    |
|           Existing meetings will not be affected.                  |
|           All scheduled bookings will proceed                     |
|           as planned.                                             |
|                                                                    |
|                                                                    |
|              [Check Status Page]                                   |
|                                                                    |
|                                                                    |
|              Follow updates:                                       |
|              [Twitter]  [Status Page RSS]                          |
|                                                                    |
|                                                                    |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+
```

## Components

### Logo
- Cal.com logo centered at top

### Maintenance Icon
- Wrench/tool icon indicating maintenance work

### Message
- **Title**: "We'll Be Back Soon"
- **Description**: Brief explanation of the maintenance
- **Reassurance**: Existing meetings are unaffected

### Estimated Time
- Card showing estimated time remaining
- Updates dynamically if possible

### Status Links
- Link to external status page
- Social media links for updates

## States
- **Scheduled maintenance**: Shows estimated time, calm messaging
- **Emergency maintenance**: "We're working on resolving an issue" messaging, no time estimate
- **Nearly done**: "Almost there! We're finishing up..."
- **Back online**: Auto-redirects to home page
