# Organization Profile

**Route:** `/org/[orgSlug]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Public organization profile page showing the organization name, description, its teams, and individual members. Acts as a directory for finding the right team or person to book with within an organization.

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|                    +------------------+                          |
|                    |   Org Logo       |                          |
|                    |   (96x96)        |                          |
|                    +------------------+                          |
|                                                                  |
|                       Acme Corp                                  |
|                                                                  |
|            Building the future of scheduling                     |
|            for enterprises worldwide.                            |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|  Teams                                                           |
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
|                                                                  |
|  +---------------------------+  +---------------------------+    |
|  |                           |  |                           |    |
|  |  +------+                 |  |  +------+                 |    |
|  |  | Logo |  Engineering    |  |  | Logo |  Sales          |    |
|  |  +------+                 |  |  +------+                 |    |
|  |                           |  |                           |    |
|  |  Technical architecture   |  |  Product demos and        |    |
|  |  and code reviews.        |  |  onboarding calls.        |    |
|  |                           |  |                           |    |
|  |  +--+ +--+ +--+  3 types |  |  +--+ +--+      2 types   |    |
|  |  |J | |A | |S |          |  |  |M | |K |                |    |
|  |  +--+ +--+ +--+          |  |  +--+ +--+                |    |
|  |                           |  |                           |    |
|  +---------------------------+  +---------------------------+    |
|                                                                  |
|  +---------------------------+  +---------------------------+    |
|  |                           |  |                           |    |
|  |  +------+                 |  |  +------+                 |    |
|  |  | Logo |  Design         |  |  | Logo |  Support        |    |
|  |  +------+                 |  |  +------+                 |    |
|  |                           |  |                           |    |
|  |  UX reviews and design    |  |  Customer support and     |    |
|  |  consultations.           |  |  troubleshooting.         |    |
|  |                           |  |                           |    |
|  |  +--+ +--+      2 types  |  |  +--+ +--+ +--+  4 types  |    |
|  |  |L | |R |               |  |  |T | |N | |P |           |    |
|  |  +--+ +--+               |  |  +--+ +--+ +--+           |    |
|  |                           |  |                           |    |
|  +---------------------------+  +---------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
|                                                                  |
|  Members                                                         |
|  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
|                                                                  |
|  +-------------+  +-------------+  +-------------+              |
|  |   +------+  |  |   +------+  |  |   +------+  |              |
|  |   | Ava  |  |  |   | Ava  |  |  |   | Ava  |  |              |
|  |   +------+  |  |   +------+  |  |   +------+  |              |
|  |  Jane Smith |  |  Alex Chen  |  |  Sam Wilson |              |
|  |  Engineer   |  |  Designer   |  |  Sales Lead |              |
|  +-------------+  +-------------+  +-------------+              |
|                                                                  |
|  +-------------+  +-------------+  +-------------+              |
|  |   +------+  |  |   +------+  |  |   +------+  |              |
|  |   | Ava  |  |  |   | Ava  |  |  |   | Ava  |  |              |
|  |   +------+  |  |   +------+  |  |   +------+  |              |
|  |  Mike Brown |  |  Kate Lee   |  |  Tom Park   |              |
|  |  Support    |  |  Engineer   |  |  Support    |              |
|  +-------------+  +-------------+  +-------------+              |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Components
- `OrgLogo` - Organization logo/avatar (96px)
- `OrgName` - Organization display name (h1)
- `OrgDescription` - Organization bio text
- `TeamsSection` - Grid of team cards
  - `TeamCard` - Clickable card for each team
    - `TeamLogo` - Small team logo
    - `TeamName` - Team name
    - `TeamDescription` - Short description (truncated)
    - `MemberAvatarGroup` - Mini avatar row of team members
    - `EventTypeCount` - "N types" badge
- `MembersSection` - Grid of individual member cards
  - `MemberCard` - Clickable card for each member
    - `MemberAvatar` - Profile image
    - `MemberName` - Display name
    - `MemberRole` - Role/title text

## User Actions
- Click a team card to view the team's profile and event types
- Click a member card to view the member's profile and event types
- Scroll through teams and members

## Navigation
- Click team card -> `/team/[slug]` (team profile)
- Click member card -> `/[user]` (user profile)
- Footer links -> Privacy policy, Terms of service

## States
- **Loading:** Skeleton grid for teams and members
- **Error (404):** "This organization doesn't exist" message
- **Empty Teams:** "No teams" message, members section still visible
- **Empty Members:** "No public members" message
- **Success:** Full organization profile with teams and members
