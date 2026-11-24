# Verification — 24 November 2026

## Passed

- JavaScript syntax and static build checks.
- Database permission tests in a rolled-back transaction: verified allowlisted owner can create/update listings; unrelated authenticated user cannot edit; draft listings stay hidden from anonymous users.
- Anonymous privileges: no enquiry reads, no property writes, no direct enquiry RPC execution, no admin-check RPC execution.
- Live browser: homepage reads database listings.
- Live browser: a newly added sample property loads through a new dynamic URL without rebuilding. Temporary listing archived after test.
- Live browser: enquiry form accepts consent, posts to the Edge Function, and shows success. Native SQL confirmed the exact message was persisted. Temporary test enquiry marked as a test/spam record afterward.
- Live browser: secure admin login page renders with the approved email, a password field and no public dashboard data.
- Supabase security advisor: no anonymous SECURITY DEFINER exposure remains. The one authenticated-function warning is intentional: `is_cosmos_admin` returns only a caller-specific boolean with a fixed search path and no user-controlled arguments. See PROJECT_HANDOVER.md.

## Owner action / verification still required

The real admin account has not been created. End-to-end password login, dashboard photo upload and UI saves must be verified after the owner creates the account privately. Database-level permissions and writes were tested; they do not replace this final signed-in browser test.

No automated email notification, password-reset email delivery, payment or WhatsApp bot was claimed or tested.
