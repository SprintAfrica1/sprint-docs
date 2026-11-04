---
id: get-a-sandbox-key
title: Get a Sandbox Key
sidebar_label: Get a sandbox key
slug: /sandbox/get-a-sandbox-key
---

# Get a Sandbox Key

A sandbox key lets you call the Sprint Africa API without touching live
shipments or real money. It is the first thing you need before any other
page in this section.

## Before you begin

You need a merchant account on the Sprint Africa merchant portal. If you do
not have one yet, register at https://sprintafrica.com.ng/merchant and
complete the sign up steps.

## Create the key

1. Sign in to https://sprintafrica.com.ng/merchant.
2. Open the API Keys section from the sidebar.
3. Make sure the environment toggle in the header is set to **Test**.
4. Select **Create key** and give the key a name, for example
   `local-development`.
5. Copy the key immediately. It starts with `sk_test_`.

The full key is shown once. If you lose it, revoke it and create a new one.

## Check that the key works

Send a request to the local rate endpoint. A successful response confirms
the key is valid and your merchant account is enabled.

```bash
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

A successful response contains a `quote_id` and a `total_fee`. If you
receive a 401 response, the key is wrong or has been revoked. See
[Errors](/docs/guides/errors).

## Keep the key safe

- Store the key in an environment variable or a secrets manager.
- Never commit the key to source control.
- Never place the key in browser code or a mobile app.
- Revoke the key from the portal if you think it has leaked.

Sandbox keys and live keys are separate. A `sk_test_` key cannot read or
create live data. See [Environments](/docs/environments) for details.

## Next step

Continue with [Your First Rate Quote](/docs/sandbox/your-first-rate-quote).