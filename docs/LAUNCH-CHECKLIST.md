# Launch checklist

Target: complete production v1 by July 31, 2026.

## Required before production

- [ ] Ryan's licensed name and brokerage display have been confirmed for RECA
      compliance.
- [ ] Brokerage office address has been confirmed.
- [ ] Ryan approves all final page copy, testimonials, and performance claims.
- [x] Supabase project created and all current migrations applied.
- [x] Initial administrator account created, promoted, and tested locally.
- [ ] Resend sending domain verified and a real lead notification tested.
- [ ] Turnstile production keys configured and a real form submission tested.
- [ ] Vercel project connected with Node.js 22; remaining third-party production
      variables are listed below.
- [ ] Google Analytics property access confirmed and measurement ID configured.
- [ ] Search Console property access confirmed or a new domain property created.
- [x] Old URL inventory collected from the live site's XML sitemap.
- [x] Every material old URL mapped to a new route or an intentional 410.
- [ ] Privacy copy reviewed for Ryan's actual service and retention practices.
- [ ] Full acceptance test run completed on the production preview.

## External launch values still required

- Resend API key after `ryanstulp.ca` is verified as a sending domain.
- Cloudflare Turnstile production site key and secret.
- GA4 measurement ID, if Ryan wants analytics at launch.
- Supabase production Site URL and allowed redirect URLs updated after the final
  canonical domain is confirmed.
- Vercel custom-domain connection and the associated DNS records.

## DNS cutover

1. Export and retain the current GoDaddy DNS zone.
2. Lower website-record TTL where practical at least several hours ahead.
3. Do not alter MX, SPF, DKIM, DMARC, verification, or unrelated subdomain
   records.
4. Add Vercel's required `A`/`CNAME` records exactly as shown in Vercel.
5. Confirm both apex and `www` resolve and redirect to the canonical HTTPS host.
6. Verify TLS, forms, admin sign-in, images, sitemap, robots, and redirects.
7. Submit the sitemap in Search Console and request indexing for primary pages.

## Rollback

Keep the old host active during cutover. If the new production site has a
release-blocking fault, restore only the prior website `A`/`CNAME` values from
the saved zone export, leave mail records untouched, and investigate against
the Vercel preview before retrying.

## First 30 days

- Monitor form submissions and notification delivery.
- Review Vercel and Supabase errors without logging lead message content.
- Fix reproducible defects in the delivered scope.
- Record enhancement requests separately from bugs.
