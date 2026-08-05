# Acceptance tests

Run on desktop and mobile widths of 375, 768, 1024, and 1440 pixels.

## Public website

- [x] Header, mobile navigation, and footer links render at tested widths.
- [x] Home has no horizontal overflow at 375 pixels and the hero is not distorted.
- [x] Home, listings, buying, selling, evaluation, about, contact, and privacy
      pages load.
- [x] Zero-listing state is clear and contains no fake inventory.
- [x] Published listing appears on home, listings, and its detail route.
- [x] Draft and archived listings never appear publicly.
- [x] Published market updates appear in the archive and article route.
- [x] Draft and archived market updates return 404 publicly but render in admin preview.
- [x] A missing listing and an unknown route return a useful 404.
- [x] Keyboard users can reach every control with visible focus.
- [x] Reduced-motion preference removes nonessential motion.
- [x] Form labels remain visible and errors are announced.

## Lead capture

- [x] Invalid email and short message are rejected on the server.
- [x] Honeypot content is rejected.
- [ ] Turnstile is required in production.
- [x] A valid contact form creates exactly one lead.
- [x] A valid home evaluation stores the property address.
- [ ] Ryan receives the notification email and Reply-To uses the lead's email.
- [x] Repeated submissions from one source are rate-limited.
- [x] No names, emails, phone numbers, property addresses, or messages appear in
      analytics events or production application logs.

## Administration

- [x] Anonymous `/admin` access redirects to login.
- [x] A non-admin authenticated user cannot read or mutate admin data.
- [ ] Ryan can sign in and sign out.
- [x] An administrator can create a draft, continue to the gallery, upload
      multiple images, set the featured image, and order the photos.
- [x] A listing without a featured image cannot be published.
- [x] Publishing a ready listing requires confirmation and then makes it public.
- [x] Editing a public listing updates public routes.
- [x] Residential, commercial, and rural detail fields render correctly.
- [x] Listing and lead search/status filters return the expected records.
- [x] Archiving removes it from public routes.
- [x] Permanent delete removes the listing record.
- [x] An administrator can create, preview, publish, archive, and delete a market update.
- [x] Market-update cover upload requires alt text, and deleting the update removes its stored image.
- [x] Lead inbox shows source, intent, status, and received date.
- [x] An administrator can open a lead, call/email, add notes, and change status.
- [x] Lead CSV export opens only while authenticated and escapes commas, quotes,
      and line breaks correctly.

## SEO, performance, and operations

- [x] Canonical metadata uses `https://ryanstulp.ca`.
- [x] Open Graph image endpoint renders and page metadata includes title and
      description.
- [x] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, and `/llms.txt` load.
- [x] Anonymous `/admin` is protected and redirects to login.
- [x] Old URL redirects return 308 and removed routes return an intentional 410.
- [x] Lighthouse checks show no critical accessibility or SEO failures.
- [x] No production build, browser console, or server errors remain in the
      completed staging checks.

Checked boxes were verified on the local application or the Vercel staging
deployment on July 27, July 29, and August 5, 2026. The July 29 local pass covered the complete
listing lifecycle, lead validation and attribution, rate limiting, authenticated
CSV export, non-admin database isolation, keyboard focus, and the intentional
zero-listing state. The August 5 pass covered the private draft, preview,
publication, public archive/article, formatting, cover upload, and deletion
flows for market updates. All temporary records and stored files were removed.

The remaining boxes require Ryan's account or production-only services and are
launch gates, not assumed passes. Re-run the entire list after the custom domain
and third-party services are connected.

Latest home-page Lighthouse scores: Performance 94, Accessibility 100, Best
Practices 100, and SEO 100.
