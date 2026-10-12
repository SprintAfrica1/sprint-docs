---
id: environments
title: Environments
sidebar_label: Environments
slug: /environments
---

# Environments

Sprint Connect provides two separate environments: **Test** and **Live**. The environment is determined by the API key used to authenticate a request.

Use Test while developing and validating your integration. Use Live when your application is ready to create real shipments.

## Test vs Live

| Feature | Test | Live |
|---|---|---|
| API key prefix | `sk_test_` | `sk_live_` |
| Balance affected | Test balance | Live balance |
| Real courier dispatched | No | Yes |
| Real shipment operations | No | Yes |
| Data visibility | Test environment only | Live environment only |
| Recommended use | Development and automated tests | Production traffic |

## When to use each environment

### Test environment

Use Test for:

- Local development.
- Building and validating your API integration.
- Automated and continuous integration tests.
- Testing shipment creation and tracking workflows.
- Checking request validation and error handling before deployment.

### Live environment

Use Live for:

- Production requests from your application.
- Creating shipments for real customers.
- Processing actual shipment charges.
- Verifying production behaviour when you are ready to operate with real shipments.

**Important:** Live requests can create real shipments and affect your live balance. Do not use a Live key for routine development or automated tests.

## How environment selection works

Sprint Connect determines the environment from the API key in the `Authorization` header.

For example, a Test request uses:

```http
Authorization: Bearer sk_test_YOUR_KEY_HERE
```

A Live request uses:

```http
Authorization: Bearer sk_live_YOUR_KEY_HERE
```

You do not need to send a separate `environment` field in the request body.

## Environment-specific data

Test and Live data are isolated.

When you authenticate with a Test key:

- Shipment reads are scoped to Test records.
- Shipment creation uses the Test environment.
- Charges affect the Test balance, not the Live balance.
- Test records are separate from Live records.

When you authenticate with a Live key, requests operate in the Live environment instead.

The merchant portal may provide a Test/Live selector so you can view the corresponding records and balance.

## Test balance

If your merchant account uses a funded Test balance, ensure that the balance is sufficient before creating shipments.

If a request fails because the Test balance is insufficient:

1. Confirm that the portal is displaying the Test environment.
2. Open the balance section.
3. Follow the available funding process.
4. Retry the shipment operation using the same idempotency key if you are retrying the same logical request.

The available funding options and limits depend on the merchant portal configuration.

## Do not mix environments

Keep an entire shipment flow in one environment.

For example:

1. Request a quote using a Test key.
2. Create the shipment using that quote and a Test key.
3. Read the resulting shipment using a Test key.

Do not request a quote with a Test key and then attempt to create the shipment with a Live key. A quote may be bound to its originating environment, and mixing environments can cause the create request to fail.

## Recommended configuration

Store the API key in an environment variable rather than hardcoding it in your application.

Example development configuration:

```dotenv
SPRINT_API_BASE_URL=https://api.sprintafrica.com.ng
SPRINT_API_KEY=sk_test_YOUR_KEY_HERE
```

For production, configure the appropriate Live key through your deployment environment or secrets manager.

Never commit real API keys to source control.

## Environment checklist

Before sending a request, confirm:

- [ ] The correct API key is configured.
- [ ] The key prefix matches the intended environment.
- [ ] The quote and shipment requests use the same environment.
- [ ] Your application is using the correct balance and data scope.
- [ ] Live credentials are stored securely on the server.
- [ ] Automated tests use Test credentials.

## What's next?

- [Quick Start](/docs/quickstart)
- [Authentication](/docs/authentication)
- [Quote Lifecycle](/docs/quote-lifecycle)
- [Idempotency](/docs/idempotency)