# Cosmos Real Estate

Source code for https://cosmos-real-estate-demo.vercel.app

## Run locally

Requires Node.js 22 or later. No external dependencies are needed for the current frontend.

```sh
npm run check
npm run build
npm start
```

Open http://127.0.0.1:4173.

## Files

- src/: editable JavaScript, translations, property data and styles
- build.mjs: static route builder
- dist/: deployable pages and original image assets
- serve.mjs: local development server
- vercel.json: deployment settings

## Current features

Property browsing, filters, property details, galleries, four languages, WhatsApp enquiries and email drafts.

Email: mngmntstd@gmail.com
WhatsApp: +233 50 120 6171

Listings and prices are illustrative. Email drafts must be sent by the visitor.

## Backend status

A separate Cosmos Supabase project exists. Database schema, secure admin dashboard, property management, image storage and saved enquiries are not implemented yet.

## Deployment

Connect this repository to the existing cosmos-real-estate-demo Vercel project, with build command npm run build and output directory dist. The current live deployment was uploaded directly; Git-based deployment is not connected yet.

Keep passwords, service-role keys and environment secrets out of Git.
