# SEO coverage

Last reviewed: July 28, 2026.

This document maps the recommendations forwarded by Ryan's SEO team to the
replacement website. It distinguishes useful launch work from ongoing content
work so the site does not accumulate thin or repetitive pages.

| Recommendation | Current implementation |
| --- | --- |
| Unique titles and meta descriptions | Every public route has unique metadata and a canonical URL. Listings support custom SEO titles, descriptions, and social images in the admin dashboard. |
| Dedicated service pages | Buying, selling, home evaluation, commercial, investing, and rural services have dedicated, internally linked pages. |
| Location-specific content | `/calgary-areas` provides useful content for Calgary's five broad city areas plus rural and surrounding locations. Individual community pages should be added only when Ryan and the SEO team can supply original, current local content. |
| Logical heading structure | Public pages use one page-level heading and descriptive section headings. |
| Helpful content and FAQs | Buying, selling, commercial, investing, rural, and area pages include process guidance and visitor-focused FAQs. |
| Image optimization | Public imagery uses Next.js Image optimization, responsive sizes, lazy loading where appropriate, and editable alt text for listing galleries. |
| Speed and caching | The site is server rendered, uses optimized fonts and images, keeps client-side code limited to interactive controls, and sets long-lived cache headers for uploaded listing media. |
| Mobile usability | Navigation, property filters, cards, galleries, dialogs, forms, and admin workflows use responsive layouts and touch-sized controls. |
| Internal links | Homepage expertise cards, related-service cards, listings, area content, header, and footer link the main topics together. |
| Structured data | The site includes RealEstateAgent, Service, FAQPage, Offer, property, CollectionPage, and breadcrumb structured data where appropriate. |
| Clean URLs | Public routes use short descriptive slugs, and listing slugs are editable in the dashboard. |
| Strong calls to action | Every core journey leads to a relevant conversation, evaluation, listing inquiry, phone, or email action. |
| Blog or resources | Deferred intentionally. Buying, selling, area, and specialty-service pages are the evergreen resource foundation. Add an ongoing article program only when an owner, topics, review process, and publishing cadence are agreed. |
| Technical SEO | Sitemap, listing images in the sitemap, robots rules, HTTPS launch checks, canonical tags, metadata, security headers, and permanent legacy redirects are implemented. |

## Launch follow-through

- Create and verify the `ryanstulp.ca` Search Console domain property.
- Submit `/sitemap.xml` after the production domain is connected.
- Validate representative structured data and canonical tags on production.
- Confirm the old URL redirect and intentional 410 inventory after cutover.
- Record the initial Search Console and GA4 baseline.
- Ask the SEO team for its priority keyword and community list before creating
  individual community pages.
