---
title: Handle API Errors
description: Diagnose and recover from Sprint Connect API errors.
---

# Handle API Errors

Your integration should handle unsuccessful responses explicitly. An HTTP error does not always mean the same thing: it may indicate invalid input, missing authentication, a resource that cannot be found, or a temporary service problem.

## Inspect every response

For each API request:

1. Read the HTTP status code.
2. Parse the response body when it contains valid JSON.
3. Capture any error code, message, or request identifier returned by the API.
4. Log enough information to troubleshoot the issue without exposing API keys or sensitive customer information.
5. Decide whether to correct the request, refresh credentials, or retry.

The exact response fields vary by endpoint. Refer to the endpoint's documented responses in the [API Reference](/docs/api/sprint-connect-api).

## Common HTTP status codes

| Status | Typical meaning | Recommended action |
|---|---|---|
| `400` | The request is invalid or contains unsupported values. | Check the request schema and correct the payload. |
| `401` | Authentication is missing or invalid. | Verify the API key and the environment. |
| `403` | The request is not permitted for the current credentials or resource. | Check the credentials' permissions and the requested operation. |
| `404` | The requested resource or route was not found. | Verify the endpoint and identifier. |
| `409` | The request conflicts with the current resource state, if used by that endpoint. | Inspect the error details before retrying. |
| `422` | The request failed validation, if returned by that endpoint. | Correct the fields identified in the response. |
| `429` | The request was rate-limited, if rate limiting is enabled for the endpoint. | Follow any documented retry guidance. |
| `500` | The server encountered an internal error. | Capture the request details and retry only when safe. |
| `502`, `503`, `504` | A gateway or service may be temporarily unavailable. | Retry with a delay when the operation is safe to repeat. |

This table is general guidance, not a guarantee that every endpoint returns every listed status. The generated API Reference is authoritative for the documented status codes.

## Handle authentication errors

Confirm that:

- The API key is present in the required authentication header.
- The key belongs to the intended environment.
- The key has not been revoked or replaced.
- You are calling the correct API base URL.

Never include API secrets in browser code, public repositories, support screenshots, or application logs.

## Handle timeouts and network failures

A timeout means your application did not receive a response within the configured period. It does **not** prove that the server failed to process the request.

For shipment creation:

1. Check whether the API documents an idempotency mechanism or request lookup flow.
2. If available, use that mechanism according to its documented rules.
3. Check whether the original shipment was created before resubmitting.
4. Save the outcome and any returned tracking reference.

Do not blindly retry a shipment creation request.

## Retry safely

Use bounded retries with increasing delays for transient failures. Avoid retrying invalid requests or authentication failures without first correcting the cause.

For rate limits, follow the response headers and retry instructions if the API provides them.

## Escalate a persistent failure

When contacting Sprint support, provide the endpoint, approximate request time, HTTP status, and any request or correlation identifier returned by the API. Redact credentials and sensitive personal information.

