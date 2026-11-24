# Cosmos administrator setup

## First login: owner action required

The application does not create or publish an admin password. Create the account in your own Supabase dashboard:

1. Open the **cosmos real estate** organization and **cosmos-real-estate** project.
2. Go to **Authentication → Users → Add user → Create new user**.
3. Use **mngmntstd@gmail.com**. Set your own strong, unique password privately.
4. Confirm the email using the dashboard's **Auto Confirm User** option for this owner-created account. Do not invite an untrusted or unverified person.
5. Open **https://cosmos-real-estate-demo.vercel.app/admin/** and sign in.

Only the verified account with the email in `private.admin_accounts` can read enquiries or make changes. The public contact email is separate from the admin allowlist. To authorize a different admin, the project owner must update this private allowlist using Supabase SQL Editor after verifying that person's identity. Do not add admin rights to user-editable profile metadata.

Do not send passwords, database passwords, service-role keys or recovery codes in chat or put them in GitHub.

## Daily use

- **Properties:** Add, edit, publish, draft or archive listings. Existing page slugs are fixed to avoid breaking links. Prices are USD; rent is monthly.
- **Photos:** Upload JPG, PNG or WebP files up to 5 MB each. Choose the cover and remove photos from a listing. Public listing photos remain in Storage until removed there.
- **Enquiries:** Website submissions are stored in the private inbox. Update statuses and add internal notes. The dashboard displays the latest 200 entries; the full database remains available in Supabase.
- **Website settings:** Change public email, WhatsApp number, primary colour and accent colour.
- **Activity:** See the most recent 20 database changes.

Refresh the public website to see saved changes. An empty collection stays empty; archived properties do not reappear from local fallback data.

## Password recovery

The Supabase project owner can manage admin accounts in Authentication. Supabase's default mail service has recipient restrictions; configure production SMTP and site redirect URLs before relying on email invitations or password-reset emails. Password resets must be completed privately by the account owner.

## Limits

No payments, automated email notifications, WhatsApp chatbot, CRM integration or customer accounts are included. Direct emails and WhatsApp conversations do not automatically appear in the website enquiry inbox. The website still contains sample property data and illustrative photos. Translations require review before a business launch.
