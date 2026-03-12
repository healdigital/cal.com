# Routing Analytics

## Overview
Analytics for routing forms showing funnel visualization, completion rates, and drop-off points.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
| [< Sidebar]                                                           |
|                                                                       |
| +-------------------------------------------------------------------+ |
| | Insights  >  Routing Analytics                                    | |
| |                                                                   | |
| | +------------------+  +------------------------+                  | |
| | | Date Range       |  | Routing Form           |                  | |
| | | [Mar 1 - Mar 12 v]  | [Sales Qualification v]|                  | |
| | +------------------+  +------------------------+                  | |
| |                                                                   | |
| | +--[ Funnel Overview ]------------------------------------------+ | |
| | |                                                                | | |
| | |  +-----------------------------------------------------+      | | |
| | |  |                    Form Views                        |      | | |
| | |  |                      2,450                           |      | | |
| | |  +-----------------------------------------------------+      | | |
| | |           |                                    |               | | |
| | |           v  87% started                       v 13% bounced   | | |
| | |  +-------------------------------------------+                 | | |
| | |  |              Step 1: Company Size          |                | | |
| | |  |                   2,132                    |                | | |
| | |  +-------------------------------------------+                 | | |
| | |           |                                    |               | | |
| | |           v  74% continued                     v 26% dropped   | | |
| | |  +-------------------------------------+                      | | |
| | |  |        Step 2: Use Case             |                      | | |
| | |  |             1,578                   |                      | | |
| | |  +-------------------------------------+                      | | |
| | |           |                                    |               | | |
| | |           v  68% continued                     v 32% dropped   | | |
| | |  +-------------------------------+                             | | |
| | |  |    Step 3: Budget Range       |                             | | |
| | |  |          1,073                |                             | | |
| | |  +-------------------------------+                             | | |
| | |           |                                    |               | | |
| | |           v  82% routed                        v 18% abandoned | | |
| | |  +-------------------------+                                   | | |
| | |  |   Successfully Routed  |                                   | | |
| | |  |         880            |                                   | | |
| | |  +-------------------------+                                   | | |
| | |                                                                | | |
| | |  Overall Conversion: 35.9%                                    | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Routing Destinations ]-------------------------------------+ | |
| | |                                                                | | |
| | |  Enterprise Sales    ||||||||||||||||||||||||||  45%  (396)    | | |
| | |  SMB Sales           |||||||||||||||||           30%  (264)    | | |
| | |  Self-Serve Demo     ||||||||||                  15%  (132)    | | |
| | |  Partner Team        |||||                        7%   (62)    | | |
| | |  Unmatched           ||                           3%   (26)    | | |
| | |                                                                | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Response Distribution ]------------------------------------+ | |
| | |                                                                | | |
| | | Step 1: Company Size                                           | | |
| | | +------------------------------------------------------------+ | | |
| | | | Response       | Count | % of Step | Routed To             | | | |
| | | |------------------------------------------------------------|  | |
| | | | Enterprise     |   845 |    40%    | Enterprise Sales      | | | |
| | | | Mid-Market     |   640 |    30%    | SMB Sales             | | | |
| | | | Startup        |   412 |    19%    | Self-Serve Demo       | | | |
| | | | Other          |   235 |    11%    | Partner Team          | | | |
| | | +------------------------------------------------------------+ | | |
| | |                                                                | | |
| | | [Step 1 v]  View responses for each step                      | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Drop-off Analysis ]---------------------------------------+ | |
| | |                                                                | | |
| | |  Avg Time to Complete: 2m 15s                                  | | |
| | |  Avg Time at Drop-off: 45s                                    | | |
| | |                                                                | | |
| | |  Top Drop-off Reasons (from exit surveys):                    | | |
| | |  1. "Too many questions" .............. 34%                    | | |
| | |  2. "Not relevant to my needs" ....... 28%                    | | |
| | |  3. "Page load issues" ............... 15%                     | | |
| | |  4. "Changed my mind" ................ 23%                     | | |
| | +----------------------------------------------------------------+ | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Date Range Picker | DateRangePicker | Same as main insights |
| Routing Form Selector | Select | Lists all active routing forms |
| Funnel Visualization | FunnelChart | Shows step-by-step conversion |
| Routing Destinations | HorizontalBarChart | Where forms route to |
| Response Distribution | DataTable | Per-step response breakdown |
| Drop-off Analysis | StatCard group | Time metrics and reasons |

## States
- **Loading**: Skeleton for funnel and charts
- **Empty**: "No routing data for selected period"
- **No Forms**: "Create a routing form to see analytics" with CTA
- **Single Step Form**: Simplified funnel with just start/end
