# Cosmos Real Estate

Live website: https://cosmos-real-estate-demo.vercel.app

Admin login: https://cosmos-real-estate-demo.vercel.app/admin/

## Stack

Static HTML/CSS/JavaScript frontend on Vercel. Supabase PostgreSQL, Auth, Storage and Edge Functions provide the backend.

## Local development

Requires Node.js 22 or newer. No frontend dependencies are required.

```sh
npm run check
npm run build
npm start
```

Open http://127.0.0.1:4173. The connected Supabase backend is live: local admin changes affect the same database as production.

## Features

- Database-backed published listings, filters and property detail pages
- Four languages and responsive layouts
- Persistent WhatsApp button and direct email links
- Saved website enquiries with validation, consent and rate limits
- Admin login restricted to approved verified accounts
- Property editing, publication/archiving, availability and USD prices
- Public listing photo uploads, galleries and cover selection
- Private enquiry inbox with status and internal notes
- Contact details, primary colour and accent settings
- Database audit log

## Documentation

- [Admin account setup](docs/ADMIN_SETUP.md)
- [Full handover and file map](docs/PROJECT_HANDOVER.md)
- [Verification results](docs/VERIFICATION.md)
- `supabase/migrations/`: database source and access policies
- `supabase/functions/enquiry/`: server-side enquiry endpoint
- `tests/rls_verification.sql`: transaction-only permission checks

## Important limits

The owner must create their admin account privately before first login. No passwords are included in this repository. Public keys in `src/config.js` are intentionally browser-readable; service-role credentials are never committed.

Listings/photos are illustrative. No payments, automated email notifications or WhatsApp chatbot are configured. Website enquiries are stored in the admin inbox; emails and WhatsApp messages remain in their apps.

Source changes need to be deployed to Vercel. Database edits through the dashboard appear after refreshing the public website; no deployment is needed for those changes.
