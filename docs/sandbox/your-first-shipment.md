---
title: Your First Shipment
description: Create and track a shipment using Sprint Connect.
---

# Your First Shipment

This guide outlines the workflow for creating a shipment in the sandbox environment.

## Before you begin

You should have:

- Valid sandbox credentials.
- A working API request from your backend.
- Valid pickup, delivery, and package information.
- A successful rate quote when required by the documented workflow.

## 1. Create the shipment

Use `POST /v1/shipments` with a request body that matches the published shipment-creation schema.

See [Create a Shipment](/docs/api/shipments-create) for the required fields, response schema, and documented status codes.

Do not copy a payload from a local or interstate endpoint unless its schema matches the operation you are calling.

## 2. Store the response

After a successful response, save the shipment identifier and tracking reference returned by the API.

Associate them with your own order ID so your application can retrieve the correct shipment later.

## 3. Retrieve shipment details

Use the documented shipment retrieval endpoint when your application needs to refresh shipment information.

See [Retrieve a Shipment](/docs/api/shipments-read).

## 4. Track progress

Use the tracking endpoint to retrieve the latest available tracking information.

See [Retrieve Tracking Information](/docs/api/tracking-read).

Update your application's status based on the actual API response. Shipment creation alone does not confirm delivery.

## 5. Test failure handling

Test invalid input, authentication failures, unknown shipment identifiers, and temporary network problems. Follow the endpoint's documented behavior before retrying a request that may already have created a shipment.

See [Testing Failure Cases](/docs/sandbox/testing-failure-cases).

