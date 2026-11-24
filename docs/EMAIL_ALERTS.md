# Activate Cosmos email alerts

## Current state

The enquiry function contains tested email-alert code. New enquiries are always saved first. Alerts stay pending when RESEND_API_KEY is missing. No email delivery is claimed until a real test reaches the recipient inbox.

## Private owner setup

1. Create a Resend account using **mngmntstd@gmail.com** and verify that inbox.
2. In Resend, create an API key with sending access. Keep it private.
3. In the Cosmos Supabase project, open **Edge Functions → Secrets**.
4. Add `RESEND_API_KEY` with that key as its value. Save it directly in Supabase; do not paste it into chat, source files or GitHub.
5. For this portfolio demo, the default sender is `Cosmos Alerts <onboarding@resend.dev>`. Resend's sandbox sender delivers only to the Resend account owner's email, which must be mngmntstd@gmail.com. For a branded sender or other recipients, verify an owned domain in Resend and set `ENQUIRY_FROM_EMAIL` to its approved sender.
6. Submit a fresh enquiry on the website, confirm it appears in Admin → Enquiries, and check mngmntstd@gmail.com's inbox/spam folder.

The email contains an inbox link and reference, not the customer's message or personal details. Enquiry details remain behind admin login. Sending acceptance is stored in `enquiry_notifications`; `sent` means provider accepted, not proof of inbox delivery. Check Resend delivery logs for bounces.

## Failure behavior

Saving an enquiry does not depend on successful email sending. Provider failures are recorded as failed. Duplicate submissions use a provider idempotency key. Pending/failed notifications have no scheduled background retry yet; they must be inspected and retried through a maintenance operation, or resubmission with the original request ID while preserving the payload. Do not create a second customer enquiry just to retry an email.

No historical enquiries are automatically mailed when the key is added. Start with a fresh test enquiry after activation. Review the provider's current account limits before a real business launch.
