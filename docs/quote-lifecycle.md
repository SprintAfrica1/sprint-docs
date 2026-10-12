---
id: quote-lifecycle
title: Quote Lifecycle
sidebar_label: Quote Lifecycle
slug: /quote-lifecycle
---

# Quote Lifecycle

A shipment begins with a rate quote. The quote represents the calculated price for the shipment details you submit and is used when creating the shipment.

In the documented flow, a quote is valid for five minutes. Request a fresh quote if the current one expires.

## Why quotes exist

The quote step allows your application to obtain a price before committing to shipment creation.

A quote can bind the pricing calculation to details such as:

- Origin and destination.
- Shipment weight.
- Whether the package is fragile.
- Declared value, where applicable.
- The environment in which the quote was requested.

The shipment creation request must use the corresponding quote and preserve the relevant pricing inputs.

## Quote states

### Fresh

The quote has been issued, has not been successfully used, and has not expired. It can be submitted with the corresponding shipment creation request.

### Consumed

The quote has been successfully used to create a shipment. Do not assume that it can be reused for another shipment.

### Expired

The quote has passed its expiry time. Request a new quote before attempting to create the shipment.

## The two-step workflow

### Step 1: Request a rate quote

The following example requests an interstate quote.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Kano",
    "weight_kg": 3.0,
    "declared_value": 20000
  }'
```

The response should contain the quote identifier and the calculated pricing information. Use the actual `quote_id` returned by the API in the next step.

Example response shape:

```json
{
  "quote_id": "qt_EXAMPLE",
  "total_fee": "17720.00",
  "currency": "NGN",
  "eta_days": 3,
  "issued_at": 1765432199,
  "expires_at": 1765432499
}
```

The values above are illustrative. Use the response returned by your API rather than copying this example.

### Step 2: Create the shipment

Submit the quote identifier along with the shipment details.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/shipments \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: YOUR_UNIQUE_REQUEST_KEY" \
  -d '{
    "quote_id": "qt_EXAMPLE",
    "origin_state": "Lagos",
    "destination_state": "Kano",
    "weight_kg": 3.0,
    "declared_value": 20000,
    "pickup_address": "Pickup address",
    "pickup_city": "Lagos",
    "pickup_contact_name": "Sender Name",
    "pickup_contact_phone": "08031234567",
    "dropoff_address": "Delivery address",
    "dropoff_city": "Kano",
    "dropoff_contact_name": "Recipient Name",
    "dropoff_contact_phone": "08087654321"
  }'
```

Replace the example quote identifier and contact details with actual values. The request fields shown here are examples; confirm the required fields against the API implementation.

## Keep quote and shipment details consistent

Do not change pricing-related details between the quote request and shipment creation.

For example, if the quote was calculated for a particular origin, destination, weight, fragile flag, or declared value, preserve those values when creating the shipment.

A mismatch may cause the API to reject the quote.

## Common failures

### `quote_expired`

The quote has expired.

**What to do:** Request a fresh quote and submit the new quote identifier with the shipment creation request.

### `invalid_quote`

The quote cannot be accepted for the submitted shipment request. Possible causes include:

- The submitted shipment details do not match the quote.
- The quote belongs to a different merchant or environment.
- The quote has already been used.
- The quote identifier is invalid.

**What to do:** Check the quote identifier, environment, and pricing-related fields. Do not retry the same invalid request without correcting the cause.

## Recommended integration pattern

Your application should:

1. Collect the shipment details.
2. Request a quote using the pricing-related details.
3. Keep the quote identifier and the corresponding input details together.
4. Create the shipment promptly, before the quote expires.
5. If the quote has expired, request a fresh quote.
6. Use an idempotency key when creating the shipment.
7. Handle API errors explicitly.

## Retry guidance

If the API reports that a quote has expired, obtain a new quote before attempting shipment creation again.

If the API reports an invalid quote, investigate the mismatch instead of repeatedly submitting the same request.

If shipment creation times out and you do not know whether the request succeeded, follow the idempotency guidance before retrying. Do not create a new logical shipment simply because the first response was not received.

## What's next?

- [Quick Start](/docs/quickstart)
- [Environments](/docs/environments)
- [Idempotency](/docs/idempotency)
- [Send a Single Shipment](/docs/guides/send-a-single-shipment)