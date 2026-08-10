# Ryan Stulp Website Rebuild — Discovery and Build Brief

Prepared July 27, 2026 from Ryan and Mateo's email threads, the July 14 proposal, the live WordPress site, the provided brand assets, live DNS, GoDaddy delegate access, and current public regulatory sources.

## Executive summary

Ryan has authorized Jonah to replace the existing WordPress site and coordinate the handoff with the former developer. The intended product is a mobile-first lead-generation website with a secure listings-and-leads dashboard, not a WordPress reskin and not an IDX/MLS product.

The project is approved and can start now. Ryan has accepted the $2,000 fee and payment arrangement. The source assets and DNS handoff are saved in this workspace, GoDaddy domain access is confirmed, and the current public site is fully crawlable. Launch must remain blocked until the Google account invitations, brokerage advertising approval, lead routing, privacy decisions, and mail/DNS details are confirmed.

The immediate delivery commitment in email is:

- Development starts Monday, July 27, 2026.
- The complete website and admin dashboard are targeted for Friday, July 31, 2026.
- "Complete" means the agreed v1 public pages, responsive design, authentication, listing management, lead inbox, forms, notifications, analytics foundation, SEO foundation, privacy/consent implementation, QA, and a production-ready deployment. The production domain cutover is included on July 31 if the external launch approvals and account access are ready; an external approval or DNS dependency must not be hidden by calling the application unfinished.
- Included post-launch bug-fix support is 30 days from production launch for functionality within the agreed scope.

## Confirmed business goals

- Generate qualified buyer and seller leads.
- Support residential, commercial, and rural real estate.
- Serve first-time buyers, investors, builders, and developers.
- Work with Google Business Profile and Page Pros' local SEO work without duplicating it.
- Give Ryan direct control over listings and leads.
- Preserve Ryan's ownership of the domain, code, data, content, and service accounts.
- Keep v1 manual and focused; licensed MLS/IDX synchronization, a full CRM, and marketing automation are explicitly out of scope.

## Confirmed identity and public facts

| Field | Confirmed value | Launch treatment |
| --- | --- | --- |
| Public brand | Ryan Stulp | Brokerage approval required because RECA lists the licensed name as Ryan Andrew Stulp. |
| Current licence | Licensed Alberta associate; commercial, residential, and rural | Verify once more before launch and record the approval date. |
| Brokerage | The Real Estate District Limited o/a The Real Estate District | Display the approved brokerage name clearly on every public page. |
| Brokerage office address | #375, 7220 Fisher St SE, Calgary, AB T2H 2H8 | Ryan and Page Pros asked for this new address on the new site. Confirm exact punctuation/capitalization and whether it should appear in a persistent header/footer. |
| Phone | (587) 839-1432 | Use for tap-to-call and structured data. |
| Email | ryanstulp@gmail.com | Confirm whether this remains public or whether a domain address will be introduced. |
| Facebook | https://www.facebook.com/ryanstulprealtor | Ryan told Page Pros the address was updated there. |
| Licence start | October 2022 | Ryan supplied this fact. RECA shows initial licensing October 31, 2022. |
| Transaction history | 80+ completed transaction sides | Use only with Ryan/brokerage approval and a clear "as of" date if required. |
| Prior sales experience | 7+ years | Ryan supplied this fact. |
| Awards | Red Rubellite and Black Pearl Awards | Confirm official names and approved wording. |
| Brokerage performance claim | #1 Agent in Total Sales Volume at The Real Estate District in January 2025 and February 2026 | Keep the months in the claim; obtain brokerage approval/evidence before publishing. |

## Brand and content direction

Ryan provided:

- Three professional portrait photographs.
- Two composite logo/brand sheets.
- One Illustrator source file plus business-card PDFs/PNGs.
- Four recent listing/sold marketing examples.

The current visual language is red, black, white, high contrast, and modern. The new site should keep the recognizable RS mark but use more whitespace, editorial real-estate photography, restrained motion, and strong buyer/seller paths.

The provided "logo" PNGs are composite presentation sheets, not clean transparent production logos. The Illustrator/PDF source can likely produce the required web variants, but the build still needs:

