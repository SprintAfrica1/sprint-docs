
---

## File 15 â€” `docs/sandbox/testing-failure-cases.md`

```markdown
---
id: testing-failure-cases
title: Testing Failure Cases
sidebar_label: Testing failure cases
slug: /sandbox/testing-failure-cases
---

# Testing Failure Cases

Every serious integration must handle errors. This page shows you how to make
each error happen on purpose, so you can verify your error handling works.

The sandbox rejects exactly the same requests as production. Nothing is
softened.

## `invalid_api_key` â€” 401

Send a request with a broken key:

```bash
curl -X POST https://api.sprintafrica.com.ng/v1/rates \
  -H "Authorization: Bearer sk_test_thisisnotarealkey" \
  -H "Content-Type: application/json" \
  -d '{"origin_state": "Lagos", "destination_state": "Rivers", "weight_kg": 2.0}'
