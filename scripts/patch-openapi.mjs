// scripts/patch-openapi.mjs
//
// Post-process openapi.yaml after swagger2openapi runs.
//
// Four fixes for the interactive console and the generated reference:
//
// 1. Make the security scheme an http bearer scheme with a description
//    that tells merchants to use their API key. docusaurus-theme-openapi-docs
//    only renders an Authorize button for http bearer schemes. Without
//    this, every console request goes out with Authorization: <Authorization>
//    and 401s. The description set here replaces the backend text, which
//    talks about JWTs.
//
// 2. Strip a leading /v1 from every path key, and pin the servers URL
//    to https://api.sprintafrica.com.ng/v1. If drf-yasg ever emits paths
//    that already include /v1 while the schema also declares /v1 as the
//    base, the console would concatenate the two and produce a doubled
//    /v1/v1/... URL. When the schema carries no /v1 in its paths (the
//    normal case today) this step changes nothing and reports 0.
//
// 3. Make required header parameters (like Idempotency-Key) editable.
//    The theme hides text inputs for required headers, so required is
//    flipped to false. Idempotency-Key is left EMPTY on purpose: the
//    backend remembers every key per merchant, so a prefilled value
//    reused across shipments would replay the first result.
//
// 4. Add a Content-Type: application/json header to every POST operation
//    that has a request body. The theme reads `default` and `example`
//    only when they live INSIDE the `schema:` block, so they are placed
//    there, for new and for already existing Content-Type parameters.

import { readFile, writeFile } from 'node:fs/promises';
import yaml from 'js-yaml';

const FILE = 'openapi.yaml';
const API_BASE_URL = 'https://api.sprintafrica.com.ng/v1';

const AUTH_DESCRIPTION =
  'Your Sprint Connect API key. Use a test key (it starts with sk_test_) ' +
  'in the sandbox. Requests from this page go from your browser straight ' +
  'to the API.';

const IDEMPOTENCY_DESCRIPTION =
  'Required for shipment creation. Any unique string, for example a UUID. ' +
  'Use a new value for every shipment. Reuse a value only to retry the ' +
  'exact same request.';

const CONTENT_TYPE = 'application/json';

const raw = await readFile(FILE, 'utf8');
const doc = yaml.load(raw);

let bearerFix = 0;
let pathFix = 0;
let headerFix = 0;
let contentTypeFix = 0;

// ── Fix 1: http bearer scheme with a clear description ──────────────
const schemeGroups = [
  doc.securityDefinitions,
  doc.components ? doc.components.securitySchemes : undefined,
];

for (const group of schemeGroups) {
  if (!group) continue;
  for (const [name, def] of Object.entries(group)) {
    if (!def || typeof def !== 'object') continue;
    const isHeaderKey = def.type === 'apiKey' && def.in === 'header';
    const isBearer = def.type === 'http' && def.scheme === 'bearer';
    if (isHeaderKey || isBearer) {
      group[name] = {
        type: 'http',
        scheme: 'bearer',
        description: AUTH_DESCRIPTION,
      };
      bearerFix++;
    }
  }
}

// ── Fix 2: strip leading /v1 from every path and pin the server URL ─
function normalisePathKey(key) {
  if (key === '/v1') return '/';
  if (key.startsWith('/v1/')) return key.slice(3);
  return key;
}

if (doc.paths) {
  const newPaths = {};
  for (const [key, value] of Object.entries(doc.paths)) {
    const next = normalisePathKey(key);
    if (next !== key) pathFix++;
    newPaths[next] = value;
  }
  doc.paths = newPaths;
}

// OpenAPI 3.0 uses servers: [ { url } ]
if (Array.isArray(doc.servers) && doc.servers.length > 0) {
  doc.servers = [{ url: API_BASE_URL }];
} else if (doc.swagger && doc.swagger.startsWith('2')) {
  // Swagger 2.0 uses host + basePath + schemes.
  // swagger2openapi should already have converted these, but if it
  // has not, set them anyway so the output is deterministic.
  doc.host = 'api.sprintafrica.com.ng';
  doc.basePath = '/v1';
  doc.schemes = ['https'];
}

// ── Helper: Idempotency-Key becomes an editable, empty field ────────
function fixIdempotencyParam(param) {
  if (param.name !== 'Idempotency-Key') return false;
  if (param.in !== 'header') return false;

  param.required = false;
  param.description = IDEMPOTENCY_DESCRIPTION;
  param.schema = { type: 'string' };

  // Remove anything outside schema: that the theme would not read, and
  // any prefilled value from earlier versions of this script.
  delete param.type;
  delete param.default;
  delete param.example;
  delete param.format;
  delete param.enum;
  return true;
}

// ── Helper: Content-Type with its default inside schema ─────────────
function normaliseContentTypeParam(param) {
  param.required = false;
  param.description = 'Request body media type.';
  param.schema = {
    type: 'string',
    default: CONTENT_TYPE,
    example: CONTENT_TYPE,
  };
  delete param.type;
  delete param.default;
  delete param.example;
}

// ── Fixes 3 and 4: walk every operation ─────────────────────────────
function walkOperations(paths) {
  for (const [, methods] of Object.entries(paths)) {
    for (const [methodKey, op] of Object.entries(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(methodKey)) {
        continue;
      }
      if (!op || typeof op !== 'object') continue;

      // Fix 3: editable header parameters
      if (Array.isArray(op.parameters)) {
        for (const param of op.parameters) {
          if (!param || typeof param !== 'object') continue;

          if (fixIdempotencyParam(param)) {
            headerFix++;
            continue;
          }

          if (param.in === 'header' && param.required === true) {
            param.required = false;
            headerFix++;
          }
        }
      }

      // Fix 4: Content-Type for POST with body
      if (methodKey === 'post' && op.requestBody) {
        if (!Array.isArray(op.parameters)) op.parameters = [];

        const existing = op.parameters.find(
          (p) => p && p.in === 'header' && p.name === 'Content-Type',
        );

        if (existing) {
          normaliseContentTypeParam(existing);
        } else {
          const created = { name: 'Content-Type', in: 'header' };
          normaliseContentTypeParam(created);
          op.parameters.push(created);
        }
        contentTypeFix++;
      }
    }
  }
}

walkOperations(doc.paths || {});

await writeFile(FILE, yaml.dump(doc, { lineWidth: -1 }), 'utf8');

console.log(
  `Patched openapi.yaml: ${bearerFix} security scheme(s), ` +
    `${pathFix} path key(s), ${headerFix} header parameter(s), ` +
    `${contentTypeFix} content type(s).`,
);