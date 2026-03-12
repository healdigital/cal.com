# Team Profile

**Route:** `/team/[slug]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Public team profile page displaying the team name, description, member avatars, and a list of team event types. Visitors can browse the team's available event types and click to book with the team (round-robin or collective scheduling).

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|                     +------------------+                         |
|                     |   Team Logo      |                         |
|                     |   (80x80)        |                         |
|                     +------------------+                         |
|                                                                  |
|                      Engineering Team                            |
|                                                                  |
|              We help startups with technical                     |
|              architecture and code reviews.                      |
|                                                                  |
|                    Team Members                                  |
|             +----+ +----+ +----+ +----+                          |
|             |Ava1| |Ava2| |Ava3| |+2  |                          |
|             +----+ +----+ +----+ +----+                          |
|             Jane   Alex   Sam                                    |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Team Standup                                    15 min    |  |
|  |  Quick sync with any available team member.                |  |
|  |  [Round Robin]                                             |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Architecture Review                            60 min    |  |
|  |  Full team review of your system architecture.             |  |
|  |  [Collective]                                              |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Code Review Session                            30 min    |  |
|  |  Pair review with a senior engineer.                       |  |
|  |  [Round Robin]                                             |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Components
- `TeamLogo` - Team avatar/logo image (circular or rounded, 80px)
- `TeamName` - Team display name heading (h1)
- `TeamDescription` - Team bio/description text
- `MemberAvatarGroup` - Overlapping row of member avatars
  - `MemberAvatar` - Individual circular avatar (32px)
  - `OverflowCount` - "+N" badge for additional members
  - `MemberName` - Name label below each visible avatar
- `EventTypeCard` - Clickable card for each team event type
  - Event title (bold)
  - Duration badge (right-aligned)
  - Description text (truncated)
  - Scheduling type badge (`Round Robin` or `Collective`)

## User Actions
- Click on an event type card to navigate to the team booking page
- Hover over member avatars to see full names (tooltip)
- Scroll through available team event types

## Navigation
- Click event type card -> `/team/[slug]/[type]` (team booking page)
- Click member avatar -> `/[user]` (individual user profile)
- Footer links -> Privacy policy, Terms of service

## States
- **Loading:** Skeleton for logo, team name, member avatars, and event cards
- **Error (404):** "This team doesn't exist" message
- **Empty:** "No event types available" when team has no public events
- **Success:** Full team profile with event type list