- A clean horizontal logo for light backgrounds.
- A clean reversed logo for dark backgrounds.
- A compact RS mark.
- SVG and transparent PNG exports.
- A favicon/app icon derived from the RS mark.
- Ryan's approval of the final red/black/white palette.

See [ASSET-INVENTORY.md](./ASSET-INVENTORY.md).

## Access and handoff status

| System | Status on July 27 | Evidence / next action |
| --- | --- | --- |
| GoDaddy / `ryanstulp.ca` | Confirmed working | Jonah has active "Domains Only" delegate access. The domain is visible and expires April 7, 2029. Do not change DNS until the replacement is production-ready and the full zone is rebuilt. |
| Current DNS | Export obtained | Mateo's export is saved at `discovery/handoff/ryanstulp.ca-DNS-export.txt`. Live DNS matches the nameservers, hosting IP, MX records, and duplicate SPF warning in the export. |
| WordPress / A2/hosting.com reseller | Public site available; admin access not supplied | Mateo paid for the old hosting, so no Ryan renewal date applies. A WordPress migration is not required, but a final backup should still be captured before cutover. |
| Google Business Profile | Confirmed manager access | `jonah@jdbuilds.ca` became a manager on July 20. Live management access was verified July 28. The profile has a 4.9 rating from 27 reviews, uses `(587) 839-1432`, links to `https://ryanstulp.ca/`, and currently lists Calgary as the service area with no public business location. |
| Google Analytics | Confirmed property access | Mateo granted account and property access July 23. Live access was verified July 28 for property `ryanstulp.ca`; web stream `12280830039` is receiving traffic and uses measurement ID `G-ZPHYKZLE2P`. |
| Google Tag Manager | Not confirmed | Mateo's reply mentioned Analytics but did not confirm GTM. Determine whether a container exists and whether it should be retained or replaced. |
| Google Search Console | Access unavailable | A live check on July 28 showed only JD Builds properties under Jonah's Google account, and no Ryan Search Console invitation was found in email. Create and verify a `ryanstulp.ca` domain property during the controlled launch window. |
| Page Pros / local SEO | Relationship confirmed; recommendations pending | Ryan introduced Jonah to Patrick and asked for site structure, schema, internal linking, GBP, and keyword recommendations. No reply from Page Pros is present yet. |
| GoHighLevel / LeadConnector | Account exists but handoff is incomplete | Mateo does not have access. The earlier project was paused and LeadConnector/Mailgun were not fully configured. Confirm whether GHL is used in v1 or leave it out. |
| Mailgun | DNS traces exist; active use unconfirmed | Do not assume the old Mailgun configuration is usable. Prefer a fresh transactional-email setup unless Ryan explicitly wants to restore it. |
| Existing leads | No export received | Mateo said Ryan already has leads off-site and would double-check WordPress submissions. His final handoff attached only DNS. Obtain an explicit "no additional form data" confirmation or an export. |
| Brokerage approval | Not obtained | Ryan's current RECA licence categories and public brokerage are consistent with the site. Formal advertising approval is still required for performance claims, awards, brokerage/MLS marks, and final launch copy. |

## DNS and email cutover guardrails

Current authoritative nameservers:

- `ns1.supercp.com`
- `ns2.supercp.com`
- `ns3.supercp.com`
- `ns4.supercp.com`

Current web and mail-related facts:

- The root, `mail`, `ftp`, `cpanel`, `webmail`, and `autodiscover` records point to `106.0.62.86`.
- `www` aliases the root domain.
- MX currently routes first to `mail.ryanstulp.ca`, then to Mailgun.
- The live zone has two SPF records, which is invalid.
- Mateo supplied a corrected single SPF policy, but Mailgun and GoHighLevel DKIM/tracking records still have to be collected from their dashboards.
- Mateo believes Ryan uses personal Gmail and that the mailbox does not depend on A2 hosting. This must be confirmed before removing the old `mail`/MX records.

Safe launch sequence:

