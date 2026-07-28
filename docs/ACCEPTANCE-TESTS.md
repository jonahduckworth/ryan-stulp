# Acceptance tests

Run on desktop and mobile widths of 375, 768, 1024, and 1440 pixels.

## Public website

- [x] Header, mobile navigation, and footer links render at tested widths.
- [x] Home has no horizontal overflow at 375 pixels and the hero is not distorted.
- [x] Home, listings, buying, selling, evaluation, about, contact, and privacy
      pages load.
- [ ] Zero-listing state is clear and contains no fake inventory.
- [x] Published listing appears on home, listings, and its detail route.
- [ ] Draft and archived listings never appear publicly.
- [ ] A missing listing and an unknown route return a useful 404.
- [ ] Keyboard users can reach every control with visible focus.
- [ ] Reduced-motion preference removes nonessential motion.
- [ ] Form labels remain visible and errors are announced.

## Lead capture

- [ ] Invalid email and short message are rejected on the server.
- [ ] Honeypot content is rejected.
- [ ] Turnstile is required in production.
- [ ] A valid contact form creates exactly one lead.
- [ ] A valid home evaluation stores the property address.
- [ ] Ryan receives the notification email and Reply-To uses the lead's email.
- [ ] Repeated submissions from one source are rate-limited.
- [ ] No names, emails, phone numbers, property addresses, or messages appear in
      analytics events or production application logs.

## Administration

- [x] Anonymous `/admin` access redirects to login.
- [ ] A non-admin authenticated user cannot read or mutate admin data.
- [ ] Ryan can sign in and sign out.
- [x] An administrator can create a draft listing with an uploaded cover image.
- [x] Changing the listing to active publishes it immediately.
- [x] Editing a public listing updates public routes.
- [ ] Archiving removes it from public routes.
- [ ] Permanent delete removes the listing record.
- [x] Lead inbox shows source, intent, status, and received date.
- [x] An administrator can open a lead, call/email, add notes, and change status.
- [ ] Lead CSV export opens only while authenticated and escapes commas, quotes,
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
deployment on July 27, 2026. Remaining boxes are launch gates, not assumed
passes. Re-run the entire list after the custom domain and third-party services
are connected.

Latest home-page Lighthouse scores: Performance 94, Accessibility 100, Best
Practices 100, and SEO 100.
