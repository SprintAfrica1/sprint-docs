// scripts/fetch-swagger.mjs
//
// Fetch the public Sprint Connect schema from production before every
// build. This keeps the API reference in lockstep with the backend —
// if a route is added to apps/merchants/public_urls.py, the docs pick
// it up on the next deploy without a manual copy.
//
// The URL is deliberately the PUBLIC schema (/swagger.json), which is
// scoped to the 13 merchant-facing endpoints. The internal schema at
// /internal-swagger/ is admin-only and must never be fetched here.
//
// Timeout notes
// ─────────────
// Node 18+ ships fetch() with a default connect timeout of 10 seconds.
// Some hosts (and some Cloudflare edge nodes, especially on a cold
// start) take longer than that. We use AbortSignal.timeout() to raise
// it to 30s. If that still fails, the script falls back to the
// previously-fetched openapi-scoped.json so the build never hard-fails
// on a transient network blip.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SCHEMA_URL = 'https://api.sprintafrica.com.ng/swagger.json';
const OUT = 'openapi-scoped.json';
const TIMEOUT_MS = 30_000;

async function fetchSchema() {
  console.log(`Fetching schema from ${SCHEMA_URL} (timeout ${TIMEOUT_MS}ms)...`);

  const res = await fetch(SCHEMA_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} ${res.statusText} from ${SCHEMA_URL}`,
    );
  }

  const json = await res.json();

  if (!json || typeof json !== 'object') {
    throw new Error('Schema response was not a JSON object.');
  }

  await writeFile(OUT, JSON.stringify(json, null, 2), 'utf8');

  const pathCount = Object.keys(json.paths ?? {}).length;
  const title = json.info?.title ?? '(unknown)';
  const version = json.info?.version ?? '(unknown)';
  console.log(
    `Fetched schema: ${title} v${version} (${pathCount} paths) → ${OUT}`,
  );
}

try {
  await fetchSchema();
} catch (err) {
  console.error('');
  console.error('─'.repeat(60));
  console.error('FAILED to fetch the live schema:', err.message);
  console.error('');

  if (existsSync(OUT)) {
    console.error(`Falling back to existing ${OUT}.`);
    console.error('The build will continue with the last-good schema.');
    console.error('Fix the network issue and re-run when possible.');
    console.error('─'.repeat(60));
    console.error('');
    process.exit(0);
  }

  console.error(`No existing ${OUT} to fall back to.`);
  console.error('Cannot build without a schema. Aborting.');
  console.error('─'.repeat(60));
  console.error('');
  process.exit(1);
}