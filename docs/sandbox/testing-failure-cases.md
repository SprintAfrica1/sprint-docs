---
id: testing-failure-cases
title: Testing Failure Cases
sidebar_label: Testing failure cases
slug: /sandbox/testing-failure-cases
---

# Testing Failure Cases

Every integration needs to handle errors. This page shows how to trigger the
most common failure cases in the sandbox, so you can verify your error
handling before going live.

The sandbox rejects exactly the same requests as production. Nothing is
softened, and no error path is hidden.

## Before you begin

You should have a working sandbox key and at least one successful request
behind you. If not, start with
[Get a Sandbox Key](/docs/sandbox/get-a-sandbox-key).

Every example below uses `sk_test_YOUR_KEY_HERE` as a placeholder. Replace
it with your own sandbox key.

## Invalid API key

Send a request with a malformed key. The API returns 401 and a body that
identifies the problem.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_this_is_not_a_real_key" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Rivers",
    "weight_kg": 2.0
  }'
```

Response:

```json
{
  "error": {
    "type": "authentication_error",
    "code": "invalid_api_key",
    "message": "Authorization header does not contain a valid API key.",
    "request_id": "req_...",
    "doc_url": "https://docs.sprintafrica.com.ng/errors/invalid_api_key"
  }
}
```

What to verify in your client: the 401 path triggers a distinct code path,
does not retry, and does not log the malformed key.

## Unknown state name

Send a quote request with a state the API does not recognize.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Laggos",
    "weight_kg": 2.0
  }'
```

Response:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "validation_error",
    "message": "'Laggos' is not a recognized Nigerian state.",
    "param": "destination_state",
    "request_id": "req_..."
  }
}
```

The `param` field identifies the input that failed. Surface it in your own
error UI so the fix is obvious.

## Same origin and destination

Interstate parcels cannot have the same origin and destination state.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Lagos",
    "weight_kg": 2.0
  }'
```

Response:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "validation_error",
    "message": "Origin and destination must be different for interstate parcels. Same state deliveries use local pricing.",
    "param": "destination_state"
  }
}
```

For Lagos to Lagos deliveries, use `POST /v1/local/rates` instead.

## Quote expired

Request a quote, wait more than five minutes, then try to use it.

```bash
# Step 1: request a quote
curl -X POST https://api.sprintafrica.com.ng/v1/local/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "dropoff_address": "22 Broad Street, Lagos Island",
    "package_type": "small",
    "is_fragile": false
  }'

# Step 2: wait longer than five minutes
sleep 320

# Step 3: try to create with the expired quote
curl -X POST https://api.sprintafrica.com.ng/v1/local/shipments \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-expired" \
  -d '{ "quote_id": "PASTE_EXPIRED_QUOTE_ID", ... }'
```

Response:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "quote_expired",
    "message": "Quote has expired. Request a new quote."
  }
}
```

What to verify: your client requests a fresh quote and retries once, then
gives up.

## Quote does not match the request

Request a quote for 2.0 kg, then try to create a 5.0 kg shipment with the
same quote.

Response:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_quote",
    "message": "quote_id does not match the shipment parameters."
  }
}
```

This is not a transient failure. Do not retry. It means a field on the
create request differs from the field on the quote request. Fix the
mismatch.

## Insufficient balance

Send a shipment that costs more than the merchant balance.

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_state": "Lagos",
    "destination_state": "Kano",
    "weight_kg": 500,
    "is_fragile": true,
    "declared_value": 10000000
  }'
```

Then create with the resulting quote. Response:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "insufficient_balance",
    "message": "Merchant balance is insufficient to cover this shipment."
  }
}
```

The shipment is not created, and the balance is not debited. Verify that
your client surfaces this to the merchant and does not retry.

## Idempotency conflict

Send two different requests with the same `Idempotency-Key`.

```bash
# First request
curl -X POST https://api.sprintafrica.com.ng/v1/local/shipments \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Idempotency-Key: fixed-key-for-test" \
  -H "Content-Type: application/json" \
  -d '{ ... body A ... }'

# Second request, same key, different body
curl -X POST https://api.sprintafrica.com.ng/v1/local/shipments \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Idempotency-Key: fixed-key-for-test" \
  -H "Content-Type: application/json" \
  -d '{ ... body B ... }'
```

Response on the second call:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "idempotency_conflict",
    "message": "Idempotency-Key was used with a different request body."
  }
}
```

What to verify: your client generates a fresh key for every distinct
create, so this never fires in normal operation.

## Service not enabled

If a merchant is not enabled for the parcel service, every endpoint
returns:

```json
{
  "error": {
    "type": "permission_error",
    "code": "service_not_enabled",
    "message": "This merchant is not enabled for the 'parcel' service.",
    "service": "parcel",
    "enabled": []
  }
}
```

This is a configuration issue, not a code issue. Contact Sprint Africa
support with the `request_id` from the response.

## Verify in your client

For each error above, check:

1. The HTTP status is handled distinctly, not swallowed by a generic error
   handler.
2. The `code` field drives your branching logic, not the `message` text.
3. The `request_id` is logged with every error so you can trace it later.
4. The client does not retry on 4xx errors, only on 5xx or network
   failures.
5. The client does not leak the API key or full request body into logs
   visible to end users.

## What to include in a support ticket

If an error needs investigation, include:

1. The `request_id` from the response.
2. The full request body with secrets redacted.
3. The full response body.
4. The timestamp with timezone.
5. The environment, whether the request used a test key or a live key.

With those five, support can trace the request through the logs.