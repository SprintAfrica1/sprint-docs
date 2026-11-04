---
id: your-first-rate-quote
title: Your First Rate Quote
sidebar_label: Your first rate quote
slug: /sandbox/your-first-rate-quote
---

# Your First Rate Quote

A rate quote tells you what a delivery will cost and locks in that price
for five minutes. Every shipment starts with one.

## Before you begin

You need a sandbox key. If you do not have one, see
[Get a Sandbox Key](/docs/sandbox/get-a-sandbox-key).

Replace `sk_test_YOUR_KEY_HERE` in every example with your own key.

## Local quote

Use the local endpoint for deliveries inside Lagos.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/local/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "dropoff_address": "22 Broad Street, Lagos Island",
    "package_type": "small",
    "is_fragile": false
  }'
```

Response:

```json
{
  "quote_id": "qtl_eyJkcm9w...",
  "pickup_zone": "Z4",
  "dropoff_zone": "Z4",
  "vehicle_type": "bike",
  "pickup_address": "14 Awolowo Road, Ikoyi",
  "dropoff_address": "22 Broad Street, Lagos Island",
  "package_type": "small",
  "is_fragile": false,
  "total_fee": "3571.00",
  "currency": "NGN",
  "issued_at": 1791828562,
  "expires_at": 1791828862
}
```

## Interstate quote

Use the standard endpoint for parcels that travel between states.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0
  }'
```

Origin and destination must be different states. For same state deliveries
use the local endpoint.

## Read the response

| Field | Meaning |
|---|---|
| `quote_id` | Signed token. Pass it unchanged when you create the shipment. |
| `total_fee` | Delivery price as a string, in the currency shown. |
| `currency` | Always `NGN`. |
| `vehicle_type` | Vehicle the zone and package type resolve to. |
| `issued_at` | Unix timestamp when the quote was created. |
| `expires_at` | Unix timestamp when the quote stops being valid. |

The quote is valid for five minutes. After `expires_at` the API rejects it
with `quote_expired`. Request a new quote instead of trying to reuse it.

## Money values are strings

Amounts such as `3571.00` are returned as strings to avoid floating point
rounding. Parse them with a decimal type, not a float.

## Next step

Continue with [Your First Shipment](/docs/sandbox/your-first-shipment). For
the full lifecycle of a quote, see [Quote Lifecycle](/docs/quote-lifecycle).