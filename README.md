# Ryan Stulp Real Estate

A complete custom public website and private administration dashboard for
Ryan Stulp at The Real Estate District.

## What is included

- Responsive public pages for home, listings, buying, selling, home evaluation,
  about, contact, and privacy.
- Honest empty states so the site can launch before listings are entered.
- Secure lead forms with server validation, a honeypot, database-backed rate
  limiting, optional Cloudflare Turnstile, and optional email notifications.
- Private Supabase-authenticated admin dashboard.
- Listing create, edit, duplicate, preview, publish, archive, delete, and ordered
  multi-image galleries.
- Lead inbox, attribution, statuses, private notes, direct call/email actions,
  and CSV export.
- Editable public contact, brokerage, social, booking, and selected home-page
  settings.
- PostgreSQL row-level security, role checks, storage policies, and audit schema.
- Metadata, structured data, sitemap, robots, Open Graph image, manifest, and
  `llms.txt`.
- Privacy-conscious optional GA4 integration with no form data sent to analytics.

## Technology

- Node.js 22
- Next.js 16 App Router and React 19
- TypeScript
- Supabase Postgres, Auth, and Storage
- Resend for transactional lead alerts
- Cloudflare Turnstile for production form protection
- Vercel-compatible deployment

No GoHighLevel account is required. The listings and lead workflow are custom.

## Local development

```bash
nvm use
npm install
cp .env.example .env.local
npm run dev
```

The public site renders without service credentials and shows a correct
zero-listing state. Forms and `/admin` require Supabase configuration.

## Service setup

1. Create the Supabase project and run every migration in
   `supabase/migrations` in filename order.
2. Follow `supabase/README.md` to provision Ryan's admin account.
3. Add the values from `.env.example` to `.env.local` and the production host.
4. Configure a verified Resend sending domain on `ryanstulp.ca`.
5. Create Turnstile keys for the production domain.
6. Add the GA4 measurement ID once access is confirmed.

Never put `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`,
`RESEND_API_KEY`, or `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` in a
`NEXT_PUBLIC_` variable.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Manual launch tests are in `docs/ACCEPTANCE-TESTS.md`.
Ryan's operating instructions are in `docs/ADMIN-GUIDE.md`.

## Deployment

The intended deployment is Vercel with Supabase as the durable data layer.
Configure Node.js 22, add every production environment variable, deploy a
preview, complete the acceptance tests, then point `ryanstulp.ca` to the
production deployment. Preserve the old DNS records that are unrelated to the
website, especially mail records.

See `docs/LAUNCH-CHECKLIST.md` for the full cutover sequence and rollback plan.

The current staging deployment is
[`ryan-stulp.vercel.app`](https://ryan-stulp.vercel.app). It is not the final
public launch until the custom domain and the remaining third-party production
keys are configured.

## Support

The agreed handoff target is a complete v1 by July 31, 2026. The delivery
includes 30 days of bug-fix support after production launch. New features,
substantial content expansion, paid service fees, and third-party platform work
outside the documented launch setup are separate from bug fixes.
