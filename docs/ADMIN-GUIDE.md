# Ryan's admin guide

The private dashboard is available at `/admin`. In production, use:

`https://ryanstulp.ca/admin`

Until the domain is connected, the staging dashboard is:

`https://ryan-stulp.vercel.app/admin`

## Listings

Open **Listings** to create, edit, duplicate, preview, publish, archive, or
permanently delete a property.

1. Choose **Add listing**.
2. Enter the public property details. The title, address, price, status, and
   description are the core fields.
3. Upload the property photos. Add useful alt text for accessibility, choose the
   featured image, and drag or use the ordering controls to set gallery order.
4. Save as **Draft** while the listing is being prepared.
5. Use **Preview** to inspect a draft without making it public.
6. Change the status to **Active** when it is ready for the website.

Use **Duplicate** when a new property has a similar structure. The copy remains
a draft until it is reviewed and published. **Archive** removes a listing from
the public site without deleting its history.

The **Featured** switch controls which active properties appear first on the
home page. The SEO title, SEO description, and social image fields are optional;
the site generates sensible defaults when they are blank.

## Leads

Every successful contact, home-evaluation, and listing inquiry appears under
**Leads**. Open a lead to:

- call or email the person;
- see the inquiry source, related listing, and campaign attribution;
- add private follow-up notes; and
- move it through New, Contacted, Qualified, Won, Lost, or Archived.

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
