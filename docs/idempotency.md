---
id: idempotency
title: Idempotency
sidebar_label: Idempotency
slug: /idempotency
---

# Idempotency

Idempotency helps your application retry a request without unintentionally creating duplicate operations.

This is especially important when creating shipments. A network timeout does not necessarily mean that the server failed to process the request.

Use an `Idempotency-Key` header for shipment creation requests wherever the API requires it.

## Why idempotency matters

Consider this sequence:

1. Your application sends a shipment creation request.
2. The server processes the request.
3. The response is lost because of a network interruption.
4. Your application retries the request.

Without idempotency protection, the retry could create a duplicate shipment or cause an unintended additional charge.

With idempotency, repeated submissions of the same logical operation can be recognised by the server and handled consistently, subject to the API's implementation.

## The header

Include an idempotency key in the request header:

```http
Idempotency-Key: YOUR_UNIQUE_REQUEST_KEY
```

A UUID is a practical choice for generating unique keys.

Example in JavaScript:

```typescript
const idempotencyKey = crypto.randomUUID();
```

Generate the key once for a logical operation and preserve it while retrying that operation.

## Key rules

Follow these rules when integrating with the API:

- **Generate a unique key for each new logical operation.** Do not use one key for unrelated shipment requests.
- **Reuse the same key when retrying the same operation.** Do not generate a new key just because the previous response timed out.
- **Keep the request body consistent.** Do not reuse a key for a different shipment payload.
- **Store the key for as long as you may need to retry.** This is especially important for background jobs and queued requests.
- **Follow the API's documented length and format limits.** Confirm the limits against the deployed implementation.

## Expected outcomes

### Same key and same request

When the API recognises a repeated request with the same idempotency key and the same payload, it can return the result associated with the original operation instead of creating a duplicate.

The precise replay behaviour depends on the API implementation.

### Same key and different request body

A key must not be reused for a different payload.

An API may reject this situation with a `409 Conflict` response and an error code such as `idempotency_conflict`.

Example error shape:

```json
{
  "error": {
    "code": "idempotency_conflict",
    "message": "Idempotency-Key was used with a different request body."
  }
}
```

Treat the example as illustrative and handle the actual error response returned by the API.

## Example: create a shipment safely

The following TypeScript example generates one key and reuses it across retries of the same request.

```typescript
type ShipmentInput = Record<string, unknown>;

async function createShipmentWithRetry(
  apiKey: string,
  input: ShipmentInput,
): Promise<unknown> {
  const idempotencyKey = crypto.randomUUID();
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(
        "https://api.sprintafrica.com.ng/v1/shipments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(input),
        },
      );

      const responseBody = await response.text();

      if (response.status === 409) {
        throw new Error(
          `Conflict response received: ${responseBody}`,
        );
      }

      if (response.ok) {
        return responseBody ? JSON.parse(responseBody) : null;
      }

      // Do not blindly retry ordinary client errors.
      if (response.status < 500) {
        throw new Error(
          `Request failed with HTTP ${response.status}: ${responseBody}`,
        );
      }

      // A server error may be retried with the same key.
      if (attempt === maxAttempts - 1) {
        throw new Error(
          `Server error after ${maxAttempts} attempts: ${responseBody}`,
        );
      }
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }

      // Wait briefly before retrying the same logical operation.
      await new Promise((resolve) =>
        setTimeout(resolve, 500 * 2 ** attempt),
      );
    }
  }

  throw new Error("Shipment creation did not complete.");
}
```

**Implementation note:** This is a teaching example. In a production client, distinguish network failures from application errors, parse the API's error envelope, and ensure that retries do not generate a new idempotency key. The exact retry policy should follow the API's documented behaviour.

## When to generate a new key

Generate a new key when the user or application initiates a genuinely new shipment operation.

For example:

- A user submits a different shipment.
- The application creates a separate shipment for another recipient.
- A corrected request is intentionally submitted as a new operation after the original operation's outcome has been resolved.

Do not generate a new key merely because a request timed out. First determine whether the original operation may already have succeeded.

## What if the header is missing?

If the API requires an idempotency key and the request does not include one, the server may reject the request with a validation error.

Example error shape:

```json
{
  "error": {
    "type": "invalid_request_error",
    "code": "validation_error",
    "message": "Idempotency-Key header is required.",
    "param": "Idempotency-Key"
  }
}
```

Check the actual response status and error body returned by your API.

## Operational recommendations

- Generate keys on the server for server-to-server shipment creation.
- Persist the key with the corresponding operation when background retries are possible.
- Log the key alongside your internal order reference.
- Do not log API secrets.
- Investigate conflict errors instead of repeatedly resubmitting the same payload with different keys.
- Confirm which create endpoints require idempotency keys before releasing your integration.

## What's next?

- [Quote Lifecycle](/docs/quote-lifecycle)
- [Send a Single Shipment](/docs/guides/send-a-single-shipment)
- [Send a Bulk Batch](/docs/guides/send-a-bulk-batch)
- [Errors](/docs/guides/errors)