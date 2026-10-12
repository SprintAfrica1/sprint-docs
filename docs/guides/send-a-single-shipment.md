---
id: send-a-single-shipment
title: Send a Single Shipment
sidebar_label: Send a single shipment
slug: /guides/send-a-single-shipment
---

# Send a Single Shipment

This guide walks through the typical interstate shipment flow using Sprint Connect.

You will request a quote, create the shipment, retrieve its details, and read its tracking events.

## Before you begin

You should have:

- A Sprint Connect merchant account.
- A Test API key for development.
- Your API key stored securely in an environment variable.
- The sender's and recipient's contact details and addresses.
- Sufficient balance in the selected environment, where required.

For initial testing, use a Test key rather than a Live key.

## Shipment workflow

The general workflow is:

1. Request a rate quote.
2. Create the shipment using the returned quote identifier.
3. Retrieve the shipment details.
4. Read shipment events to track progress.

The examples below use the documented API routes. Confirm the request schemas and response fields against your deployed API.

## Step 1: Request a rate quote

First, request a quote using the shipment's pricing-related details.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0,
    "is_fragile": false,
    "declared_value": 12000
  }'
```

Replace the example values with the actual shipment details.

The response should contain a quote identifier and the calculated fee. Keep the returned `quote_id` for the next step.

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

The response values are illustrative, not a guaranteed price or delivery estimate.

**Important:** In this documented flow, the quote expires after five minutes. Continue to shipment creation promptly.

## Step 2: Create the shipment

Submit the quote identifier, matching pricing details, and the required pickup and dropoff information.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/shipments \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: YOUR_UNIQUE_REQUEST_KEY" \
  -d '{
    "quote_id": "qt_EXAMPLE",
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0,
    "is_fragile": false,
    "declared_value": 12000,
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "pickup_city": "Ikoyi",
    "pickup_contact_name": "Sender Name",
    "pickup_contact_phone": "08031234567",
    "dropoff_address": "5 Aba Road, Port Harcourt",
    "dropoff_city": "Port Harcourt",
    "dropoff_contact_name": "Recipient Name",
    "dropoff_contact_phone": "08087654321"
  }'
```

Replace `qt_EXAMPLE` with the actual `quote_id` returned in Step 1. Replace the example contact details with the real shipment information.

The `Idempotency-Key` should identify this particular shipment creation operation. Reuse the same key if you need to retry that same operation.

Example response shape:

```json
{
  "tracking_id": "SP-EXAMPLE123",
  "status": "pending",
  "total_fee": "17720.00",
  "currency": "NGN",
  "balance_after": "482280.00"
}
```

Save the returned `tracking_id`. You will use it to retrieve shipment details and events.

The response values above are illustrative.

## Step 3: Retrieve shipment details

Use the tracking identifier returned by the creation request to retrieve the shipment.

```bash
curl https://api.sprintafrica.com.ng/v1/shipments/SP-EXAMPLE123 \
  -H "Authorization: Bearer $SPRINT_KEY"
```

Example response shape:

```json
{
  "tracking_id": "SP-EXAMPLE123",
  "status": "in_transit",
  "status_display": "In Transit",
  "origin_state": "Lagos",
  "destination_state": "Rivers",
  "total_fee": "17720.00",
  "created_at": "2026-10-11T13:52:04+01:00",
  "updated_at": "2026-10-11T14:40:11+01:00"
}
```

Your actual response may contain additional fields or use a different set of status values.

### Understanding shipment status

A shipment may progress through several stages, depending on the workflow supported by the API.

| Example status | Meaning |
|---|---|
| `pending` | Shipment has been created and is awaiting the next operation. |
| `assigned` | A courier or delivery resource has been assigned. |
| `picked_up` | The package has been collected. |
| `in_transit` | The package is moving through the delivery network. |
| `delivered` | Delivery has been completed. |
| `cancelled` | The shipment has been cancelled. |
| `failed` | The shipment or delivery operation has failed. |

Treat these as illustrative status values and use the actual status definitions exposed by your API.

## Step 4: Read shipment events

Use the shipment's tracking identifier to retrieve its event history.

```bash
curl https://api.sprintafrica.com.ng/v1/shipments/SP-EXAMPLE123/events \
  -H "Authorization: Bearer $SPRINT_KEY"
```

Example response shape:

```json
{
  "tracking_id": "SP-EXAMPLE123",
  "events": [
    {
      "event_id": "evt_EXAMPLE123",
      "event_type": "shipment.picked_up",
      "tracking_id": "SP-EXAMPLE123",
      "merchant_reference": null,
      "status": "picked_up",
      "occurred_at": "2026-10-11T14:15:22+01:00",
      "cursor": "cur_EXAMPLE"
    }
  ],
  "count": 1
}
```

The values above are examples of the response structure.

### Event identifiers

Two fields are useful when processing events:

- **`event_id`** identifies an event. Keep track of processed IDs so that handling the same event more than once does not cause duplicate business operations.
- **`cursor`** can be used by a supported catch-up endpoint to resume event retrieval after a gap.

Check the API response for the exact event fields and cursor behaviour.

## Step 5: Handle retries and errors

Shipment creation should use an idempotency key so that retrying the same logical operation does not unintentionally create a duplicate shipment.

When a request fails:

- **Quote expired:** Request a fresh quote and use the new quote identifier.
- **Invalid quote:** Check that the quote belongs to the correct environment and that the pricing-related details match.
- **Insufficient balance:** Check the applicable merchant balance before retrying.
- **Authentication error:** Confirm that the API key is valid and has not been rotated.
- **Network timeout:** Do not assume that the shipment was not created. Retry the same logical operation using the same idempotency key, in accordance with the API's behaviour.

For the error response structure and additional cases, see [Errors](/docs/guides/errors).

## Implementation checklist

Before releasing your integration, confirm that your application:

- [ ] Requests a quote before creating the shipment.
- [ ] Uses the returned `quote_id` rather than a hardcoded identifier.
- [ ] Keeps pricing-related fields consistent between quote and create requests.
- [ ] Includes the required idempotency key.
- [ ] Stores the returned `tracking_id`.
- [ ] Handles non-success HTTP responses.
- [ ] Avoids duplicate processing of shipment events.
- [ ] Uses Test credentials during development.
- [ ] Keeps API keys on the server rather than exposing them in browser code.

## What's next?

- [Track a Shipment](/docs/guides/track-a-shipment)
- [Quote Lifecycle](/docs/quote-lifecycle)
- [Idempotency](/docs/idempotency)
- [Errors](/docs/guides/errors)
- [Send a Bulk Batch](/docs/guides/send-a-bulk-batch)
