---
title: Track a Shipment
description: Retrieve shipment information and tracking events through Sprint Connect.
---

# Track a Shipment

Sprint Connect provides shipment and tracking endpoints that allow your application to display delivery progress to customers and operational teams.

## Find the tracking reference

When shipment creation succeeds, save the shipment identifier and tracking reference returned in the response.

Keep the reference linked to your own merchant order ID so you can locate the correct shipment later.

## Retrieve tracking information

Use the tracking endpoint documented in the [API Reference](/docs/api/tracking-read).

Supply the required identifier in the format defined by that endpoint. Do not assume that every endpoint accepts the same identifier or URL parameters.

The tracking response may include the current shipment state and a journey or event history, depending on the returned schema.

## Retrieve shipment details

For additional shipment information, use the shipment retrieval endpoint:

[Retrieve a Shipment](/docs/api/shipments-read).

Use the returned information to update your application's order view. Handle a not-found response separately from authentication errors and temporary server failures.

## Synchronize tracking updates

For applications that need to keep many shipments up to date, review the available shipment listing, event listing, and catch-up endpoints in the API Reference.

A reliable synchronization process should:

1. Save the last successfully processed event or synchronization checkpoint.
2. Request the next set of available records using the documented parameters.
3. Process records without duplicating internal notifications.
4. Persist the checkpoint only after successful processing.
5. Recover from temporary failures without losing unprocessed updates.

Follow the actual pagination and cursor semantics documented by each endpoint. Do not assume a cursor or event ordering rule that the API does not guarantee.

## Displaying shipment status

- Display the latest status returned by Sprint Connect.
- Show event timestamps in a consistent timezone.
- Distinguish pending, in-transit, and delivered states according to the actual API response.
- Avoid claiming delivery until the API reports a delivered state.
- Handle missing or delayed tracking updates without inventing events.

For details about response properties and status codes, consult the generated [API Reference](/docs/api/sprint-connect-api).

