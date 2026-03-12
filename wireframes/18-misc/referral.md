# Referral Program

## Overview
Referral page with unique sharing link, social share buttons, and referral statistics.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]   [Nav: Event Types | Bookings | ...]  [User v]  |
+------------------------------------------------------------------+
|                                                                    |
|  Referral Program                                                  |
|  Invite friends to Cal.com and earn rewards.                       |
|                                                                    |
|  +----------------------------------------------------------------+|
|  |                                                                ||
|  |  +------------------------------------------------------------+||
|  |  |                                                            |||
|  |  |          [gift icon]                                       |||
|  |  |                                                            |||
|  |  |     Give $10, Get $10                                      |||
|  |  |                                                            |||
|  |  |     Share your unique link with friends.                   |||
|  |  |     When they sign up for a paid plan,                     |||
|  |  |     you both get $10 credit.                               |||
|  |  |                                                            |||
|  |  +------------------------------------------------------------+||
|  |                                                                ||
|  +----------------------------------------------------------------+|
|                                                                    |
|  +----------------------------------------------------------------+|
|  |  YOUR REFERRAL LINK                                            ||
|  +----------------------------------------------------------------+|
|  |                                                                ||
|  |  +--------------------------------------------------+         ||
|  |  | https://cal.com/ref/jane-doe-abc123    [Copy]    |         ||
|  |  +--------------------------------------------------+         ||
|  |                                                                ||
|  |  Share via:                                                    ||
|  |                                                                ||
|  |  +----------+  +----------+  +----------+  +----------+       ||
|  |  | [twitter]|  | [linked] |  | [email]  |  | [whats]  |       ||
|  |  | Twitter  |  | LinkedIn |  | Email    |  | WhatsApp |       ||
|  |  +----------+  +----------+  +----------+  +----------+       ||
|  |                                                                ||
|  +----------------------------------------------------------------+|
|                                                                    |
|  +----------------------------------------------------------------+|
|  |  REFERRAL STATS                                                ||
|  +----------------------------------------------------------------+|
|  |                                                                ||
|  |  +-------------+  +-------------+  +-------------+            ||
|  |  | LINK CLICKS |  | SIGN UPS    |  | EARNED      |            ||
|  |  |             |  |             |  |             |            ||
|  |  |     47      |  |     12      |  |   $50.00    |            ||
|  |  |             |  |             |  |             |            ||
|  |  | All time    |  | All time    |  | All time    |            ||
|  |  +-------------+  +-------------+  +-------------+            ||
|  |                                                                ||
|  +----------------------------------------------------------------+|
|                                                                    |
|  +----------------------------------------------------------------+|
|  |  REFERRAL HISTORY                                              ||
|  +----------------------------------------------------------------+|
|  |                                                                ||
|  |  +------------------------------------------------------------+||
|  |  | [AV] Alice Chen                                            |||
|  |  |      alice@example.com                                     |||
|  |  |      Signed up: Mar 8, 2025                                |||
|  |  |      Status: Subscribed       Reward: +$10.00              |||
|  |  +------------------------------------------------------------+||
|  |                                                                ||
|  |  +------------------------------------------------------------+||
|  |  | [AV] Bob Martinez                                          |||
|  |  |      bob@company.com                                       |||
|  |  |      Signed up: Feb 22, 2025                               |||
|  |  |      Status: Subscribed       Reward: +$10.00              |||
|  |  +------------------------------------------------------------+||
|  |                                                                ||
|  |  +------------------------------------------------------------+||
|  |  | [AV] Carol Wu                                              |||
|  |  |      carol@startup.io                                      |||
|  |  |      Signed up: Feb 15, 2025                               |||
|  |  |      Status: Free plan        Reward: Pending              |||
|  |  +------------------------------------------------------------+||
|  |                                                                ||
|  |  +------------------------------------------------------------+||
|  |  | [AV] Dave Johnson                                          |||
|  |  |      dave@org.net                                          |||
|  |  |      Signed up: Jan 30, 2025                               |||
|  |  |      Status: Subscribed       Reward: +$10.00              |||
|  |  +------------------------------------------------------------+||
|  |                                                                ||
|  |  [View all referrals]                                          ||
|  |                                                                ||
|  +----------------------------------------------------------------+|
|                                                                    |
|  +----------------------------------------------------------------+|
|  |  HOW IT WORKS                                                  ||
|  +----------------------------------------------------------------+|
|  |                                                                ||
|  |  [1]              [2]              [3]                         ||
|  |  Share            Friend           You Both                    ||
|  |  your link        signs up         get $10                     ||
|  |                                                                ||
|  |  Send your      They create an    Once they                    ||
|  |  unique link    account using     subscribe to                 ||
|  |  to friends.    your referral     a paid plan,                 ||
|  |                 link.             you both earn.               ||
|  |                                                                ||
|  +----------------------------------------------------------------+|
|                                                                    |
+------------------------------------------------------------------+
```

## Components

### Hero Banner
- Gift icon
- Program title and value proposition
- Brief explanation of the reward structure

### Referral Link Section
- Unique referral URL with copy button
- Social share buttons: Twitter, LinkedIn, Email, WhatsApp
- Each opens pre-filled share content

### Stats Cards
- **Link Clicks**: Total clicks on referral link
- **Sign Ups**: Users who registered via link
- **Earned**: Total rewards earned

### Referral History
- List of referred users
- Each entry: avatar, name, email, signup date, status, reward
- Status: Subscribed (reward earned) / Free plan (pending)

### How It Works
- Three-step visual explanation
- Share, Sign up, Earn rewards

## Share Content Templates
- **Twitter**: "Try @calcom for scheduling! Sign up with my link and we both get $10: [link]"
- **Email**: Subject and body pre-filled with referral details
- **LinkedIn**: Post with referral link
- **WhatsApp**: Message with referral link

## States
- **No referrals**: Stats show 0, history shows "No referrals yet" with encouragement
- **Pending rewards**: Yellow badge for referrals on free plans
- **Earned rewards**: Green badge with amount
- **Link copied**: Toast "Link copied to clipboard!"
