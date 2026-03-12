# Payment Page

## Overview
Payment page for paid bookings, showing booking summary and Stripe-powered card input.

## Wireframe

```
+------------------------------------------------------------------+
|  [Cal.com Logo]                                                   |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|     +-------------------------------+  +------------------------+  |
|     |                               |  |                        |  |
|     |  BOOKING SUMMARY              |  |  PAYMENT               |  |
|     |                               |  |                        |  |
|     |  +---------------------------+|  |  Amount Due            |  |
|     |  |  +----+                   ||  |  +--------------------+|  |
|     |  |  |    |  John Smith       ||  |  |                    ||  |
|     |  |  | AV |  @johnsmith       ||  |  |     $50.00         ||  |
|     |  |  |    |                   ||  |  |                    ||  |
|     |  |  +----+                   ||  |  +--------------------+|  |
|     |  +---------------------------+|  |                        |  |
|     |                               |  |  Card Details          |  |
|     |  30 Minute Consultation        |  |                        |  |
|     |                               |  |  +--------------------+|  |
|     |  +---------------------------+|  |  | Card number        ||  |
|     |  | [cal] Wednesday, Mar 12   ||  |  | 1234 5678 ____ ____||  |
|     |  |       2:00 PM - 2:30 PM   ||  |  +--------------------+|  |
|     |  |       Eastern Time (US)   ||  |                        |  |
|     |  +---------------------------+|  |  +----------+ +------+ |  |
|     |                               |  |  | MM / YY  | | CVC  | |  |
|     |  +---------------------------+|  |  | 12 / 27  | | 123  | |  |
|     |  | [clock] 30 minutes        ||  |  +----------+ +------+ |  |
|     |  +---------------------------+|  |                        |  |
|     |                               |  |  Name on Card          |  |
|     |  +---------------------------+|  |  +--------------------+|  |
|     |  | [video] Zoom Meeting      ||  |  | Jane Doe           ||  |
|     |  +---------------------------+|  |  +--------------------+|  |
|     |                               |  |                        |  |
|     |  +---------------------------+|  |  Country               |  |
|     |  | [dollar] $50.00           ||  |  +--------------------+|  |
|     |  +---------------------------+|  |  | United States   [v]||  |
|     |                               |  |  +--------------------+|  |
|     |  Attendee                      |  |                        |  |
|     |  Jane Doe                      |  |  ZIP Code              |  |
|     |  jane@example.com              |  |  +--------------------+|  |
|     |                               |  |  | 10001              ||  |
|     |  +---------------------------+|  |  +--------------------+|  |
|     |  | Notes:                    ||  |                        |  |
|     |  | Discuss Q1 marketing plan ||  |  +--------------------+|  |
|     |  +---------------------------+|  |  |                    ||  |
|     |                               |  |  |  [Pay $50.00]      ||  |
|     |                               |  |  |                    ||  |
|     |                               |  |  +--------------------+|  |
|     |                               |  |                        |  |
|     |                               |  |  [lock] Secured by     |  |
|     |                               |  |         Stripe         |  |
|     |                               |  |                        |  |
|     |                               |  |  By clicking Pay, you  |  |
|     |                               |  |  agree to the Terms    |  |
|     |                               |  |  of Service.           |  |
|     |                               |  |                        |  |
|     +-------------------------------+  +------------------------+  |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+

Processing state:
+------------------------+
|                        |
|  +--------------------+|
|  |                    ||
|  |  Processing...     ||
|  |  [spinner]         ||
|  |                    ||
|  +--------------------+|
|                        |
+------------------------+

Success state:
+------------------------------------------------------------------+
|                                                                    |
|                        +--------+                                  |
|                        |        |                                  |
|                        |  [ok]  |                                  |
|                        |        |                                  |
|                        +--------+                                  |
|                                                                    |
|                  Payment Successful!                               |
|                                                                    |
|              Your booking has been confirmed.                      |
|              A confirmation email has been sent                    |
|              to jane@example.com.                                  |
|                                                                    |
|              +------------------------------------+                |
|              | Booking: 30 Minute Consultation     |                |
|              | Date: Mar 12, 2025 at 2:00 PM      |                |
|              | Amount: $50.00                      |                |
|              | Receipt: #REC-20250312-001          |                |
|              +------------------------------------+                |
|                                                                    |
|              [View Booking]   [Download Receipt]                   |
|                                                                    |
+------------------------------------------------------------------+

Error state:
+------------------------+
|                        |
|  [!] Payment failed    |
|                        |
|  Your card was         |
|  declined. Please try  |
|  a different card.     |
|                        |
|  [Try Again]           |
|                        |
+------------------------+
```

## Layout

- **Left column**: Booking summary and details
- **Right column**: Payment form (Stripe Elements)

## Booking Summary

- Host avatar and name
- Event type name
- Date, time, and timezone
- Duration
- Meeting type (Zoom, Google Meet, etc.)
- Price
- Attendee info
- Notes (if any)

## Payment Form (Stripe Elements)

| Field        | Type   | Required | Notes                      |
|--------------|--------|----------|----------------------------|
| Card number  | Stripe | Yes      | Stripe Element component   |
| Expiry       | Stripe | Yes      | MM/YY format               |
| CVC          | Stripe | Yes      | 3-4 digits                 |
| Name on card | Text   | Yes      | Cardholder name            |
| Country      | Select | Yes      | Billing country            |
| ZIP Code     | Text   | Yes      | Billing postal code        |

## States
- **Default**: Form ready for input
- **Validating**: Stripe inline validation
- **Processing**: Spinner overlay on pay button
- **Success**: Confirmation page with booking details and receipt
- **Error**: Error message with retry option
- **Card declined**: Specific message about declined card
