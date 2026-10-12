---
title: Your First Rate Quote
description: Request a delivery quote using Sprint Connect.
---

# Your First Rate Quote

A rate quote lets your application retrieve shipping pricing before creating a shipment.

## 1. Prepare the request

Use the `POST /v1/rates` endpoint with valid sandbox credentials.

The request body must include the required delivery and package details defined in the published schema. Do not assume that example fields from another delivery type are interchangeable.

See [Create a Rate Quote](/docs/api/rates-create) for the authoritative request fields and response structure.

## 2. Submit the quote request

Send the request from your backend using the required authentication header.

Example using PowerShell is possible, but the exact request body depends on the API schema and the route you are quoting. Start with the generated API reference rather than sending an invented payload.

## 3. Handle the response

When the request succeeds:

1. Read the returned pricing information.
2. Display the quote to the customer as appropriate.
3. Retain any quote or rate reference required by the shipment-creation workflow.
4. Handle the response according to the documented schema.

A quote is not a booked shipment. Do not show an order as dispatched merely because the rate request succeeded.

## 4. Handle errors

If the request fails, inspect the HTTP status and response body. Correct invalid input or authentication before trying again.

For general guidance, see [Handle API Errors](/docs/guides/errors).

## Next step

After confirming the quote and collecting the required shipment information, continue to [Your First Shipment](/docs/sandbox/your-first-shipment).

