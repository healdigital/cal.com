# Call History

## Overview
Table view of all completed calls with date, duration, participants, and recording access.

## Wireframe

```
+-----------------------------------------------------------------------+
| Cal.com                                    [?] [Bell] [Avatar v]      |
+-----------------------------------------------------------------------+
| [< Sidebar]                                                           |
|                                                                       |
| +-------------------------------------------------------------------+ |
| | Insights  >  Call History                                         | |
| |                                                                   | |
| | +------------------+  +-----------+  +-----------+  +----------+  | |
| | | Date Range       |  | Member    |  | Status    |  | Search   |  | |
| | | [Mar 1 - Mar 12 v]  | [All   v] |  | [All   v] |  | [____] |  | |
| | +------------------+  +-----------+  +-----------+  +----------+  | |
| |                                                                   | |
| | +--[ Summary Cards ]-------------------------------------------+ | |
| | |                                                               | | |
| | | +-------------+ +-------------+ +-------------+ +-----------+| | |
| | | | Total Calls | | Total Hrs   | | Avg Duration| | Recorded  || | |
| | | |    347      | |   186h      | |   32m 10s   | |   289     || | |
| | | +-------------+ +-------------+ +-------------+ +-----------+| | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Call History Table ]---------------------------------------+ | |
| | |                                                               | | |
| | | [x] Select All                          [Export CSV] [Filter] | | |
| | |                                                               | | |
| | | +-----------------------------------------------------------+ | | |
| | | |[x]| Date & Time    | Duration | Host     | Participant(s) | | | |
| | | |   |                |          |          |                 | | | |
| | | |   | Status         | Type     | Source   | Recording       | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 12, 2026   | 28m 15s  | Jane D.  | Alex Johnson   | | | |
| | | |   | 10:30 AM EST   |          |          | alex@co.com    | | | |
| | | |   | Completed      | 30-min   | Cal Link | [Play] [DL]    | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 12, 2026   | 45m 02s  | John S.  | Maria Garcia,  | | | |
| | | |   | 9:00 AM EST    |          |          | Tom Wilson     | | | |
| | | |   | Completed      | 60-min   | Routing  | [Play] [DL]    | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 11, 2026   | 14m 33s  | Jane D.  | Sam Lee        | | | |
| | | |   | 3:15 PM EST    |          |          | sam@startup.io | | | |
| | | |   | Completed      | 15-min   | Embed    | [Play] [DL]    | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 11, 2026   | --       | Sarah K. | Pat Brown      | | | |
| | | |   | 2:00 PM EST    |          |          | pat@corp.com   | | | |
| | | |   | No-Show        | 30-min   | Cal Link | --             | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 11, 2026   | 31m 48s  | Mike R.  | Chris Davis    | | | |
| | | |   | 11:00 AM EST   |          |          | chris@biz.com  | | | |
| | | |   | Completed      | 30-min   | API      | [Play] [DL]    | | | |
| | | |---+----------------+----------+----------+-----------------| | | |
| | | |[ ]| Mar 10, 2026   | 22m 07s  | Lisa T.  | Jordan Kim     | | | |
| | | |   | 4:30 PM EST    |          |          | j.kim@ent.co   | | | |
| | | |   | Completed      | 30-min   | Cal Link | [Play] [DL]    | | | |
| | | +-----------------------------------------------------------+ | | |
| | |                                                               | | |
| | | Showing 1-6 of 347 calls      [< Prev] [1] [2] ... [Next >] | | |
| | +---------------------------------------------------------------+ | |
| |                                                                   | |
| | +--[ Call Detail Drawer (when row clicked) ]---+                  | |
| | |                                              |                  | |
| | |  Call Details                        [X]     |                  | |
| | |  ----------------------------------------    |                  | |
| | |  Date:        Mar 12, 2026 10:30 AM EST      |                  | |
| | |  Duration:    28m 15s                         |                  | |
| | |  Host:        Jane Doe                        |                  | |
| | |  Participant: Alex Johnson (alex@co.com)      |                  | |
| | |  Event Type:  30-min Meeting                  |                  | |
| | |  Source:      Cal Link                        |                  | |
| | |  Status:      Completed                       |                  | |
| | |                                              |                  | |
| | |  Recording                                   |                  | |
| | |  +----------------------------------------+  |                  | |
| | |  | [>]  00:00 ----o------------- 28:15    |  |                  | |
| | |  +----------------------------------------+  |                  | |
| | |  [Download MP4]  [Copy Link]  [Transcript]   |                  | |
| | |                                              |                  | |
| | |  Notes                                       |                  | |
| | |  +----------------------------------------+  |                  | |
| | |  | Discussed pricing tier options.        |  |                  | |
| | |  | Follow-up scheduled for Mar 15.        |  |                  | |
| | |  +----------------------------------------+  |                  | |
| | +----------------------------------------------+                  | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Date Range Picker | DateRangePicker | Consistent with other insights pages |
| Member Filter | Select | Filter by host |
| Status Filter | Select | All, Completed, No-Show, Cancelled |
| Search | TextInput | Search by participant name/email |
| Summary Cards | StatCard | Total calls, hours, avg duration, recorded count |
| Call Table | DataTable | Sortable, selectable rows, paginated |
| Play Button | IconButton | Opens inline audio/video player |
| Download Button | IconButton | Downloads recording file |
| Detail Drawer | Drawer | Slides in from right on row click |
| Audio Player | MediaPlayer | Embedded player with seek bar |

## States
- **Loading**: Table skeleton with shimmer rows
- **Empty**: "No calls found for the selected filters"
- **No Recording**: Recording column shows "--" with tooltip "Recording not available"
- **No-Show**: Row styled with muted text, no recording available
- **Playing**: Inline player expands below the row or in drawer
