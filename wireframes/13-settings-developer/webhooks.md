# Webhooks

## Route: `/settings/developer/webhooks`

## Wireframe

```
+----------------------------------------------------------+
| Cal.com                                    [?] [N] [AV]  |
+-------------+--------------------------------------------+
| Settings    |                                            |
|             |  Developer > Webhooks                       |
| > General   |  ========================================  |
|   Profile   |                                            |
|   Calendars |  Receive real-time notifications when       |
|   Appearance|  events happen in your Cal.com account.     |
|             |                                            |
| > Security  |          +---------------------+           |
|   Password  |          | + Add New Webhook   |           |
|   Two-Factor|          +---------------------+           |
|   SSO       |                                            |
|   Compliance|  +--------------------------------------+  |
|   Imperson. |  | URL           |Events|Status |Last   |A|  |
|             |  |---------------------------------------|  |
| > Developer |  | https://my    | 3    |[Activ]|Mar 10 |  |  |
|   API Keys  |  | app.com/hook  |      |  e    |14:32  |  |  |
|  [Webhooks] |  |               |      |       |       |  |  |
|   OAuth     |  |  Events: BOOKING_CREATED,     |       |  |  |
|             |  |  BOOKING_CANCELLED,            |       |  |  |
| > Team      |  |  BOOKING_RESCHEDULED           |       |  |  |
|   Settings  |  |                                      |  |
|   Profile   |  | [Edit]  [Test]  [Logs]  [Delete]     |  |
|   Members   |  |---------------------------------------|  |
|   Billing   |  | https://zap    | 5    |[Activ]|Mar 9  |  |
|             |  | ier.com/hooks  |      |  e    |09:15  |  |
|             |  | /catch/abc123  |      |       |       |  |
|             |  |                                      |  |
|             |  |  Events: BOOKING_CREATED,             |  |
|             |  |  MEETING_ENDED,                       |  |
|             |  |  FORM_SUBMITTED, ...                  |  |
|             |  |                                      |  |
|             |  | [Edit]  [Test]  [Logs]  [Delete]     |  |
|             |  |---------------------------------------|  |
|             |  | https://slack   | 1    |[Inact]|Never |  |
|             |  | .example.com   |      | ive   |      |  |
|             |  | /webhook       |      |       |      |  |
|             |  |                                      |  |
|             |  |  Events: BOOKING_CREATED              |  |
|             |  |                                      |  |
|             |  | [Edit]  [Test]  [Logs]  [Delete]     |  |
|             |  +--------------------------------------+  |
|             |                                            |
|             |  Showing 3 of 3 webhooks                   |
|             |                                            |
+-------------+--------------------------------------------+
```

## Wireframe - Webhook Delivery Logs

```
+----------------------------------------------------------+
|                                                          |
|   +--------------------------------------------------+   |
|   | Webhook Delivery Logs                      [ X ]  |   |
|   | https://myapp.com/hook                            |   |
|   +--------------------------------------------------+   |
|   |                                                  |   |
|   |  +----------------------------------------------+|   |
|   |  | Time        | Event           | Status | Resp ||   |
|   |  |----------------------------------------------|  |   |
|   |  | Mar 10      | BOOKING_CREATED | [200]  | 45ms||   |
|   |  | 14:32:01    |                 |  OK    |     ||   |
|   |  |----------------------------------------------|  |   |
|   |  | Mar 10      | BOOKING_        | [200]  |120ms||   |
|   |  | 14:30:15    | CANCELLED       |  OK    |     ||   |
|   |  |----------------------------------------------|  |   |
|   |  | Mar 9       | BOOKING_        | [500]  | 2s  ||   |
|   |  | 22:10:03    | RESCHEDULED     | ERROR  |     ||   |
|   |  |----------------------------------------------|  |   |
|   |  | Mar 9       | BOOKING_CREATED | [200]  | 50ms||   |
|   |  | 18:05:44    |                 |  OK    |     ||   |
|   |  +----------------------------------------------+|   |
|   |                                                  |   |
|   |  [< Prev]  Page 1 of 3  [Next >]                |   |
|   |                                                  |   |
|   +--------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

## Components

| Component | Type | Notes |
|-----------|------|-------|
| Add Webhook | `<Button>` | Navigates to new webhook form |
| Webhook Row | `<Card>` | URL, event count, status, last triggered |
| Status Badge | `<Badge>` | Green=Active, Gray=Inactive |
| Edit | `<Button>` | Opens edit form |
| Test | `<Button>` | Sends test payload |
| Logs | `<Button>` | Opens delivery log modal |
| Delete | `<Button>` | Destructive with confirmation |
| Delivery Log | `<Table>` | Paginated delivery history |

## States

- **Empty**: No webhooks, illustration + create prompt
- **List**: Webhook cards with summary info
- **Testing**: Spinner, then success/failure result
- **Logs**: Modal with delivery history table
- **Error**: Failed deliveries shown in red
