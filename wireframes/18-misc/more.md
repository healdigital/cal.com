# More Menu (Mobile)

## Overview
Mobile navigation menu providing links to various sections not shown in the bottom tab bar.

## Wireframe

```
+----------------------------------+
|  [Cal.com Logo]         [X Close]|
+----------------------------------+
|                                  |
|  More                            |
|                                  |
|  +------------------------------+|
|  |                              ||
|  |  SCHEDULING                  ||
|  |                              ||
|  |  +--+ Event Types        [>] ||
|  |  |ET|                        ||
|  |  +--+ Manage your event      ||
|  |       types and links        ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Availability       [>] ||
|  |  |AV|                        ||
|  |  +--+ Set your working       ||
|  |       hours                  ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Workflows          [>] ||
|  |  |WF|                        ||
|  |  +--+ Automate booking       ||
|  |       actions                ||
|  |                              ||
|  +------------------------------+|
|                                  |
|  +------------------------------+|
|  |                              ||
|  |  APPS & INTEGRATIONS         ||
|  |                              ||
|  |  +--+ App Store          [>] ||
|  |  |AP|                        ||
|  |  +--+ Browse and install     ||
|  |       apps                   ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Connected Apps     [>] ||
|  |  |CA|                        ||
|  |  +--+ Manage installed       ||
|  |       integrations           ||
|  |                              ||
|  +------------------------------+|
|                                  |
|  +------------------------------+|
|  |                              ||
|  |  TEAM                        ||
|  |                              ||
|  |  +--+ Teams              [>] ||
|  |  |TM|                        ||
|  |  +--+ Manage your teams      ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Organization       [>] ||
|  |  |OR|                        ||
|  |  +--+ Org settings and       ||
|  |       members                ||
|  |                              ||
|  +------------------------------+|
|                                  |
|  +------------------------------+|
|  |                              ||
|  |  ACCOUNT                     ||
|  |                              ||
|  |  +--+ Settings           [>] ||
|  |  |ST|                        ||
|  |  +--+ Profile, security,     ||
|  |       preferences            ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Billing            [>] ||
|  |  |BI|                        ||
|  |  +--+ Plans and invoices     ||
|  |  ----------------------------||
|  |                              ||
|  |  +--+ Referrals          [>] ||
|  |  |RF|                        ||
|  |  +--+ Invite friends,        ||
|  |       earn rewards           ||
|  |                              ||
|  +------------------------------+|
|                                  |
|  +------------------------------+|
|  |                              ||
|  |  +--+                        ||
|  |  |AV| Jane Doe               ||
|  |  +--+ jane@example.com       ||
|  |                              ||
|  |  [Sign Out]                   ||
|  |                              ||
|  +------------------------------+|
|                                  |
+----------------------------------+
|  [Home] [Book] [Cal] [Notif] [More]|
+----------------------------------+
```

## Sections

### Scheduling
- **Event Types**: Manage event types and booking links
- **Availability**: Set working hours and schedules
- **Workflows**: Automate actions on bookings

### Apps & Integrations
- **App Store**: Browse available integrations
- **Connected Apps**: Manage installed apps

### Team
- **Teams**: Manage team memberships
- **Organization**: Org-level settings (if applicable)

### Account
- **Settings**: Profile, security, preferences
- **Billing**: Plans, invoices, payment methods
- **Referrals**: Invite friends, track rewards

### User Info
- Avatar, name, email
- Sign Out button

## Menu Item Structure

Each item has:
- Icon (left)
- Title (bold)
- Description (muted, below title)
- Chevron arrow (right)

## Navigation

- Tapping an item navigates to that section
- Close button returns to previous page
- Bottom tab bar remains visible

## States
- **Default**: Full menu as shown
- **No team**: Team section hidden
- **No org**: Organization item hidden
- **Admin user**: Additional "Admin Panel" item in Account section
