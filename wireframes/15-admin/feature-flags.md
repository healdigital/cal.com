# Feature Flags

## Overview
Admin interface to manage feature flags with toggle controls and scope settings.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   Admin Panel          [? Help] [Admin User v]   |
+------------------------------------------------------------------+
|         |                                                         |
| ADMIN   |  Feature Flags                                         |
| MENU    |  Control feature rollout across the platform.           |
|         |                                                         |
|   Dash  |  +----------------------------------------------------+ |
|   Users |  | [Q Search flags...]   [Status v] [Scope v] [Type v]| |
| > Flags |  +----------------------------------------------------+ |
|   Apps  |                                                         |
|   Block |  +----------------------------------------------------+ |
|   OAuth |  | Flag Name        | Description     | Scope  | Stat | |
|   SMS   |  +----------------------------------------------------+ |
|   Imper |  |                  |                 |        |      | |
|         |  | calendar-cache   | Enable SQL-     | Global | [ON] | |
|         |  |                  | based calendar  |        |      | |
|         |  | OPERATIONAL      | caching layer   |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | new-booking-flow | Redesigned      | Global | [OFF]| |
|         |  |                  | booking         |        |      | |
|         |  | EXPERIMENT       | experience      |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | team-billing-v2  | Updated team    | Team   | [ON] | |
|         |  |                  | billing system  |        |      | |
|         |  | OPERATIONAL      |                 |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | ai-scheduling    | AI-powered      | User   | [OFF]| |
|         |  |                  | smart schedule  |        |      | |
|         |  | EXPERIMENT       | suggestions     |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | round-robin-v2   | Improved round  | Global | [ON] | |
|         |  |                  | robin algorithm |        |      | |
|         |  | OPERATIONAL      |                 |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | insights-beta    | Analytics and   | Team   | [OFF]| |
|         |  |                  | insights dash   |        |      | |
|         |  | EXPERIMENT       |                 |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | stripe-v3        | Stripe API v3   | Global | [OFF]| |
|         |  |                  | integration     |        |      | |
|         |  | OPERATIONAL      |                 |        |      | |
|         |  +----------------------------------------------------+ |
|         |  |                  |                 |        |      | |
|         |  | org-workflows    | Organization    | User   | [ON] | |
|         |  |                  | workflow engine  |        |      | |
|         |  | KILL_SWITCH      |                 |        |      | |
|         |  +----------------------------------------------------+ |
|         |                                                         |
|         |  Showing 1-8 of 24 flags                                |
|         |  [< Prev]  1  2  3  [Next >]                           |
|         |                                                         |
+------------------------------------------------------------------+

Toggle confirmation dialog (for enabling):
+---------------------------------------+
|  Enable "new-booking-flow"?           |
|                                       |
|  Scope: Global                        |
|  Type: EXPERIMENT                     |
|                                       |
|  This will enable the feature for     |
|  all users platform-wide.             |
|                                       |
|          [Cancel]  [Enable]           |
+---------------------------------------+

Scope detail dialog (for Team/User scope):
+---------------------------------------+
|  "ai-scheduling" - User Scope        |
|                                       |
|  Enabled for:                         |
|  +-------------------------------+    |
|  | [Q Search users...]           |    |
|  +-------------------------------+    |
|                                       |
|  [AV] john@co.com          [Remove]  |
|  [AV] jane@co.com          [Remove]  |
|  [AV] alice@co.com         [Remove]  |
|                                       |
|  [+ Add User]                         |
|                                       |
|              [Close]  [Save]          |
+---------------------------------------+
```

## Table Columns

| Column      | Description                                    |
|-------------|------------------------------------------------|
| Flag Name   | Slug identifier of the flag                    |
| Description | Human-readable explanation                     |
| Type        | OPERATIONAL / EXPERIMENT / KILL_SWITCH          |
| Scope       | Global / Team / User                           |
| Status      | Toggle switch (ON/OFF)                         |

## Flag Types

- **OPERATIONAL**: Infrastructure and system features
- **EXPERIMENT**: New features being tested
- **KILL_SWITCH**: Emergency disable switches

## Scope Levels

- **Global**: Applies to all users
- **Team**: Applies to specific teams (click to manage)
- **User**: Applies to specific users (click to manage)

## Filters

- **Search**: Filter by flag name or description
- **Status**: All / Enabled / Disabled
- **Scope**: All / Global / Team / User
- **Type**: All / Operational / Experiment / Kill Switch

## States
- **Empty**: "No feature flags configured"
- **Toggle confirmation**: Dialog before enabling/disabling
- **Scoped management**: Dialog to add/remove teams or users
