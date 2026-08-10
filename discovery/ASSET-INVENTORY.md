# Supplied Asset Inventory

Saved from Ryan's July 24, 2026 email to `discovery/source-assets/`.

## Portraits

| File | Dimensions | Notes |
| --- | ---: | --- |
| `IMG_4641.jpeg` | 2072 × 3108 | Professional seated portrait on a light architectural background. Strong primary About/Contact candidate. |
| `IMG_4642 (7).jpeg` | 2063 × 3094 | Professional portrait variant. Review with Ryan before choosing. |
| `IMG_4644 (5).jpeg` | 2071 × 3106 | Professional portrait variant. Review with Ryan before choosing. |

All three need optimized AVIF/WebP derivatives, responsive sizes, and approved alt text. Preserve the originals.

## Logo and brand files

| File | Type | Notes |
| --- | --- | --- |
| `Logo.png` | 2481 × 3508 PNG | Composite brand sheet containing stacked, icon, and wordmark treatments on white/black/red backgrounds. Not a production-ready transparent logo file. |
| `Extra Logo.png` | 3600 × 4200 PNG | Composite horizontal wordmark sheet on white/black/red backgrounds. Not a production-ready transparent logo file. |
| `logo-source.zip` | ZIP | Contains `Back Card 3.5x2inc.ai` and a PDF. The Illustrator file is the best supplied vector source, but it is a business-card layout rather than a standalone logo package. |
| `logo-vector.zip` | ZIP | Contains front business-card PDFs and PNGs, including a UV print layer. |

Required derivations:

- `logo-horizontal-light.svg`
- `logo-horizontal-dark.svg`
- `logo-stacked-light.svg`
- `logo-stacked-dark.svg`
- `mark.svg`
- transparent PNG fallbacks
- favicon and app-icon sizes
- social-sharing logo treatment

Confirm that Ryan owns or is licensed to use and modify the supplied logo files.

## Listing and marketing examples

| File | Dimensions | Content shown | Use |
| --- | ---: | --- | --- |
| `1827 + 1831 43 Street SE (1).png` | 1080 × 1350 | Listed, $1,238,000 package, 100' × 122' M-C1 assembly, Forest Lawn | Brand/style reference and possible current listing lead; not sufficient listing data by itself. |
| `Unit5 - 7948 51 Street SE.png` | 1080 × 1350 | Listed, $729,000 warehouse, 2313 sq ft, Foothills | Brand/style reference and possible current listing lead; not sufficient listing data by itself. |
| `59 Abbeydale Villas NE.png` | 1080 × 1350 | Just sold, buyer represented | Sold/social-proof example; obtain permission and final property details before publishing. |
| `619 Merrill Drive NE.png` | 1080 × 1350 | Just sold, buyer represented | Sold/social-proof example; obtain permission and final property details before publishing. |

These are flattened social graphics, not raw listing-photo packages. They should guide the visual system but should not be used as the public listing database or treated as current inventory without Ryan's confirmation.

## August 4 branding follow-up

Ryan's August 4 email repeated the three portraits, both composite Ryan Stulp
logo sheets, and both DesignCrowd ZIP files already inventoried above. The new
material was:

| File | Type | Use |
| --- | --- | --- |
| `brokerage-logo-sml-horizontal.png` | Transparent PNG | Small supplied brokerage treatment; retained as an original but not preferred for responsive production rendering. |
| `brokerage-logo-lrg-horizontal.png` | Transparent PNG | Primary Real Estate District brokerage mark for wide layouts. |
| `brokerage-logo-lrg-ex-horizontal.png` | Transparent PNG | Extended horizontal brokerage treatment. |
| `brokerage-logo-lrg-vertical.png` | Transparent PNG | Vertical brokerage treatment for narrow layouts or print. |
| `composite-brand-image.png` | Flattened PNG mockup | Business-card reference only; not a reusable website logo. |
| `designcrowd-brand-preview.jpg` | Flattened JPG mockup | Business-card reference only; not a reusable website logo. |

The composite Ryan Stulp sheets have been separated into transparent horizontal,
stacked, icon, and wordmark PNGs in `public/brand/`. The pure-white sheet
background is removed rather than recoloured so the assets sit cleanly on the
site's warm `#F8F6F2` paper surface and remain reusable on other backgrounds.
The original red and black brand colours are preserved.

`scripts/process-brand-assets.mjs` documents the crops and regenerates the
production assets from the supplied source sheets.

## Missing production assets

- Raw/current listing photo packages with explicit reuse permission.
- Authoritative active/pending/sold listing export.
- Mandatory brokerage disclosure and logo-placement rules.
- Standalone clean vector logo exports; the supplied AI/PDF source is a
  business-card layout, so the current transparent files are clean raster
  derivations rather than true SVG exports.
- Written confirmation that the headshots and logo may be used on the site.
- Final brokerage approval for the selected public Google-review excerpts.
- Additional social profile URLs.
- Approved privacy/disclosure copy.