1. Build and verify the replacement on a staging URL.
2. Export/back up the live WordPress database and uploads.
3. Inventory every live DNS record again immediately before cutover.
4. Confirm whether any `@ryanstulp.ca` mailbox, alias, form sender, Mailgun domain, or GHL workflow is active.
5. Obtain any missing DKIM and tracking CNAMEs.
6. Recreate the complete required zone at the chosen DNS provider.
7. Validate the zone before changing nameservers.
8. Lower TTLs ahead of the switch where the current provider permits.
9. Cut over the domain, verify web and mail separately, and retain rollback instructions.

## Live WordPress inventory

The live site remains the old WooCommerce-based implementation.

Public content:

- 12 published pages.
- 9 generic/template blog posts from 2021.
- 1 published WooCommerce product used as a property listing.
- 513 WordPress media records, many of which are theme/template assets.
- 1 public author archive.
- No `/privacy-policy/` page.
- `/favicon.ico` returns 404.
- The homepage has a canonical tag but no meta description.
- Public Facebook link: `https://www.facebook.com/ryanstulprealtor`.

Current listing mismatch:

- The old site publishes `268 Madeira Place NE` as a WooCommerce product at `$569,000`.
- Current brokerage and third-party listing sources show changing prices/statuses and newer inventory.
- Recent supplied marketing examples include 1827 + 1831 43 Street SE, Unit 5 at 7948 51 Street SE, 59 Abbeydale Villas NE, and 619 Merrill Drive NE.

Do not migrate old listing price/status as authoritative. Ryan or the brokerage must supply the launch dataset and identify the ongoing source of truth.

Current listings are not required to begin development or complete the platform. The listings page and dashboard must support a clean zero-listing state, and Ryan can add listings later through the admin dashboard. Do not publish stale or placeholder listings merely to populate the page. If no active listings are entered by launch, show an honest empty state with consultation/contact calls to action.

### Verified Google review source

On July 28, 2026, the live Google Business Profile showed a 4.9 rating from 27
reviews. All review text is accessible through the manager account. Ryan has
publicly replied to the three reviews selected for the website from Alison
Whellams, Vincent D, and Ravdeep Singh. The site identifies them as Google
reviews and links back to the Google profile. Recheck the public rating and
review count during final launch QA because both can change.

### Valuable content to review and rewrite

- Ryan's biography.
- Buyer and seller resource copy.
- Home-evaluation explanation.
- Two testimonials attributed to Robert and Ferdinand M.
- Current listing photography and descriptions, subject to rights and status confirmation.

### Content to remove

- Shop, cart, checkout, account, wishlist, coupon, discount, deal, product-review, and product-sorting language.
- "Trusted By 10,000+ people" unless independently substantiated and approved.
- The nine template blog posts.
- Template claims such as magazines, printed MLS books, or automated buyer-database distribution unless Ryan confirms they are current and accurate.
- Duplicate/outdated biography copy.

## Proposed v1 information architecture

Public routes:

- `/`
- `/listings`
- `/listings/[slug]`
- `/buying-calgary`
- `/selling-calgary`
- `/home-evaluation`
- `/about`
- `/contact`
- `/privacy`
- `/thank-you/[inquiry-type]`
- `/llms.txt`
- `/sitemap.xml`
- `/robots.txt`

Protected routes:

