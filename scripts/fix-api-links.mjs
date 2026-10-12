// scripts/fix-api-links.mjs
//
// The OpenAPI plugin generates a "back to main page" link in every
// generated .mdx that points at /docs/api/rates, which is not a real
// route. The real first endpoint is /docs/api/rates-create. This
// post-processing step rewrites every occurrence.
//
// Run automatically after `docusaurus gen-api-docs sprint` via the
// package.json gen-api-docs script.

import { readFile, writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_DIR = 'docs/api';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

const files = await walk(API_DIR);
let changed = 0;

for (const file of files) {
  const before = await readFile(file, 'utf8');
  // /docs/api/rates but NOT /docs/api/rates-create
  const after = before.replace(/\/docs\/api\/rates(?!-)/g, '/docs/api/rates-create');
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed++;
  }
}

console.log(`Fixed links in ${changed} file(s).`);