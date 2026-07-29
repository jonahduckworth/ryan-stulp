# Ryan's admin guide

The private dashboard is available at `/admin`. In production, use:

`https://ryanstulp.ca/admin`

Until the domain is connected, the staging dashboard is:

`https://ryan-stulp.vercel.app/admin`

## Listings

Open **Listings** to create, edit, duplicate, preview, publish, archive, or
permanently delete a property.

1. Choose **Add listing**.
2. Enter the property details. The page URL is generated from the address, but
   it can be edited before the listing is published.
3. Choose Residential, Commercial, or Rural to expose the details relevant to
   that property type. Assign the matching website area when it is known.
4. Choose **Create draft and add photos**. New listings always begin privately.
5. Upload the approved property photos. Add useful alt text and captions,
   choose the featured image, and use the ordering controls to set gallery
   order.
6. Use **Preview** to inspect the complete draft without making it public.
7. Change the status to **Active** when it is ready for the website. Publishing
   requires a featured image and displays a confirmation first.

Use **Duplicate** when a new property has a similar structure. The copy remains
a draft until it is reviewed and published. **Archive** removes a listing from
the public site without deleting its history.

The **Featured** switch controls which active properties appear first on the
home page. The SEO title, SEO description, and social image fields are optional;
the site generates sensible defaults when they are blank.

Use the Listings filters to search by title, address, community, or MLS number,
or to narrow the table by publication status and property category.

## Leads

Every successful contact, home-evaluation, and listing inquiry appears under
**Leads**. Open a lead to:

- call or email the person;
- see the inquiry source, related listing, and campaign attribution;
- add private follow-up notes; and
- move it through New, Contacted, Qualified, Won, Lost, or Archived.

Use the Leads filters to search by contact or property and narrow the inbox by
status or intent.

The CSV export is intended for Ryan's private business records. Treat exports as
confidential because they contain personal information.

When email notifications are enabled, the dashboard remains the source of truth
if an alert is delayed or filtered as spam.

## Site settings

Use **Settings** to update Ryan's public phone number, email, Facebook and
booking links, brokerage identity, office address, and selected home-page copy.
Changes affect the public site after saving.

Licensed name, brokerage, and office-address changes should only be made after
confirming the exact wording required by Ryan's brokerage and RECA.

## Account and safety

- Use a unique password and save it in a password manager.
- Do not share the administrator login.
- Sign out on shared devices.
- Never paste a Supabase service-role key, Resend key, or Turnstile secret into
  a listing, lead note, or browser form.
- Contact Jonah if the dashboard behaves unexpectedly instead of retrying a
  destructive action.

## Regular routine

1. Review new leads daily.
2. Keep listing statuses current.
3. Confirm every newly published property on both desktop and mobile.
4. Archive sold or withdrawn properties when they should no longer be promoted.
5. Report reproducible defects during the included 30-day post-launch bug-fix
   period.
