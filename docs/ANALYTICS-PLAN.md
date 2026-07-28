# Analytics plan

Last verified: July 28, 2026.

## Property and stream

- Google Analytics account: `MateoSEO`
- GA4 property: `ryanstulp.ca`
- Property ID: `508294550`
- Web stream ID: `12280830039`
- Measurement ID: `G-ZPHYKZLE2P`
- Current state: the existing website stream is receiving data.

The measurement ID is configured for local acceptance testing. Add the same
public value to the production preview only when that environment is ready.

## Events implemented

| Event | Trigger | Useful parameters |
| --- | --- | --- |
| `page_view` | GA4 page measurement | Standard GA4 page fields |
| `view_listing` | Public listing detail loads | `listing_id`, `listing_status` |
| `generate_lead` | A valid inquiry reaches its thank-you page | `lead_type` |
| `listing_inquiry_click` | Listing-specific inquiry button | `link_path`, `link_text`, `link_location` |
| `cta_click` | General primary or secondary button | `link_path`, `link_text`, `link_location` |
| `phone_click` | Telephone link | `link_text`, `link_location` |
| `email_click` | Email link | `link_text`, `link_location` |
| `google_reviews_click` | Google reviews link | `link_text`, `link_location` |

GA4 enhanced measurement is enabled on the existing stream for page views,
scrolls, outbound clicks, and its other standard interactions.

Analytics events must not include names, email addresses, phone numbers, street
addresses, message text, or other lead-entered data.

## Launch baseline

Record these values immediately before the new site is connected, then compare
them after 7 and 30 days:

- active users and sessions;
- organic users and sessions;
- top landing pages;
- total lead thank-you events by `lead_type`;
- listing views and listing-inquiry clicks;
- phone, email, and general CTA clicks;
- Search Console clicks, impressions, average position, and indexed-page count;
- Google Business Profile calls, website clicks, directions, and messages.

The pre-launch baseline can only be finalized against the live property. The
new site has not been deployed, so no new-site production baseline exists yet.

## Acceptance checks

- Confirm the production preview sends a DebugView event to property
  `508294550`.
- Confirm one test of each inquiry type records `generate_lead` exactly once.
- Confirm the URL and event payloads contain no personal information.
- Mark `generate_lead` as a key event in GA4 after the preview test succeeds.
- Annotate the cutover date in the launch report.
- Capture the 7-day and 30-day summaries using the baseline fields above.
