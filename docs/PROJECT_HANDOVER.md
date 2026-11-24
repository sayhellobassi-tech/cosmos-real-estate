# Cosmos project handover

## Accounts and identifiers

- Source: https://github.com/sayhellobassi-tech/cosmos-real-estate
- Website: https://cosmos-real-estate-demo.vercel.app
- Admin: https://cosmos-real-estate-demo.vercel.app/admin/
- Vercel project: cosmos-real-estate-demo (`prj_1Wyqp2VfCC3q3m4i5rJidsKZrdld`), team aura-6702.
- Supabase organization: cosmos real estate (`jbdwugtzuynodmyeikdh`). Separate from Aura Orb.
- Supabase project: cosmos-real-estate (`iylhpckitjozlxgqzflk`), Ireland.
- Contact email: mngmntstd@gmail.com; WhatsApp: +233501206171. Editable in admin settings.

## Architecture

The Vercel site serves static HTML, CSS and ES modules. Supabase provides PostgreSQL, Auth, Storage and the `enquiry` Edge Function. There is no always-running Node/Express backend. `serve.mjs` is only a local static server.

Public clients use public/publishable keys in `src/config.js`. These are intentionally not secrets. Postgres row-level security enforces access. The service-role key exists only in the Supabase Edge Function runtime and is never delivered to browsers or stored in source.

Anonymous visitors can read only published properties and contact/theme settings. Approved, email-confirmed admins can manage properties, images, enquiries and settings. Public enquiry writes go through the validating, rate-limited Edge Function; direct anonymous table inserts and reads are blocked.

## File map

| File | Purpose |
| --- | --- |
| `src/app.js` | Public pages, navigation, filters, property galleries and enquiry form |
| `src/styles.css` | Public layout, typography and responsive styling |
| `src/i18n.js` | Translated editorial copy and UI labels |
| `src/data.js` | Original seed listings and static journal/portfolio data; public listings now load from Supabase |
| `src/admin.js`, `src/admin.css` | Admin UI and styling |
| `src/backend.js` | Auth, REST, uploads and enquiry requests |
| `src/config.js` | Supabase URL and public browser keys |
| `build.mjs` | Generate deployable HTML routes and copy assets |
| `vercel.json` | Build output, dynamic property rewrites and security headers |
| `supabase/migrations/` | Versioned database schema, policies, functions and seed data |
| `supabase/functions/enquiry/index.ts` | Validates and saves enquiries with rate limits |
| `supabase/config.toml` | Edge function deployment configuration |
| `dist/` | Built deployable frontend including images |

## Making changes

Use the dashboard for listing data, photos, prices, availability, public contact details and basic colours. Use source code for layouts, additional languages, editorial articles, animations or new functionality. Commit changes to GitHub. Until the Vercel Git connection is configured, pushing GitHub alone does not publish: deploy the matching source/output to the existing Vercel project.

Local commands: `npm run check`, `npm run build`, `npm start`. Open http://127.0.0.1:4173. No frontend dependency installation is required.

For a new Supabase project, run migrations in order, update the public config, deploy the enquiry function, update its origin allowlist and the CSP, and create an admin privately. Supabase CLI: `supabase link --project-ref PROJECT_REF`, `supabase db push`, `supabase functions deploy enquiry`. Never replay the migrations against an unrelated database.

## Enquiry handling

The form requires consent and saves a record in Supabase. Success is shown only after persistence. Email alert code now runs after saving; activation requires RESEND_API_KEY in Supabase Secrets. See EMAIL_ALERTS.md. Admins check the inbox and reply manually via email/WhatsApp. Messages are limited to 4,000 characters. Rate limits: 3 per email/hour, 10 per hashed source IP/hour and 200/day globally. IP hashes and per-email counters are internal and not exposed to visitors. Add a CAPTCHA/production abuse controls if traffic requires it.

## Operations and ownership

Back up database records and uploaded images separately from GitHub. Git stores code and original sample assets, not the changing live database. Check Supabase plan backup availability and use database exports/CLI dumps appropriate to the account. Review stored enquiry retention and remove stale personal data through the Supabase owner dashboard. Use strong passwords and enable MFA on GitHub, Vercel and Supabase accounts.

Supabase's public image bucket is for property marketing images, not identity documents, contracts or private client files. Archived images remain public until their Storage objects are deleted. Admin sessions are stored for the current browser tab and sign-out clears them.

Email notification activation is documented in EMAIL_ALERTS.md. Payment processing and WhatsApp automation are outside this demo. Current sample listings must be replaced/verified before taking real customer commitments. The authenticated `is_cosmos_admin` SECURITY DEFINER function intentionally exposes only a caller-specific boolean; its private allowlist is never exposed.
