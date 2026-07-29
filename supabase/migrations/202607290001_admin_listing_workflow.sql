begin;

alter table public.listings
  add column if not exists area_key text,
  add column if not exists property_details jsonb not null default '{}'::jsonb;

alter table public.listings
  drop constraint if exists listings_area_key_check,
  add constraint listings_area_key_check
    check (
      area_key is null
      or area_key in (
        'inner-city',
        'northwest',
        'northeast',
        'southwest',
        'southeast',
        'surrounding-area'
      )
    ),
  drop constraint if exists listings_property_details_object_check,
  add constraint listings_property_details_object_check
    check (jsonb_typeof(property_details) = 'object');

create index if not exists listings_area_public_idx
  on public.listings (area_key, published_at desc)
  where published_at is not null and status in ('active', 'pending', 'sold');

commit;
