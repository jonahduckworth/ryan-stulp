begin;

-- Data API permissions are a forward migration so projects that already ran
-- the initial schema receive the same grants as newly provisioned projects.
grant select on table public.listings, public.listing_media to anon;

grant select, insert, update, delete
on table
  public.profiles,
  public.listings,
  public.listing_media,
  public.leads,
  public.site_settings
to authenticated;

grant select on table public.audit_events to authenticated;
grant execute on function public.is_admin() to authenticated;
grant select, insert on table public.leads to service_role;

revoke all
on table
  public.profiles,
  public.leads,
  public.site_settings,
  public.audit_events
from anon;

-- Anonymous visitors need only the fields that render on the public website.
-- Keep delivery addresses and audit ownership private.
grant select (
  id,
  public_email,
  phone_display,
  facebook_url,
  booking_url,
  brokerage_name,
  brokerage_address,
  licensed_name,
  homepage_eyebrow,
  homepage_title,
  homepage_description
)
on table public.site_settings
to anon;

drop policy if exists "Public settings are readable" on public.site_settings;
create policy "Public settings are readable"
on public.site_settings for select to anon
using (id = true);

commit;
