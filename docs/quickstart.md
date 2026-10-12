---
id: quickstart
title: Quick Start
sidebar_label: Quick Start
slug: /quickstart
---

# Quick Start

Get started with Sprint Connect by obtaining an API key, requesting a shipping quote, creating a shipment, and retrieving shipment events.

This guide uses `curl` to demonstrate HTTP requests. You can use the same endpoints from your backend application in Python, PHP, JavaScript, or another supported language.

## Before you begin

You will need:

- A Sprint Africa merchant account.
- Access to your sandbox API credentials.
- A terminal with `curl` installed.
- A backend environment where you can store your API key securely.

**Important:** Start with a sandbox key. Do not use a live key while following development examples.

## 1. Get a sandbox key

According to the planned Sprint Connect onboarding flow:

1. Open the [Sprint Africa merchant portal](https://sprintafrica.com.ng/merchant/signup).
2. Register or sign in to your merchant account.
3. Complete any required account verification.
4. Open the **API Keys** section.
5. Locate the sandbox credentials and follow the portal's instructions to issue or rotate a test key.
6. Copy the key and store it securely.

Sandbox keys use the `sk_test_` prefix in the documented key format.

The complete key may only be displayed when it is issued or rotated, depending on the portal's implementation. Store it securely before leaving that screen.

## 2. Configure your API key

Set your sandbox API key as an environment variable so you do not have to place the secret directly in your application code.

### macOS or Linux

```bash
export SPRINT_KEY="sk_test_YOUR_KEY_HERE"
```

### Windows PowerShell

```powershell
$env:SPRINT_KEY = "sk_test_YOUR_KEY_HERE"
```

Replace `sk_test_YOUR_KEY_HERE` with your actual sandbox key.

These commands set the variable for the current terminal session. Do not commit credentials to Git or include them in screenshots, public logs, or source files.

## 3. Request a rate quote

Before creating a shipment, request a quote for the route and package details.

The documented endpoint is:

`POST /v1/rates`

### Request

```bash
curl -X POST "https://api.sprintafrica.com.ng/v1/rates" \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0
  }'
```

If you are using Windows PowerShell, use this equivalent command:

```powershell
$body = @{
    origin_state = "Lagos"
    destination_state = "Rivers"
    weight_kg = 2.0
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "https://api.sprintafrica.com.ng/v1/rates" `
    -Headers @{
        Authorization = "Bearer $env:SPRINT_KEY"
    } `
    -ContentType "application/json" `
    -Body $body
```

### Example response

The following is an illustrative response. Actual field names, values, and response structure must match the deployed API.

```json
{
  "quote_id": "qt_example_quote_id",
  "origin_state": "Lagos",
  "destination_state": "Rivers",
  "weight_kg": 2.0,
  "is_fragile": false,
  "total_fee": "17720.00",
  "currency": "NGN",
  "eta_days": 3,
  "issued_at": 1765432199,
  "expires_at": 1765432499
}
```

Important fields:

- `quote_id`: The quote identifier to use when creating the shipment.
- `total_fee`: The quoted shipping fee.
- `currency`: The currency used for the quoted amount.
- `eta_days`: The estimated delivery duration, if returned by the API.
- `expires_at`: The quote expiration time, if returned by the API.

Use the actual `quote_id` returned by your request. Do not copy the illustrative identifier into a real shipment request.

## 4. Create the shipment

After receiving a valid quote, submit a shipment creation request.

The documented endpoint is:

`POST /v1/shipments`

A shipment request may require pickup details, delivery details, package information, and the quote identifier.

### Request

```bash
curl -X POST "https://api.sprintafrica.com.ng/v1/shipments" \
  -H "Authorization: Bearer $SPRINT_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: REPLACE_WITH_A_UNIQUE_KEY" \
  -d '{
    "quote_id": "REPLACE_WITH_YOUR_QUOTE_ID",
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0,
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "pickup_city": "Ikoyi",
    "pickup_contact_name": "Test Warehouse",
    "pickup_contact_phone": "08031234567",
    "dropoff_address": "5 Aba Road, Port Harcourt",
    "dropoff_city": "Port Harcourt",
    "dropoff_contact_name": "Test Recipient",
    "dropoff_contact_phone": "08087654321"
  }'
```

Replace `REPLACE_WITH_YOUR_QUOTE_ID` with the quote returned in step 3. Replace the example addresses and contact details with valid test data.

Generate a unique idempotency key for each new logical shipment operation. If you retry the same operation because of a network failure, reuse the original key according to the API's idempotency rules.

Confirm the required fields against the deployed shipment serializer or API schema before using this example in production.

### Example response

```json
{
  "tracking_id": "SP-EXAMPLE123",
  "status": "pending",
  "total_fee": "17720.00"
}
```

This is an illustrative response, not a guaranteed live result. Use the actual tracking identifier and status returned by your request.

## 5. Retrieve shipment events

Once a shipment has been created, use the tracking identifier or shipment identifier supported by the API to retrieve its progress.

The planned event endpoint is:

`GET /v1/shipments/{id}/events`

Example:

```bash
curl "https://api.sprintafrica.com.ng/v1/shipments/REPLACE_WITH_SHIPMENT_ID/events" \
  -H "Authorization: Bearer $SPRINT_KEY"
```

Replace `REPLACE_WITH_SHIPMENT_ID` with the identifier expected by the deployed endpoint. Verify whether this route accepts an internal shipment ID or a tracking ID before integrating it.

If the response includes event identifiers and cursors:

- Use the event identifier to avoid processing the same event twice.
- Store the latest cursor if the API supports resuming event retrieval.
- Handle empty event lists and temporary request failures.
- Follow the documented polling interval and pagination rules.

## 6. Handle errors

Do not assume every request succeeds. Check the HTTP status code and parse the response body before processing a result.

Common cases include:

| HTTP status | Meaning | Recommended action |
|---|---|---|
| `400` | The request is invalid | Check the payload and required fields |
| `401` | Authentication failed | Check the API key and Authorization header |
| `403` | Access is not permitted | Check account permissions and endpoint access |
| `404` | The requested resource was not found | Check the URL and resource identifier |
| `409` | A request conflicts with existing state, if used by the API | Inspect the error code and current resource state |
| `429` | Too many requests, if returned by the API | Apply the documented rate-limit and retry rules |
| `5xx` | Server-side failure | Retry only when safe under the endpoint's idempotency rules |

These are general HTTP troubleshooting guidelines. Confirm the exact status codes and error codes supported by Sprint Connect in its actual API reference.

See [Errors](/docs/guides/errors) for the planned error-handling guide.

## What's next?

- [Authentication](/docs/authentication) — learn how API keys work.
- [Environments](/docs/environments) — understand test and live credentials.
- [Idempotency](/docs/idempotency) — prevent duplicate operations when retrying requests.
- [Send a single shipment](/docs/guides/send-a-single-shipment) — follow the shipment creation flow in more detail.
- [Track a shipment](/docs/guides/track-a-shipment) — integrate shipment status updates.
