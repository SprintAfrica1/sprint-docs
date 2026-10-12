---
id: intro
title: Introduction
sidebar_label: Introduction
slug: /intro
---

# Sprint Connect API

Sprint Connect is the merchant-facing API for **Sprint Africa**. It allows your platform to create, price, and track shipments across Nigeria, from local deliveries within Lagos to interstate shipments serving multiple destinations.

If you operate an online store, marketplace, logistics platform, or merchant business, you can integrate Sprint Connect into your backend to manage shipping directly from your own application.

## What you can do

- **Get shipping quotes:** Retrieve shipment pricing before creating a shipment.
- **Create individual shipments:** Book local and interstate deliveries.
- **Create bulk shipments:** Submit batches of deliveries using the supported bulk-shipment workflows.
- **Track shipments:** Retrieve shipment status and follow delivery progress.
- **Retrieve shipment events:** Read shipment events and use supported cursors to resume event processing after interruptions.
- **Integrate with your platform:** Connect your existing business application to Sprint Africa's shipping services.

## How it works

A typical shipment integration follows this sequence:

1. **Request a quote** using `POST /v1/rates`.
2. **Create the shipment** using `POST /v1/shipments` and the quote returned by the API.
3. **Retrieve shipment details** using the appropriate shipment endpoint.
4. **Track shipment events** using the supported events endpoint.

The general flow is:

```text
Your Application
       |
       v
Request a shipping quote
POST /v1/rates
       |
       v
Receive quote details
       |
       v
Create the shipment
POST /v1/shipments
       |
       v
Receive shipment details
       |
       v
Track shipment status and events
```

Bulk shipment workflows use their corresponding supported endpoints. Review the relevant guides before implementing individual or bulk delivery flows.

## Environments

Sprint Connect documentation describes separate test and live environments.

- **Test environment:** Use test credentials while developing and validating your integration.
- **Live environment:** Use live credentials for production requests after your integration has been tested and approved for use.

Keep test and live credentials separate. Never expose a live API key in frontend code, a public repository, or a mobile application distributed to users.

Read [Environments](/docs/environments) and [Authentication](/docs/authentication) to understand how credentials and environment separation work.

> **Important:** Confirm the actual behavior of your assigned API credentials and account in the Sprint Connect portal before sending production requests.

## Where to start

### Quick Start

Set up your integration, configure your API key, and make your first request.

[Read the Quick Start guide](/docs/quickstart)

### Sandbox

Learn how to obtain a test key and safely test your integration.

[Get a sandbox key](/docs/sandbox/get-a-sandbox-key)

### Authentication

Learn how to authenticate requests and protect your API credentials.

[Read Authentication](/docs/authentication)

### API Reference

Explore the available endpoints, request parameters, and response schemas.

[Browse the API Reference](/docs/api/rates-create)

### Integration Guides

Follow practical guides for creating shipments, handling bulk deliveries, and tracking shipment progress.

- [Send a single shipment](/docs/guides/send-a-single-shipment)
- [Send a bulk batch](/docs/guides/send-a-bulk-batch)
- [Track a shipment](/docs/guides/track-a-shipment)
- [Understand errors](/docs/guides/errors)

## Before going live

Before using Sprint Connect in production:

- Confirm that you have the correct live credentials.
- Keep API keys on your backend and load them from environment variables or a secure secrets manager.
- Test quote creation, shipment creation, and error handling in the test environment.
- Use idempotency protection where supported to prevent unintended duplicate operations.
- Handle failed requests and HTTP error responses appropriately.
- Verify endpoint paths and request fields against the actual API reference available for your account.

## Need help?

If you encounter an integration issue, collect the endpoint, HTTP status code, response body, and request ID when one is returned. Share the relevant diagnostic information with the Sprint Africa technical support team.

**Never include API secrets, passwords, or other sensitive credentials in a support request.**