- `/admin`
- `/admin/listings`
- `/admin/listings/new`
- `/admin/listings/[id]`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/settings`

## Redirect and removal plan

| Old URL | Proposed result |
| --- | --- |
| `/properties/` | 301 to `/listings` |
| `/product/268-madeira-place-ne/` | 301 to an approved listing/archive route if retained; otherwise 301 to `/listings` after confirming the property status. |
| `/about-me/` | 301 to `/about` |
| `/contact-me/` | 301 to `/contact` |
| `/buying-resources/` | 301 to `/buying-calgary` |
| `/selling-resources/` | 301 to `/selling-calgary` |
| `/home-evaluation/` | Keep the same route |
| `/blog/` | 410 or redirect only if a real replacement resource exists |
| Nine irrelevant 2021 posts | 410 Gone; do not mass-redirect unrelated posts to the homepage |
| `/cart/`, `/checkout/`, `/my-account/`, `/wishlist/` | 410 Gone |
| `/author/a2beb/` | 410 Gone |

Generate the final map from the live sitemap again immediately before launch.

## Proposed v1 data model

### Listings

- `id`
- `slug`
- `title`
- `address_line_1`
- `address_line_2`
- `city`
- `province`
- `postal_code`
- `price`
- `status` (`draft`, `active`, `pending`, `sold`, `archived`)
- `listing_type` (`residential`, `commercial`, `rural`)
- `property_type`
- `neighbourhood`
- `mls_number`
- `bedrooms`
- `bathrooms`
- `square_feet`
- `year_built`
- `description`
- `features`
- `cta_label`
- `cta_destination`
- `featured`
- `published_at`
- `seo_title`
- `seo_description`
- `social_image_id`
- `created_at`
- `updated_at`

### Listing media

- `id`
- `listing_id`
- `storage_key`
- `alt_text`
- `caption`
- `sort_order`
- `is_featured`
- original dimensions and generated variants

### Leads

- `id`
- `inquiry_type`
- `listing_id`
- `name`
- `email`
- `phone`
- `message`
- property/evaluation fields as structured JSON
- `status` (`new`, `contacted`, `qualified`, `won`, `lost`, `archived`)
- `notes`
- `page_url`
- `referrer`
- UTM fields
- consent language/version
- marketing-consent flag stored separately from the service inquiry
- spam/risk result
- `created_at`
- `updated_at`

### Site settings

- public phone/email
- brokerage legal/display name
- brokerage address
- social links
- booking link
- notification recipients
- approved claims
- homepage content controls
- privacy contact
- analytics IDs

### Admin/audit

- authenticated admin user
- server-side authorization
- role
- sign-in timestamps
- audit events for listing publication, lead status, exports, and settings changes

## Recommended implementation direction

Keep the architecture deliberately small:

- Current stable Next.js/TypeScript with server-rendered public pages.
- Managed PostgreSQL, authentication, and object storage through one provider such as Supabase.
- Managed hosting such as Vercel.
- A dedicated transactional provider such as Resend or Postmark for form notifications.
- Cloudflare Turnstile or equivalent server-verified spam protection.
- GA4 plus Search Console; add GTM only if Page Pros or the tracking plan actually requires it.
- Owner-controlled GitHub repository and service accounts.
- Automated database backups and least-privilege server credentials.

GoHighLevel is not required for v1. Store leads in the custom database, expose them in the custom admin dashboard, and send reliable notifications through the chosen transactional-email provider. The custom system will cover lead capture, source attribution, statuses, notes, related listings, and CSV export.

GoHighLevel is a third-party CRM and marketing-automation platform that can combine contacts, websites/funnels, forms, calendars, email, phone, SMS, and automated follow-up workflows. Those broader calling, texting, bulk-marketing, and campaign-automation features are outside this project's focused v1. Add an integration later only if Ryan establishes a concrete need for automated email/SMS sequences, pipeline synchronization, or centralized conversations.

This technical direction is approved. Implementation does not need to pause for further stack selection.

## Form, privacy, and compliance requirements

Before launch:

- Show the approved brokerage name clearly on every public page.
- Confirm the public licensed name/approved alternate name with Ryan's broker.
- Have the broker approve the website, claims, address, testimonials, MLS/REALTOR marks, and listing treatment.
- Publish an approved privacy policy and identify the privacy contact.
- Tell users what information is collected, why, how it is used/disclosed, and how to request access/correction.
- Collect only fields required for the inquiry.
- Define retention and deletion rules for leads and exports.
- Encrypt data in transit and at rest; keep lead data out of analytics and logs.
- Use separate, unchecked marketing consent if Ryan will send promotional email/text. A service inquiry must not silently subscribe someone.
- Store proof and wording/version of any marketing consent.
- Ensure future commercial messages identify the sender and include a working unsubscribe mechanism.
- Keep an incident-response and breach-notification path.

The build can provide implementation-ready draft language, but Ryan/brokerage must approve it and legal review remains outside the fixed scope.

## Analytics event plan

- `consultation_submit`
- `buyer_inquiry_submit`
- `seller_inquiry_submit`
- `home_evaluation_submit`
- `listing_inquiry_submit`
- `phone_click`
- `email_click`
- `booking_click`
- `primary_cta_click`
- `listing_view`
- `listing_filter`

Never send names, email addresses, phone numbers, street addresses, free-text messages, or other lead PII to analytics.

## Decisions confirmed by Jonah

1. Ryan has accepted the $2,000 fee and payment arrangement.
2. Implementation is approved using the recommended technical direction.
3. Friday, July 31 is the complete v1 website-and-admin target, not an alpha milestone.
4. Included post-launch bug-fix support is 30 days for functionality within the agreed scope.
5. Listings may be added later through the dashboard and are not required to begin or demonstrate the platform.
6. Ryan should remain the primary owner of production business accounts wherever possible, with Jonah receiving the collaborator access needed to build and support the system.

## Questions for Ryan / brokerage

### Launch blockers

1. Please confirm the exact public licensed name and whether "Ryan Stulp" is an approved alternate to "Ryan Andrew Stulp."
2. What exact brokerage name/logo/disclosure must appear on every page, and who at the brokerage approves the site?
3. Confirm the office address to publish: `#375, 7220 Fisher St SE, Calgary, AB T2H 2H8`. Is there permanent business signage for Google re-verification?
4. If Ryan wants listings present at launch, which current active, pending, sold, and archived listings should be included? Supply an authoritative spreadsheet/export plus approved photos and descriptions. Otherwise, listings can be added later through the dashboard.
5. Does Ryan have permission to republish the listing photos, MLS numbers, descriptions, brokerage marks, and sold-property details on his independent site?
6. What is the ongoing listing source of truth if v1 is manual: Ryan, an assistant, or brokerage notifications?
7. Which service areas are priority, in order? The old site names Calgary, Airdrie, Chestermere, and Okotoks, but this has not been confirmed.
8. Where should each lead type be delivered, and what response time/message should the site promise?
9. Confirm the admin sign-in email and anyone else who needs access.
10. Confirm the privacy contact, lead-retention period, and whether marketing email/text consent is needed at launch.

