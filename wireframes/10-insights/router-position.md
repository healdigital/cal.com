# Router Position Metrics

## Overview
Metrics showing how team members are positioned in routing queues and their routing performance.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
| [< Sidebar]                                                           |
|                                                                       |
| +-------------------------------------------------------------------+ |
| | Insights  >  Router Position                                      | |
| |                                                                   | |
| | +------------------+  +------------------------+                  | |
| | | Date Range       |  | Routing Form           |                  | |
| | | [Mar 1 - Mar 12 v]  | [All Forms          v] |                  | |
| | +------------------+  +------------------------+                  | |
| |                                                                   | |
| | +--[ Routing Summary ]------------------------------------------+ | |
| | |                                                                | | |
| | | +---------------+ +---------------+ +---------------+         | | |
| | | | Total Routed  | | Avg Wait Time | | Acceptance    |         | | |
| | | |               | | (to accept)   | | Rate          |         | | |
| | | |     880       | |    1m 42s     | |    91.3%      |         | | |
| | | |  +8% vs prev  | |  -12s vs prev | |  +2.1% prev   |        | | |
| | | +---------------+ +---------------+ +---------------+         | | |
| | |                                                                | | |
| | | +---------------+ +---------------+                           | | |
| | | | Reassigned    | | Avg Handoffs  |                           | | |
| | | |               | | per Booking   |                           | | |
| | | |     76        | |     1.2       |                           | | |
| | | |  -15% prev    | |  -0.1 prev    |                           | | |
| | | +---------------+ +---------------+                           | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Member Routing Position ]----------------------------------+ | |
| | |                                                                | | |
| | | +------------------------------------------------------------+| | |
| | | | Member       | Queue   | Routed | Accepted | Avg Wait     || | |
| | | |              | Position| Count  | Rate     | to Accept    || | |
| | | |------------------------------------------------------------|| | |
| | | | [Av] Jane D. |   #1    |  198   |  95.4%   |  0m 58s      || | |
| | | | [Av] John S. |   #2    |  176   |  92.1%   |  1m 22s      || | |
| | | | [Av] Sarah K.|   #3    |  165   |  94.8%   |  1m 05s      || | |
| | | | [Av] Mike R. |   #4    |  142   |  87.3%   |  2m 15s      || | |
| | | | [Av] Lisa T. |   #5    |  134   |  90.2%   |  1m 48s      || | |
| | | | [Av] David W.|   #6    |   65   |  89.1%   |  2m 33s      || | |
| | | +------------------------------------------------------------+| | |
| | |                                                                | | |
| | | Sort by: [Queue Position v]                                    | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Routing Distribution Over Time ]---------------------------+ | |
| | |                                                                | | |
| | |  40|  J  J  S                                                  | | |
| | |    |  a  o  a                                                  | | |
| | |  30|  n  h  r   J  J  S                                       | | |
| | |    |  e  n  a   a  o  a   J  J  S                              | | |
| | |  20|           n  h  r   a  o  a                               | | |
| | |    |           e  n  a   n  h  r                               | | |
| | |  10|                    e  n  a                                 | | |
| | |    |                                                           | | |
| | |   0+----+--------+--------+--------+                          | | |
| | |      Week 1    Week 2    Week 3    Week 4                     | | |
| | |                                                                | | |
| | |  [Grouped Bar]  Each bar = member routing count per week       | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Round Robin Fairness ]-------------------------------------+ | |
| | |                                                                | | |
| | |  Distribution Equity Score: 87/100                             | | |
| | |  (How evenly bookings are distributed across members)          | | |
| | |                                                                | | |
| | |  Jane D.    |==================|  22.5%   (target: 20%)       | | |
| | |  John S.    |=================|   20.0%   (target: 20%)       | | |
| | |  Sarah K.   |================|    18.8%   (target: 20%)       | | |
| | |  Mike R.    |===============|     16.1%   (target: 20%)        | | |
| | |  Lisa T.    |===============|     15.2%   (target: 20%)        | | |
| | |  David W.   |=======|             7.4%   (target:  0%)*       | | |
| | |                                                                | | |
| | |  * David W. joined mid-period                                  | | |
| | |                                                                | | |
| | |  [!] Mike R. and Lisa T. are below target allocation           | | |
| | +----------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Reassignment Reasons ]-------------------------------------+ | |
| | |                                                                | | |
| | |  Host unavailable  ||||||||||||||||||||||||   52%  (40)        | | |
| | |  No response       ||||||||||||||            28%  (21)        | | |
| | |  Declined          |||||||                   12%  (9)          | | |
| | |  Conflict          ||||                       8%  (6)          | | |
| | +----------------------------------------------------------------+ | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Date Range Picker | DateRangePicker | Consistent with other insights pages |
| Routing Form Filter | Select | Filter by specific routing form |
| Summary Cards | StatCard | Total routed, avg wait, acceptance rate |
| Member Position Table | DataTable | Sortable by any column |
| Distribution Chart | GroupedBarChart | Weekly routing per member |
| Fairness Gauge | ProgressBar group | Actual vs target allocation |
| Equity Score | Badge/Indicator | 0-100 score for distribution evenness |
| Reassignment Chart | HorizontalBarChart | Reasons for reassignment |

## States
- **Loading**: Skeleton placeholders for all sections
- **Empty**: "No routing data available for selected period"
- **No Routing Forms**: "Set up a routing form to track position metrics"
- **Single Member**: Fairness section hidden, simplified view
- **Imbalanced**: Warning banner when equity score < 70
