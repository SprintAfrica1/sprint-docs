---
title: Get a Sandbox Key
description: Prepare your Sprint Connect integration for testing.
---

# Get a Sandbox Key

Use the sandbox environment to develop and validate your Sprint Connect integration before processing real shipments.

## Before you begin

Prepare your merchant account and obtain the sandbox credentials issued to you by Sprint Africa.

Keep test credentials separate from live credentials. Never commit either type of secret to source control or expose private API keys in browser code.

## Configure your environment

Store the sandbox base URL and API key in environment variables on your backend.

For example, your application configuration may use variables such as:

- `SPRINT_API_BASE_URL`
- `SPRINT_API_KEY`

These are suggested names for your own application configuration, not guaranteed Sprint Connect environment-variable names.

Set the base URL and authentication header according to the integration details provided by Sprint Africa and the generated API Reference.

## Verify your connection

Make a request to a documented endpoint using your sandbox credentials. Begin with the rates endpoint and use a request body that matches the published schema.

See [Create a Rate Quote](/docs/api/rates-create).

Confirm that your application handles both successful responses and API errors.

## Protect your credentials

- Keep credentials on your server.
- Do not log API keys.
- Use different configuration values for test and live environments.
- Restrict access to deployment secrets.
- Rotate credentials if they are exposed.

## Before going live

Test authentication, rate requests, shipment creation, tracking, and failure handling. Confirm the live base URL and credentials with Sprint Africa before switching environments.

