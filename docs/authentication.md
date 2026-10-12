---
id: authentication
title: Authentication
sidebar_label: Authentication
slug: /authentication
---

# Authentication

Sprint Connect uses API keys to authenticate requests from your backend application.

For authenticated endpoints, send your API key in the HTTP `Authorization` header using the Bearer scheme.

```http
Authorization: Bearer YOUR_API_KEY
```

For example, a sandbox key may use the `sk_test_` prefix, while a live key may use the `sk_live_` prefix, according to the documented Sprint Connect key format.

**Keep API keys secret.** Never place a live key in frontend JavaScript, a publicly accessible mobile application, a Git repository, or a publicly shared configuration file.

## API key types

The planned integration distinguishes between two key types.

### Sandbox keys

Sandbox keys are intended for development and integration testing.

- **Prefix:** `sk_test_`
- **Purpose:** Test supported API workflows before going live.
- **Recommended use:** Local development, automated tests, and integration validation.

Use a sandbox key for the examples in this documentation unless a guide explicitly says otherwise.

### Live keys

Live keys are intended for authorized production integrations.

- **Prefix:** `sk_live_`
- **Purpose:** Make requests in the live environment.
- **Recommended use:** Production traffic after the integration has been tested and approved.

Live requests may create real shipments or trigger other production effects, depending on the endpoint. Only use live credentials when you understand the operation you are performing.

The actual key issuance, approval, and account requirements depend on the deployed merchant portal and Sprint Africa's account policies.

## Sending an authenticated request

Include the Authorization header with the API key.

### Example using curl

```bash
curl "https://api.sprintafrica.com.ng/v1/shipments" \
  -H "Authorization: Bearer $SPRINT_KEY"
```

This example demonstrates the header format. Verify that the endpoint supports `GET` requests and the intended behavior before using the command as an operational test.

### Example using Python

```python
import os
import requests

API_BASE_URL = "https://api.sprintafrica.com.ng"
API_KEY = os.environ.get("SPRINT_KEY")

if not API_KEY:
    raise RuntimeError("SPRINT_KEY environment variable is not configured")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json",
}

response = requests.get(
    f"{API_BASE_URL}/v1/shipments",
    headers=headers,
    timeout=30,
)

print("HTTP status:", response.status_code)
print(response.text)
```

Install the `requests` package in your Python environment if it is not already available.

This code is a request-format example. Confirm that the shipment-list endpoint exists and that your account is authorized to call it.

### Example using JavaScript on a backend

```javascript
const apiKey = process.env.SPRINT_KEY;

if (!apiKey) {
  throw new Error("SPRINT_KEY environment variable is not configured");
}

const response = await fetch(
  "https://api.sprintafrica.com.ng/v1/shipments",
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  }
);

const responseText = await response.text();

console.log("HTTP status:", response.status);
console.log(responseText);
```

Run this code in a trusted server-side environment. Do not expose `SPRINT_KEY` through a public frontend environment variable.

## Environment separation

The documented key format associates credentials with an environment.

| Property | Test | Live |
|---|---|---|
| Key prefix | `sk_test_` | `sk_live_` |
| Intended use | Development and testing | Production |
| Credential storage | Secure test configuration | Secure production secrets |
| Recommended workflow | Validate before launch | Use after validation |

The API should determine the applicable environment from the authenticated credential if that is how the deployed backend implements environment scoping. Verify this behavior against the actual authentication middleware and API documentation.

Do not assume that a quote or shipment created using one key can be used with another environment.

See [Environments](/docs/environments) for the environment guide.

## Rotating or replacing a key

If the merchant portal supports key rotation, use its documented process to replace a credential.

A safe rotation procedure is:

1. Confirm which application or service uses the existing key.
2. Follow the merchant portal's key-rotation procedure.
3. Store the replacement key in the appropriate secrets configuration.
4. Update the application without exposing the key in source control.
5. Verify that authenticated requests succeed using the replacement.
6. Confirm that the old key is no longer used.

The precise behavior of key rotation, including when the previous key becomes invalid, must match the deployed Sprint Connect implementation.

## Authentication errors

A request with a missing, malformed, expired, revoked, or unrecognized key may be rejected.

An example error response is:

```json
{
  "error": {
    "type": "authentication_error",
    "code": "invalid_api_key",
    "message": "Authorization header does not contain a valid API key.",
    "request_id": "req_example_request_id"
  }
}
```

This JSON illustrates the documented error format. Actual fields and wording may vary according to the API's implementation.

When authentication fails:

1. Confirm that the request uses the correct API base URL.
2. Confirm that the Authorization header follows the Bearer format.
3. Check that the correct environment's key is configured.
4. Confirm that the key has not been revoked or replaced.
5. Inspect the returned error code and request ID.
6. Contact Sprint Africa technical support if the issue persists.

Do not repeatedly retry a request with the same invalid credentials.

## Security recommendations

- **Keep secrets out of source control.** Load API keys from environment variables or a dedicated secrets manager.
- **Never expose live credentials in browser code.** Route requests through your backend.
- **Separate test and production secrets.** Avoid accidentally deploying test credentials into production or live credentials into development.
- **Restrict access.** Only authorized team members and services should have access to API credentials.
- **Rotate compromised credentials.** Follow the official key-replacement procedure if a key is exposed.
- **Redact secrets in logs.** Never log the full Authorization header.
- **Use HTTPS.** Send credentials only over HTTPS connections.
- **Test safely.** Prefer sandbox credentials for automated tests and development workflows.

## Troubleshooting checklist

If authentication is unsuccessful, check the following:

- Is the `Authorization` header present?
- Does the header use the `Bearer` scheme?
- Is the full key being supplied without accidental whitespace?
- Is the key valid for the environment being accessed?
- Has the key been revoked or rotated?
- Is the request being sent to the correct API host?
- Does the response contain an error code or request ID that can help diagnose the problem?

## What's next?

- [Quick Start](/docs/quickstart) — make your first API request.
- [Environments](/docs/environments) — understand test and live separation.
- [Errors](/docs/guides/errors) — learn how to handle API failures.
