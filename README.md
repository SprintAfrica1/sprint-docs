# Sprint Connect API Documentation

Public documentation site for the Sprint Connect API, the merchant facing shipping API for Sprint Africa.

Live at https://docs.sprintafrica.com.ng

## What this repo is

A Docusaurus site that renders:

- Guides: how to use Sprint Connect, written for merchant developers.
- Sandbox: step by step walkthroughs for getting a test key and making your first request.
- API Reference: auto generated from the live OpenAPI schema served at https://api.sprintafrica.com.ng/swagger.json.

The API reference is not hand written. Every page under docs/api/ is generated from openapi.yaml, which is fetched from the production API schema at build time. If an endpoint changes on the backend, the docs pick it up on the next deploy.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run start