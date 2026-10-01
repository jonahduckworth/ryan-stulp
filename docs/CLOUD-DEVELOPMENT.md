# Cloud development

The public frontend, empty listing states, and admin setup screen work without
Supabase, Resend, Turnstile, or analytics credentials. Leave `.env.local` absent
for ordinary UI work. This workflow neither provisions accounts nor applies
migrations or sends emails.

## Installation and commands

From the repository root, run:

```bash
bash scripts/cloud/setup.sh
bash scripts/cloud/run.sh npm run dev -- --hostname 0.0.0.0
```

Setup reuses the existing `/workspace/.onboarding/node22` runtime if suitable;
otherwise it installs Node 22.23.3 and npm 10.9.8 from the npm registry into the
ignored `.cloud-tools/node22` directory. It runs `npm ci --include=dev` and downloads the
Chromium and FFmpeg binaries matching the locked Playwright version. These are
development dependencies; installation needs registry and Playwright CDN access.
No system packages, shell startup files, accounts, or access settings are changed.
If browser launch reports missing OS libraries, stop and arrange an approved
base-image update; setup does not escalate privileges or install OS packages.

Use the wrapper for **every new command shell**. It validates the runtime,
prepends its executables to PATH, and sets writable npm and browser cache paths.
Alternatively, `source scripts/cloud/activate.sh` activates the current Bash
session. Plain `node` in a new unactivated shell may still be the image's Node 24.
`RYAN_CLOUD_TOOLS` can select a writable absolute cache directory before setup
and must have the same value for subsequent commands.

```bash
bash scripts/cloud/run.sh npm run lint
bash scripts/cloud/run.sh npm run typecheck
bash scripts/cloud/run.sh npm test
bash scripts/cloud/run.sh npm run build
bash scripts/cloud/run.sh npm run browser:smoke
```

The smoke command starts and stops its own development server on loopback port
3131. Keep that port free and do not run another Next development server in this
checkout simultaneously. It visits home, listings, market updates, contact, and
the admin setup screen at desktop and mobile sizes. It checks HTTP success,
headings, admin fallback, and browser exceptions, then writes ten PNG screenshots,
two WebM recordings, and server logs to ignored `output/browser-smoke/`.

It removes application service variables from the server process and refuses
checkouts containing `.env`, `.env.local`, `.env.development`, or
`.env.development.local`; use a separate credential-free checkout for this check.
Browser requests are limited to the local server. No forms are submitted.
The development server and production build may download Google Fonts from
`fonts.googleapis.com` and `fonts.gstatic.com`.

The project uses Playwright's matching browser and recording binaries rather
than relying on an arbitrary system Chromium/FFmpeg combination. See the
[official browser installation guide](https://playwright.dev/docs/browsers).

## Reusable saved environment

These scripts are repository files, not saved cloud environment configuration.
The current environment exposes no configuration-editing API to this task.
Its existing `/workspace/.onboarding/install.sh` is a local preparation artifact;
editing it alone would not prove that future tasks receive the changes.

When updating the saved `ryan-stulp` environment, use this install command:

```bash
cd /workspace/ryan-stulp
bash scripts/cloud/setup.sh
```

Use this instruction for its Start skill:

> Work in `/workspace/ryan-stulp`. Run project commands through
> `bash scripts/cloud/run.sh`. For a frontend preview start
> `bash scripts/cloud/run.sh npm run dev -- --hostname 0.0.0.0` and verify HTTP
> success on port 3000. Ordinary UI work needs no service credentials. Run
> `bash scripts/cloud/run.sh npm run browser:smoke` with other dev servers stopped
> to verify desktop/mobile screenshots and recordings.

The [official cloud environment guide](https://learn.chatgpt.com/docs/environments/cloud-environments)
describes Install script and Start skill fields, plus an Edit/Republish flow.
New tasks use the published filesystem; existing tasks retain their own state.
After these source changes are made available through the normal repository
workflow, prepare and verify the saved environment in its Edit flow, republish,
then test a fresh task. This implementation has not changed or republished the
saved environment and does not claim fresh-task verification.

## Optional isolated integration work

Use an explicitly approved nonproduction Supabase project, or separately prepare
a local Supabase stack with CLI and Docker. This repository does not currently
include local Supabase CLI configuration. Follow `supabase/README.md` for the
ordered migrations, storage policies, and isolated administrator setup. Do not
apply those instructions to production as part of frontend setup.

Only that integration workspace needs `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Add the Resend
and newsletter variables from `.env.example` only for approved email/webhook
tests using test recipients. Do not import real contacts or run live campaigns.

Production lead submissions require `LEAD_FINGERPRINT_SALT`,
`TURNSTILE_SECRET_KEY`, and the matching `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
Development permits missing Turnstile configuration, but backend submissions
still need Supabase. Email notifications and analytics remain optional.
Never attach production credentials merely to make an ordinary UI check pass.