### Access and coordination

11. Google Business Profile and Analytics access are verified. Preserve both
    during cutover and keep the new address change coordinated with Page Pros.
12. Grant Search Console access and confirm whether a Tag Manager container exists.
13. Provide or invite Jonah to the current GoHighLevel/Mailgun accounts only if they remain in scope.
14. Ask Page Pros for the promised 10 target keywords, location priorities, GBP/site recommendations, and their measurement/reporting plan.
15. Confirm there are no additional WordPress form submissions or leads to export.

### Content approval

16. Approve the biography facts, award names, transaction claim, monthly #1 sales-volume claims, and testimonials.
17. Confirm which of the three headshots is the primary image.
18. Provide a booking link if one should be used.
19. Confirm social profiles beyond Facebook.
20. Confirm whether `ryanstulp@gmail.com` remains public or a new `@ryanstulp.ca` address should be created.

## Ready-to-start work

These items do not require the remaining launch answers:

1. Scaffold the application and environments.
2. Export clean logo variants from the supplied source.
3. Establish the design system and mobile shell.
4. Build the public route structure with draft content.
5. Build the listing, media, lead, settings, and audit schemas.
6. Build authentication and server-side authorization.
7. Build listing and lead admin workflows.
8. Implement forms with placeholder notification recipients.
9. Prepare the redirect manifest and WordPress backup script/checklist.
10. Prepare a private staging preview for July 31.

## Evidence sources

- Ryan email threads received July 16–24, 2026.
- Mateo's "Website Transfer" thread and DNS attachment received July 24, 2026.
- July 14, 2026 project proposal supplied by Jonah.
- Live `https://ryanstulp.ca/`, WordPress REST API, robots file, and sitemap checked July 27, 2026.
- Live public DNS checked July 27, 2026.
- GoDaddy delegated account checked July 27, 2026.
- Ryan's current brokerage profile and RECA ProCheck entry checked July 27, 2026.
- Current RECA advertising guidelines, Alberta OIPC PIPA guidance, and federal CASL guidance checked July 27, 2026.
