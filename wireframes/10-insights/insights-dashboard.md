# Insights Dashboard

## Overview
Main analytics dashboard showing booking KPIs, trends, and member performance.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
| [< Sidebar]                                                           |
|                                                                       |
| +-------------------------------------------------------------------+ |
| | Insights                                                          | |
| |                                                                   | |
| | +------------------+  +------------------+  +-----------+         | |
| | | Date Range       |  | Event Type       |  | Member    |         | |
| | | [Mar 1 - Mar 12 v]  | [All Types    v] |  | [All   v] |        | |
| | +------------------+  +------------------+  +-----------+         | |
| |                                                                   | |
| | +--[ KPI Cards ]-----------------------------------------------+ | |
| | |                                                               | | |
| | | +---------------+ +---------------+ +---------------+        | | |
| | | | Total         | | Cancellation  | | Avg Duration  |        | | |
| | | | Bookings      | | Rate          | |               |        | | |
| | | |               | |               | |               |        | | |
| | | |    1,247      | |     8.3%      | |    32 min     |        | | |
| | | |  +12% vs prev | |  -2% vs prev  | |  +5 min prev  |        | | |
| | | +---------------+ +---------------+ +---------------+        | | |
| | |                                                               | | |
| | | +---------------+ +---------------+                          | | |
| | | | No-Show Rate  | | Completed     |                          | | |
| | | |               | | Bookings      |                          | | |
| | | |     3.1%      | |    1,098      |                          | | |
| | | |  -0.5% prev   | |  +15% prev    |                          | | |
| | | +---------------+ +---------------+                          | | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Bookings Over Time ]--------------------------------------+ | |
| | |                                                               | | |
| | |  300|                                                         | | |
| | |     |        *                                                | | |
| | |  250|       * *              *                                | | |
| | |     |      *   *           * *                                | | |
| | |  200|     *     *    *    *   *    *                          | | |
| | |     |    *       *  * *  *     *  * *                         | | |
| | |  150|   *         **   **       **   *                        | | |
| | |     |  *                              *                       | | |
| | |  100| *                                *                      | | |
| | |     +--+----+----+----+----+----+----+----+---                | | |
| | |       Mar1  Mar3  Mar5  Mar7  Mar9  Mar11                    | | |
| | |                                                               | | |
| | |  [Daily v]   --- Bookings   --- Cancellations                | | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Popular Event Types ]-------------------------------------+ | |
| | |                                                               | | |
| | |  30-min Meeting     ||||||||||||||||||||||||||||  42%  (524)  | | |
| | |  15-min Discovery   |||||||||||||||||            28%  (349)  | | |
| | |  60-min Consult     ||||||||||||                 18%  (225)  | | |
| | |  Team Standup       |||||||                       8%   (99)  | | |
| | |  Other              ||||                          4%   (50)  | | |
| | |                                                               | | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Member Performance ]--------------------------------------+ | |
| | |                                                               | | |
| | | +-----------------------------------------------------------+ | | |
| | | | Member        | Bookings | Avg Rating | Completion | Hrs  | | | |
| | | |-----------------------------------------------------------| | | |
| | | | [Av] Jane D.  |    312   |   4.8/5    |    94%     | 156h | | | |
| | | | [Av] John S.  |    287   |   4.6/5    |    91%     | 143h | | | |
| | | | [Av] Sarah K. |    245   |   4.9/5    |    96%     | 122h | | | |
| | | | [Av] Mike R.  |    198   |   4.5/5    |    89%     | 99h  | | | |
| | | | [Av] Lisa T.  |    205   |   4.7/5    |    92%     | 102h | | | |
| | | +-----------------------------------------------------------+ | | |
| | |                                                               | | |
| | | Showing 1-5 of 12 members     [< Prev]  [1] [2] [3] [Next >]| | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +----------+                                                      | |
| | | [Export CSV]                                                     | |
| | +----------+                                                      | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Date Range Picker | DateRangePicker | Presets: Today, 7d, 30d, 90d, Custom |
| Event Type Filter | Select | Multi-select, "All Types" default |
| Member Filter | Select | Multi-select, "All" default |
| KPI Cards | StatCard | Shows value + delta vs previous period |
| Bookings Chart | LineChart | Toggle Daily/Weekly/Monthly |
| Event Types Chart | HorizontalBarChart | Sorted by count descending |
| Member Table | DataTable | Sortable columns, paginated |
| Export Button | Button | CSV download of filtered data |

## States
- **Loading**: Skeleton placeholders for KPIs and charts
- **Empty**: "No booking data for selected period" with illustration
- **Error**: Toast notification with retry option
- **Filtered**: Active filter chips shown below filter bar
