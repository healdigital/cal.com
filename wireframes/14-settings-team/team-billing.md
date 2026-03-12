# Team Billing

## Route: `/settings/teams/:teamId/billing`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Team > Billing                             |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Current Plan                               |
|   Appearance|  ----------------------------------------  |
|             |                                            |
| > Security  |  +--------------------------------------+  |
|   Password  |  |                                      |  |
|   Two-Factor|  |  Team Pro Plan              $15/user  |  |
|   SSO       |  |                             /month    |  |
|   Compliance|  |                                      |  |
|   Imperson. |  |  5 members x $15 = $75/month          |  |
|             |  |                                      |  |
| > Developer |  |  Billing Cycle: Monthly                |  |
|   API Keys  |  |  Next Invoice: April 1, 2026          |  |
|   OAuth     |  |  Next Amount: $75.00                   |  |
|   Webhooks  |  |                                      |  |
|             |  |  +-------------------+                |  |
| > Team      |  |  | Change Plan       |                |  |
|   Settings  |  |  +-------------------+                |  |
|   Profile   |  |                                      |  |
|   Appearance|  +--------------------------------------+  |
|   Members   |                                            |
|   Roles     |  ========================================  |
|   Features  |                                            |
|  [Billing]  |  Usage This Period                         |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  Team Members          5 / 10        |  |
|             |  |  [========----------]  50%            |  |
|             |  |                                      |  |
|             |  |  Team Event Types      8 / Unlimited  |  |
|             |  |  [====--------------]  n/a            |  |
|             |  |                                      |  |
|             |  |  Workflows             3 / 5          |  |
|             |  |  [======------------]  60%            |  |
|             |  |                                      |  |
|             |  |  Bookings This Month   342 / Unlim.  |  |
|             |  |  [====--------------]  n/a            |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Payment Method                             |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  |                                      |  |
|             |  |  [VISA]  Visa ending in 4242          |  |
|             |  |          Expires 12/2027               |  |
|             |  |                                      |  |
|             |  |  [Update]  [Remove]                   |  |
|             |  |                                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  [+ Add Payment Method]                    |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Billing Information                        |
|             |  ----------------------------------------  |
|             |                                            |
|             |  Company Name                               |
|             |  +--------------------------------------+  |
|             |  | Acme Engineering Inc.                 |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Billing Email                               |
|             |  +--------------------------------------+  |
|             |  | billing@acme.com                      |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Address                                    |
|             |  +--------------------------------------+  |
|             |  | 123 Main St, Suite 100                |  |
|             |  | San Francisco, CA 94105               |  |
|             |  | United States                         |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Tax ID (optional)                          |
|             |  +--------------------------------------+  |
|             |  | US-12345678                           |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  +------------------+                      |
|             |  | Save Billing Info|                      |
|             |  +------------------+                      |
|             |                                            |
|             |  ========================================  |
|             |                                            |
|             |  Invoice History                            |
|             |  ----------------------------------------  |
|             |                                            |
|             |  +--------------------------------------+  |
|             |  | Date       | Amount  | Status |  DL  |  |
|             |  |---------------------------------------|  |
|             |  | Mar 1, 2026| $75.00  | [Paid] | [v]  |  |
|             |  |---------------------------------------|  |
|             |  | Feb 1, 2026| $75.00  | [Paid] | [v]  |  |
|             |  |---------------------------------------|  |
|             |  | Jan 1, 2026| $60.00  | [Paid] | [v]  |  |
|             |  |---------------------------------------|  |
|             |  | Dec 1, 2025| $60.00  | [Paid] | [v]  |  |
|             |  |---------------------------------------|  |
|             |  | Nov 1, 2025| $45.00  | [Paid] | [v]  |  |
|             |  |---------------------------------------|  |
|             |  | Oct 1, 2025| $45.00  | [Paid] | [v]  |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  [< Prev]  Page 1 of 2  [Next >]          |
|             |                                            |
+-------------+--------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Plan Card | `<Card>` | Current plan details and pricing |
| Change Plan | `<Button>` | Opens plan selection page |
| Usage Bars | `<ProgressBar>` | Visual usage indicators |
| Payment Card | `<Card>` | Card brand, last 4, expiry |
| Update Payment | `<Button>` | Opens payment update form |
| Add Payment | `<Button>` | Add new payment method |
| Billing Form | `<Form>` | Company, email, address, tax |
| Invoice Table | `<Table>` | Date, amount, status, download |
| Download | `<IconButton>` | Downloads PDF invoice |
| Pagination | `<Pagination>` | Navigate invoice pages |

## States

- **Default**: All billing info loaded
- **Plan Change**: Modal or page with plan comparison
- **Updating Payment**: Stripe Elements form
- **Past Due**: Red warning banner at top
- **Saving**: Button spinner on billing info save
- **Empty Invoices**: "No invoices yet" message
