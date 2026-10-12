---
title: Create a Local Delivery
description: Quote and create a shipment for a local delivery using Sprint Connect.
---

# Create a Local Delivery

Use Sprint Connect's local delivery endpoints to request a rate and create a shipment for a supported local route.

## Before you begin

You need a valid API key for the intended environment and the pickup, delivery, and package details required by the API.

Read [Authentication](/docs/authentication) before making your first request.

## 1. Request a local delivery rate

Send a request to the local rates endpoint.

Use the exact field names and required properties shown in the generated [API Reference](/docs/api/local-rates-create).

The rate response should be checked before you create the shipment. Do not hard-code delivery prices in your application; use the current API response.

## 2. Create the shipment

Once you have confirmed the rate and delivery details, submit the shipment creation request to the local shipments endpoint.

Review the request schema in [Create a Local Shipment](/docs/api/local-shipments-create).

Include your own order reference when the schema supports one. This makes it easier to reconcile Sprint shipment records with your merchant orders.

## 3. Save the shipment details

After a successful response, persist the shipment identifiers and tracking information returned by Sprint Connect.

Store these values alongside your own order ID. Your application should not depend on a customer-facing order number being the same as the Sprint tracking reference.

## 4. Track delivery progress

Use the tracking endpoint or shipment retrieval endpoint documented in the [API Reference](/docs/api/sprint-connect-api).

Display only statuses and delivery information returned by the API. Do not mark a shipment as delivered based solely on a successful creation response.

## Common mistakes

- Using an API key from the wrong environment.
- Omitting required pickup, delivery, or package fields.
- Treating a rate quote as a completed shipment.
- Creating a shipment again after a timeout without checking whether the original request succeeded.
- Failing to save the tracking reference returned by the API.

For test credentials and safe initial requests, see [Get a Sandbox Key](/docs/sandbox/get-a-sandbox-key).

