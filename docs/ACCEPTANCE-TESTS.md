# Acceptance tests

Run on desktop and mobile widths of 375, 768, 1024, and 1440 pixels.

## Public website

- [ ] Header, mobile navigation, all footer links, phone, email, and Facebook work.
- [ ] Home has no horizontal overflow and the hero image is not distorted.
- [ ] Home, listings, buy, sell, evaluation, about, contact, and privacy pages load.
- [ ] Zero-listing state is clear and contains no fake inventory.
- [ ] Published listing appears on home, listings, and its detail route.
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

- [ ] Anonymous `/admin` access redirects to login.
- [ ] A non-admin authenticated user cannot read or mutate admin data.
- [ ] Ryan can sign in and sign out.
- [ ] Ryan can create a draft listing with an uploaded cover image.
- [ ] Changing the listing to active publishes it immediately.
- [ ] Editing a public listing updates public routes.
- [ ] Archiving removes it from public routes.
- [ ] Permanent delete removes the listing record.
- [ ] Lead inbox shows source, intent, status, and received date.
- [ ] Ryan can open a lead, call/email, add notes, and change status.
- [ ] Lead CSV export opens only while authenticated and escapes commas, quotes,
      and line breaks correctly.

## SEO, performance, and operations

- [ ] Canonical metadata uses `https://ryanstulp.ca`.
- [ ] Open Graph image renders and social previews have title and description.
- [ ] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, and `/llms.txt` load.
- [ ] `/admin` is excluded from indexing and uses no-store headers.
- [ ] Old URL redirects return 308 and land on the intended new route.
- [ ] Lighthouse checks show no critical accessibility or SEO failures.
- [ ] No production build, browser console, or server errors remain.
