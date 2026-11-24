# Cosmos — owner guide

## Keep these links

| Service | Link | Use |
| --- | --- | --- |
| Website | https://cosmos-real-estate-demo.vercel.app | Public demonstration |
| Admin | https://cosmos-real-estate-demo.vercel.app/admin/ | Daily listing and enquiry management |
| Source | https://github.com/sayhellobassi-tech/cosmos-real-estate | Code, history and these instructions |
| Supabase | https://supabase.com/dashboard/project/iylhpckitjozlxgqzflk | Database, accounts, photos and function secrets |
| Vercel Git settings | https://vercel.com/aura-6702/cosmos-real-estate-demo/settings/git | Connect or check GitHub auto deployments |

Admin email: **mngmntstd@gmail.com**. Its password is chosen privately by the owner and is not included here.

## Change common details

| Change | Where |
| --- | --- |
| Property price, description, city, beds, baths, area | Admin → Properties → Edit → Save property |
| Listing photo | Edit → Property photos → Upload → Make cover → Save property |
| Hide a property | Change visibility to Draft or Archived, then save |
| Add a property | Properties → Add property; set a unique reference and page slug; publish when ready |
| Phone/email | Admin → Website settings; save and refresh public site |
| Main colours | Admin → Website settings → Primary colour / Accent colour |
| Customer enquiry | Admin → Enquiries; read, update status, add notes and save |
| Layout, animation, typography or page structure | Edit `src/app.js` / `src/styles.css` in GitHub or a local checkout, test, commit and deploy |
| Journal or portfolio copy | `src/i18n.js` and `src/data.js` |

Database changes appear after the visitor refreshes; they do not require a code deployment. Theme controls change supported colours, not every colour baked into images/logos.

This remains a portfolio demo. Keep sample labels on and use illustrative images. Clients do not buy properties or pay through this website.

## Connect automatic deployment

In the existing Vercel project, open Settings → Git, connect the GitHub account and choose `sayhellobassi-tech/cosmos-real-estate`. Confirm the production branch is `main`. Do not import a duplicate Vercel project. Build command: `npm run build`; output: `dist`; framework: Other.

After connection, push a documentation-only commit and check Vercel creates a deployment for the same commit. Wait for Ready, then verify the stable website and admin URLs. Repository connection is incomplete until this is observed. Source pushes do not apply Supabase migrations or deploy Edge Functions automatically; those are separate backend releases.

## Backups: code, database and photos are separate

1. **Code:** From GitHub, choose Code → Download ZIP after each significant code release. Git history is also retained in the repository. Store the ZIP in a private folder under your control.
2. **Live data:** In Supabase Table Editor, export CSV copies of `properties`, `site_settings`, `enquiries`, `enquiry_notifications` and `audit_log`. The last three can contain private operational/customer information: save them privately, never in the public GitHub repository. Export after substantial changes and before migrations. Supabase UI labels may vary; use a connected SQL client/CLI export if the CSV option is unavailable.
3. **Photos:** In Supabase Storage → property-images, download original uploaded files. Preserve each object's folder/path and a copy of the properties data referencing them. Original sample photos are in GitHub; photos uploaded later through admin are not.
4. **Schema:** Keep all `supabase/migrations/` files. For fuller database backups, use Supabase CLI `supabase db dump` with your privately configured project connection. Auth accounts/private admin allowlists require a separate documented migration plan; public-table CSV files alone are not a full database backup.
5. **Account recovery:** Keep recovery codes privately in your password manager. Never include passwords, API secrets or recovery codes in the repository or handover ZIP.

Do not assume automatic point-in-time backups exist on the Free plan. Review the current Supabase backup options before relying on them.

## Restore carefully

Test restoration in a separate Supabase project first. Apply schema migrations, import property/settings/enquiry data in dependency order, restore Storage photos to their original paths, recreate authorized admin accounts privately, and update `src/config.js` for the new project. Update the function origin allowlist and Vercel security headers if changing domains/projects. Deploy the Edge Function and add sending secrets privately. Test login, property edit, photo upload and enquiry delivery before switching the live site.

For a bad frontend release, use Vercel's previous deployment/rollback controls. A frontend rollback does not undo database edits: restore those from the appropriate data backup deliberately.

## Email alerts

See [EMAIL_ALERTS.md](EMAIL_ALERTS.md). Alert code is prepared; activation requires the owner's Resend credentials in Supabase Secrets and an inbox delivery test. WhatsApp conversations/direct Gmail emails remain in their apps rather than automatically entering this dashboard.

## Verified with the owner

Admin login, property price/details edits, photo upload and cover display, and the customer enquiry arriving in the private dashboard were demonstrated successfully on 24 November 2026.
