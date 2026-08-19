# Ryan Stulp Real Estate

Codex guidance for Ryan Stulp's public website and private admin dashboard.

## Context

- Repository: `jonahduckworth/ryan-stulp`.
- Canonical path: `/Users/jonah/dev/jd-builds/ryan-stulp`.
- Production: `ryanstulp.ca`; Vercel preview: `ryan-stulp.vercel.app`.
- Stack: Node 22, Next.js 16 App Router, React 19, TypeScript, Tailwind 4,
  Supabase Auth/Postgres/Storage, Resend, Cloudflare Turnstile, and Vercel.
- `main` is the production branch. Supabase migrations are applied separately
  and in filename order; a Vercel deploy does not apply them automatically.

## Work Rules

- Treat admin authorization, row-level security, lead/contact data, migrations,
  storage policies, rate limits, Turnstile, and transactional email as high-risk.
- Never expose service-role, Turnstile secret, Resend, or server-action keys in
  `NEXT_PUBLIC_*`, client bundles, logs, screenshots, or commits.
- Preserve honest empty states when service credentials or listing content are
  absent. Do not invent listings, testimonials, brokerage facts, or client copy.
- Preserve DNS records unrelated to the site, especially mail records, during
  domain work.
- Deployment, Supabase mutations, email delivery, and DNS changes require
  explicit authorization and live verification.

## Commands

```bash
nvm use
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Verification

- Logic/data changes: run targeted Vitest coverage, then lint, typecheck, tests,
  and build.
- UI changes: also verify public and `/admin` loading, empty, error, retry, and
  success states on desktop and mobile.
- Lead-form changes: test validation, rate limiting, Turnstile behavior, database
  persistence, redirect/result state, and email-provider delivery separately.
- Migration/auth changes: review RLS and role checks and provide rollout and
  rollback evidence before production mutation.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
