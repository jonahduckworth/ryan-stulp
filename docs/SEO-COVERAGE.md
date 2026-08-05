# SEO coverage

Last reviewed: August 5, 2026.

This document maps the recommendations forwarded by Ryan's SEO team to the
replacement website. It distinguishes useful launch work from ongoing content
work so the site does not accumulate thin or repetitive pages.

| Recommendation | Current implementation |
| --- | --- |
| Unique titles and meta descriptions | Every public route has unique metadata and a canonical URL. Listings and market updates support custom SEO titles and descriptions in the admin dashboard, with sensible defaults when blank. |
| Dedicated service pages | Buying, selling, home evaluation, commercial, investing, and rural services have dedicated, internally linked pages. |
| Location-specific content | `/calgary-areas` provides useful content for Calgary's five broad city areas plus rural and surrounding locations. Individual community pages should be added only when Ryan and the SEO team can supply original, current local content. |
| Logical heading structure | Public pages use one page-level heading and descriptive section headings. |
| Helpful content and FAQs | Buying, selling, commercial, investing, rural, and area pages include process guidance and visitor-focused FAQs. |
| Image optimization | Public imagery uses Next.js Image optimization, responsive sizes, lazy loading where appropriate, and editable alt text for listing galleries and market-update covers. Draft market-update covers remain in private storage until publication. |
| Speed and caching | The site is server rendered, uses optimized fonts and images, keeps client-side code limited to interactive controls, and sets long-lived cache headers for uploaded listing media. |
| Mobile usability | Navigation, property filters, cards, galleries, dialogs, forms, and admin workflows use responsive layouts and touch-sized controls. |
| Internal links | Homepage expertise cards, related-service cards, listings, area content, header, and footer link the main topics together. |
| Structured data | The site includes RealEstateAgent, Service, FAQPage, Offer, property, CollectionPage, BlogPosting, ItemList, and breadcrumb structured data where appropriate. |
| Clean URLs | Public routes use short descriptive slugs, and listing slugs are editable in the dashboard. |
| Strong calls to action | Every core journey leads to a relevant conversation, evaluation, listing inquiry, phone, or email action. |
| Blog or resources | Implemented as **Market updates**. Ryan can create private drafts, preview, publish, archive, add protected cover images and alt text, cite external sources, add internal links, and edit article-specific metadata from the admin dashboard. Public articles are server rendered and internally linked. |
| Technical SEO | Sitemap, listing and article images in the sitemap, robots rules, HTTPS launch checks, canonical tags, metadata, security headers, and permanent legacy redirects are implemented. |

## Launch follow-through

- Create and verify the `ryanstulp.ca` Search Console domain property.
- Submit `/sitemap.xml` after the production domain is connected.
- Validate representative structured data and canonical tags on production.
- Confirm the old URL redirect and intentional 410 inventory after cutover.
- Record the initial Search Console and GA4 baseline.
- Ask the SEO team for its priority keyword and community list before creating
  individual community pages.
