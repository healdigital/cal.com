# Team Features

## Route: `/settings/teams/:teamId/features`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Features                            |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Enable or disable features for your team.  |
|   Appearance|  Some features may require a plan upgrade.  |
|             |                                            |
| > Security  |  ========================================  |
|   Password  |                                            |
|   Two-Factor|  Scheduling                                 |
|   SSO       |  ----------------------------------------  |
|   Compliance|                                            |
|   Imperson. |  Round-Robin Scheduling                     |
|             |  Automatically distribute bookings among    |
| > Developer |  team members.                              |
|   API Keys  |  +-------+                                 |
|   OAuth     |  |  ON   |                                 |
|   Webhooks  |  +-------+                                 |
|             |                                            |
| > Team      |  Collective Scheduling                      |
|   Settings  |  Find times when all required team          |
|   Profile   |  members are available.                     |
|   Appearance|  +-------+                                 |
|   Members   |  |  ON   |                                 |
|  [Features] |  +-------+                                 |
|   Roles     |                                            |
|   Billing   |  Managed Event Types                        |
|             |  Lock event type settings so members        |
|             |  cannot modify them.                        |
|             |  +-------+                                 |
|             |  |  OFF  |                                 |
|             |  +-------+                                 |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Communication                              |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Workflows                                  |
|             |  Automated emails and SMS around booking    |
|             |  events.                                    |
|             |  +-------+                                 |
|             |  |  ON   |                                 |
|             |  +-------+                                 |
|             |                                            |
|             |  Team Webhooks                               |
|             |  Send booking data to external services     |
|             |  for the entire team.                       |
|             |  +-------+                                 |
|             |  |  ON   |                                 |
|             |  +-------+                                 |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Booking Experience                          |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Requires Confirmation                      |
|             |  All team bookings require manual            |
|             |  confirmation before being accepted.        |
|             |  +-------+                                 |
|             |  |  OFF  |                                 |
|             |  +-------+                                 |
|             |                                            |
|             |  Minimum Booking Notice                      |
|             |  Set a minimum lead time for team bookings. |
|             |  +--------------------------------------+  |
|             |  | 2 hours                           [v] |  |
|             |  +--------------------------------------+  |
|             |  Options: None / 1 hour / 2 hours /        |
|             |           4 hours / 24 hours / 48 hours    |
|             |                                            |
|             |  Recurring Bookings                         |
|             |  Allow guests to book recurring meetings.   |
|             |  +-------+                                 |
|             |  |  ON   |                                 |
|             |  +-------+                                 |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Advanced                                    |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Cal.ai (AI Assistant)           [PRO]      |
|             |  AI-powered scheduling assistant for your   |
|             |  team.                                      |
|             |  +-------+                                 |
|             |  |  OFF  |  [Upgrade to enable]            |
|             |  +-------+                                 |
|             |                                            |
|             |  Routing Forms                   [PRO]      |
|             |  Qualify and route leads to the right       |
|             |  team member.                               |
|             |  +-------+                                 |
|             |  |  OFF  |  [Upgrade to enable]            |
|             |  +-------+                                 |
|             |                                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Features    |                      |
|             |  +------------------+                      |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Feature Toggles | `<Switch>` | On/Off for each feature |
| Feature Description | `<Text>` | Brief explanation below each toggle |
| Plan Badge | `<Badge>` | [PRO] for plan-gated features |
| Upgrade Link | `<Link>` | Navigates to billing/upgrade |
| Booking Notice | `<Select>` | Dropdown for time options |
| Save Features | `<Button>` | Primary |
| Section Headers | `<Heading>` | Group features by category |

## States

- **Default**: Current feature states loaded
- **Toggling**: Instant visual feedback on toggle
- **Plan-Gated**: Disabled toggle with upgrade prompt
- **Saving**: Button spinner
- **Success**: Toast notification on save
