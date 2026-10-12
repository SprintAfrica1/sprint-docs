---
title: Send a Bulk Shipment Batch
description: Create and manage multiple shipments through Sprint Connect.
---

# Send a Bulk Shipment Batch

Use Sprint Connect's bulk shipment endpoints when you need to submit multiple packages in one request instead of creating each shipment separately.

Bulk shipment creation is useful for merchants fulfilling several customer orders at once, including marketplace orders and scheduled dispatches.

## Before you begin

You need:

- An active Sprint Connect API key.
- The correct API environment and base URL.
- Package information for each shipment.
- Valid pickup and delivery information required by the selected endpoint.

See [Authentication](/docs/authentication) for API key usage and [Environments](/docs/environments) for test and live environments.

## 1. Request a bulk rate

Use the appropriate bulk rate endpoint for your delivery type:

- Local bulk rates for deliveries within the supported local service area.
- Interstate bulk rates for deliveries between supported states or service areas.

Consult the generated [API Reference](/docs/api/sprint-connect-api) for the exact request schema and required fields.

A successful rate response provides the available pricing information for the submitted packages. Validate the response before creating shipments.

## 2. Create the bulk shipments

Submit the packages to the matching bulk shipment creation endpoint.

Make sure each package has the required fields and that the request uses the correct delivery type. Do not assume local and interstate requests use identical schemas.

Example request shape (illustrative only; use the API Reference for the exact field names):

```json
{
  "packages": [
    {
      "reference": "ORDER-1001"
    },
    {
      "reference": "ORDER-1002"
    }
  ]
}
```

The example illustrates the concept only. Do not send it as-is unless its fields match the published schema.

## 3. Process the response

For every response, your application should:

1. Check the HTTP status code.
2. Confirm whether the batch request succeeded.
3. Save the shipment identifiers and tracking references returned by the API.
4. Associate each shipment with your internal order reference.
5. Record failures and make them visible to the operator.

Do not assume that every package succeeded unless the response confirms that outcome.

## 4. Handle retries safely

If a request times out, you may not know whether the server processed it. Check the endpoint's documented retry and idempotency behavior before resubmitting.

Avoid blindly creating the same batch again, as this could produce duplicate shipments if the original request was accepted.

## Recommended implementation

- Validate every package before sending the request.
- Keep an internal record linking merchant orders to Sprint shipment references.
- Log request identifiers and response status codes.
- Handle API errors without discarding successful results from previous operations.
- Test bulk requests in the test environment before switching to live credentials.

For the exact payload fields and response structures, see the local and interstate bulk endpoints in the [API Reference](/docs/api/sprint-connect-api).

