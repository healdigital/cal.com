# User Profile

**Route:** `/[user]`
**Type:** Public
**Parent Layout:** Public Booking Layout

## Description
Public-facing user profile page displaying the user's avatar, name, bio, and a list of their available event types. This is the entry point for bookers who navigate to a specific user's scheduling page.

## Wireframe

```
+------------------------------------------------------------------+
|                        Cal.com branding                          |
+------------------------------------------------------------------+
|                                                                  |
|                                                                  |
|                         +--------+                               |
|                         |  Avatar |                              |
|                         | (80x80) |                              |
|                         +--------+                               |
|                                                                  |
|                       Jane Smith                                 |
|                    Senior Engineer                               |
|                                                                  |
|            Available for mentoring, interviews,                  |
|              and technical consultations.                         |
|                                                                  |
|  +------------------------------------------------------------+ |
|  |                                                            | |
|  |  Quick Chat                                      15 min    | |
|  |  A short introductory call to discuss your needs.          | |
|  |                                                            | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  |                                                            | |
|  |  Technical Consultation                          30 min    | |
|  |  Deep-dive into your technical challenges.                 | |
|  |                                                            | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  |                                                            | |
|  |  Mentoring Session                               60 min    | |
|  |  One-on-one career and technical mentoring.                | |
|  |                                                            | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  +------------------------------------------------------------+ |
|  |                                                            | |
|  |  Interview Practice                              45 min    | |
|  |  Mock interview with feedback session.                     | |
|  |                                                            | |
|  +------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
|              Powered by Cal.com   |   Privacy   |   Terms        |
+------------------------------------------------------------------+
```

## Components
- `Avatar` - User profile image (circular, 80px)
- `UserName` - Display name heading (h1)
- `UserBio` - Short biography/description text
- `EventTypeCard` - Clickable card for each event type
  - Event title (bold)
  - Duration badge (right-aligned)
  - Description text (truncated)
- `PoweredByBanner` - Cal.com branding footer

## User Actions
- Click on an event type card to navigate to the booking page for that event
- Scroll through available event types

## Navigation
- Click event type card -> `/[user]/[type]` (booking page)
- Footer links -> Privacy policy, Terms of service

## States
- **Loading:** Skeleton placeholders for avatar, name, and event type cards
- **Error (404):** "This user doesn't exist" message with link to Cal.com homepage
- **Empty:** "No event types available" message when user has no public event types
- **Success:** Full profile with event type list displayed
