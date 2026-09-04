# Supabase setup

1. Create a Supabase project in Canada where available.
2. Run every file in `supabase/migrations` in filename order in the SQL editor.
3. In Authentication, create Ryan's administrator account with email and password.
4. Promote only that user:

```sql
update public.profiles
set role = 'admin', display_name = 'Ryan Stulp'
where id = (
  select id from auth.users where email = 'ryanstulp@gmail.com'
);
```

5. Put the project URL, anon key, and service-role key in the deployment
   environment. Never expose the service-role key to the browser.
6. Confirm the `listing-media` and `market-update-media` buckets exist and are
   public.
7. Sign in at `/admin/login`, create a draft listing, continue to its gallery,
   upload multiple images, set the featured image, publish it, and verify the
   public page.
8. Create a private market-update draft, preview it, publish it, and confirm the
   archive and article page before removing the test content.
9. After the email-marketing migration is applied and Resend is configured,
   validate the subscriber import in dry-run mode before approving `--apply`.
10. Publish a disposable market update, send a test campaign, and verify signed
    webhook delivery statuses before approving a live-list send.

The service-role key is used only by server-side public submissions, the guarded
newsletter import, and signed Resend webhook processing. Admin listing,
market-update, contact, campaign, and lead operations use the signed-in Ryan
session plus row-level security.
