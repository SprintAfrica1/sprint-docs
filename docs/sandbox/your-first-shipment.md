---
id: your-first-shipment
title: Your First Shipment
sidebar_label: Your first shipment
slug: /sandbox/your-first-shipment
---

# Your First Shipment

This page walks you through creating a shipment in the sandbox using only a
terminal. By the end you will have a tracking ID and you will have seen the
two step flow that every shipment follows.

You need two things before you start:

1. A sandbox key from the merchant portal. If you do not have one, see
   [Get a Sandbox Key](/docs/sandbox/get-a-sandbox-key).
2. A terminal with `curl` installed. On Windows, PowerShell includes
   `curl.exe`. On macOS and Linux, curl is preinstalled.

Throughout this page, replace `sk_test_YOUR_KEY_HERE` with your own sandbox
key.

## The two step flow

Every shipment is created in two calls:

1. **Request a quote** with `POST /v1/rates` or `POST /v1/local/rates`. The
   response contains a signed `quote_id` valid for five minutes.
2. **Create the shipment** with `POST /v1/shipments` or
   `POST /v1/local/shipments`, passing the `quote_id` from step one.

The API does not allow you to skip the quote. It locks in the price you
saw, so nothing can change between viewing and booking.

## Step 1: Request a quote

For a Lagos same city delivery, use the local rate endpoint:

```
curl -X POST https://api.sprintafrica.com.ng/v1/local/rates \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "dropoff_address": "22 Broad Street, Lagos Island",
    "package_type": "small",
    "is_fragile": false
  }'
```

The response looks like this:

```
{
  "quote_id": "qtl_eyJkcm9w...",
  "pickup_zone": "Z4",
  "dropoff_zone": "Z4",
  "vehicle_type": "bike",
  "pickup_address": "14 Awolowo Road, Ikoyi",
  "dropoff_address": "22 Broad Street, Lagos Island",
  "package_type": "small",
  "is_fragile": false,
  "total_fee": "3571.00",
  "currency": "NGN",
  "issued_at": 1791828562,
  "expires_at": 1791828862
}
```

Copy the entire `quote_id` string. It is long and starts with `qtl_`. You
have five minutes to use it before it expires.

## Step 2: Create the shipment

Paste the `quote_id` from step one into the request below. Replace
`sk_test_YOUR_KEY_HERE` with your sandbox key and
`PASTE_YOUR_QUOTE_ID_HERE` with the full quote ID.

```
curl -X POST https://api.sprintafrica.com.ng/v1/local/shipments \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: my-first-test-shipment" \
  -d '{
    "quote_id": "PASTE_YOUR_QUOTE_ID_HERE",
    "merchant_reference": "sandbox-test-001",
    "pickup_address": "14 Awolowo Road, Ikoyi",
    "pickup_city": "Ikoyi",
    "pickup_contact_name": "Sprint Test",
    "pickup_contact_phone": "08031234567",
    "dropoff_address": "22 Broad Street, Lagos Island",
    "dropoff_city": "Lagos Island",
    "dropoff_contact_name": "Test Recipient",
    "dropoff_contact_phone": "08098765432",
    "package_type": "small",
    "package_description": "Sandbox test",
    "is_fragile": false,
    "special_instructions": ""
  }'
```

The response:

```
{
  "tracking_id": "SP-3959261C",
  "merchant_reference": "sandbox-test-001",
  "status": "pending",
  "status_display": "Pending",
  "total_fee": "3571.00",
  "commission": "35.71",
  "commission_rate": "0.0100",
  "total_debited": "3606.71",
  "currency": "NGN",
  "pickup_zone": "Z4",
  "dropoff_zone": "Z4",
  "vehicle_type": "bike",
  "pickup_address": "14 Awolowo Road, Ikoyi",
  "dropoff_address": "22 Broad Street, Lagos Island",
  "package_type": "small",
  "is_fragile": false,
  "environment": "test",
  "balance_after": "31393.29",
  "created_at": "2026-10-12T18:09:24.643937+00:00"
}
```

The `tracking_id` identifies your shipment. The `environment` field reads
`test`, which confirms you are not touching live data.

## The quote fields must match

Four fields must be identical between the quote request and the create
request:

- `pickup_address`
- `dropoff_address`
- `package_type`
- `is_fragile`

If any of these change between step one and step two, the API returns
`invalid_quote`. Address strings must match exactly, including punctuation
and spacing.

The other fields on the create request, such as `pickup_city`,
`dropoff_contact_phone` and `merchant_reference`, are not part of the quote
signature. You can set them freely.

## The Idempotency-Key header

Every create request needs an `Idempotency-Key` header. Any unique string
works. Sending the same key again with the same body returns the original
response, so a retry never creates a duplicate shipment.

If you reuse a key with a different body, the API returns 409 with the code
`idempotency_conflict`. See [Idempotency](/docs/idempotency) for the full
pattern.

## PowerShell version

On Windows you can run the same flow as a script. Save it as
`test-sandbox.ps1`.

```powershell
$KEY = "sk_test_YOUR_KEY_HERE"
$BASE = "https://api.sprintafrica.com.ng/v1"

$headers = @{
    "Authorization" = "Bearer $KEY"
    "Content-Type"  = "application/json"
    "Accept"        = "application/json"
}

Write-Host "Requesting quote..." -ForegroundColor Cyan

$quote = Invoke-RestMethod `
    -Uri "$BASE/local/rates" `
    -Method Post `
    -Headers $headers `
    -Body (@{
        pickup_address  = "14 Awolowo Road, Ikoyi"
        dropoff_address = "22 Broad Street, Lagos Island"
        package_type    = "small"
        is_fragile      = $false
    } | ConvertTo-Json)

Write-Host "Quote: $($quote.total_fee) NGN" -ForegroundColor Green

Write-Host "Creating shipment..." -ForegroundColor Cyan

$createHeaders = $headers.Clone()
$createHeaders["Idempotency-Key"] = "test-" + (Get-Date -Format "yyyyMMddHHmmss")

$shipment = Invoke-RestMethod `
    -Uri "$BASE/local/shipments" `
    -Method Post `
    -Headers $createHeaders `
    -Body (@{
        quote_id             = $quote.quote_id
        merchant_reference   = "sandbox-test-001"
        pickup_address       = "14 Awolowo Road, Ikoyi"
        pickup_city          = "Ikoyi"
        pickup_contact_name  = "Sprint Test"
        pickup_contact_phone = "08031234567"
        dropoff_address      = "22 Broad Street, Lagos Island"
        dropoff_city         = "Lagos Island"
        dropoff_contact_name = "Test Recipient"
        dropoff_contact_phone = "08098765432"
        package_type         = "small"
        package_description  = "Sandbox test"
        is_fragile           = $false
        special_instructions = ""
    } | ConvertTo-Json)

Write-Host ""
Write-Host "Shipment created:" -ForegroundColor Green
$shipment | ConvertTo-Json -Depth 5
```

Run it with:

```powershell
.\test-sandbox.ps1
```

## Verify in the merchant portal

Open https://sprintafrica.com.ng/merchant/orders and set the header toggle
to Test. Your new shipment appears at the top of the list.

Switch the toggle to Live and the shipment disappears. Switch back to Test
and it returns. Test and live data are fully separate.

## Next steps

- [Track a Shipment](/docs/guides/track-a-shipment) to read the event
  stream.
- [Testing Failure Cases](/docs/sandbox/testing-failure-cases) to exercise
  your error handling.
- [Idempotency](/docs/idempotency) for the full retry pattern.
