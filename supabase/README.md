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
6. Confirm the `listing-media` bucket exists and is public.
7. Sign in at `/admin/login`, create a draft listing, continue to its gallery,
   upload multiple images, set the featured image, publish it, and verify the
   public page.

The service-role key is used only by the server-side lead submission action.
Admin listing and lead operations use the signed-in Ryan session plus row-level
security.
