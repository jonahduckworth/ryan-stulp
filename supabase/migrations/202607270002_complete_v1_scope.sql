begin;

alter table public.listings
  add column if not exists address_line_2 text,
  add column if not exists listing_type text not null default 'residential',
  add column if not exists neighbourhood text,
  add column if not exists mls_number text,
  add column if not exists year_built integer,
  add column if not exists cta_label text,
  add column if not exists cta_destination text,
  add column if not exists featured boolean not null default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists social_image_url text;

alter table public.listings
  drop constraint if exists listings_listing_type_check,
  add constraint listings_listing_type_check
    check (listing_type in ('residential', 'commercial', 'rural'));

alter table public.listings
  drop constraint if exists listings_year_built_check,
  add constraint listings_year_built_check
    check (
      year_built is null
      or year_built between 1800 and extract(year from now())::integer + 2
    );

create index if not exists listings_featured_public_idx
  on public.listings (featured desc, published_at desc)
  where published_at is not null and status in ('active', 'pending', 'sold');

alter table public.listing_media
  add column if not exists caption text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists listing_media_updated_at on public.listing_media;
create trigger listing_media_updated_at before update on public.listing_media
for each row execute function public.set_updated_at();

create unique index if not exists listing_media_one_featured_idx
  on public.listing_media (listing_id)
  where is_featured;

alter table public.leads
  drop constraint if exists leads_status_check;

update public.leads set status = 'won' where status = 'closed';

alter table public.leads
  add constraint leads_status_check
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'archived')),
  add column if not exists listing_id uuid references public.listings(id) on delete set null,
  add column if not exists page_url text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists consent_version text not null default '2026-07-27';

create index if not exists leads_listing_idx
  on public.leads (listing_id, created_at desc);

alter table public.site_settings
  add column if not exists public_email text,
  add column if not exists facebook_url text,
  add column if not exists booking_url text,
  add column if not exists brokerage_name text,
  add column if not exists brokerage_address text,
  add column if not exists licensed_name text,
  add column if not exists homepage_eyebrow text,
  add column if not exists homepage_title text,
  add column if not exists homepage_description text;

update public.site_settings
set
  notification_email = coalesce(notification_email, 'ryanstulp@gmail.com'),
  public_email = coalesce(public_email, 'ryanstulp@gmail.com'),
  phone_display = coalesce(phone_display, '(587) 839-1432'),
  facebook_url = coalesce(
    facebook_url,
    'https://www.facebook.com/ryanstulprealtor'
  ),
  brokerage_name = coalesce(brokerage_name, 'The Real Estate District'),
  brokerage_address = coalesce(
    brokerage_address,
    '#375 7220 Fisher St SE, Calgary, AB T2H 2H8'
  ),
  licensed_name = coalesce(licensed_name, 'Ryan Andrew Stulp'),
  homepage_eyebrow = coalesce(
    homepage_eyebrow,
    'Calgary and area real estate'
  ),
  homepage_title = coalesce(
    homepage_title,
    'Make your next move with clarity.'
  ),
  homepage_description = coalesce(
    homepage_description,
    'Whether you are buying your first home, selling, investing, or planning a development, Ryan gives you a clear read on the market and a practical path forward.'
  )
where id = true;

drop policy if exists "Public settings are readable" on public.site_settings;
create policy "Public settings are readable"
on public.site_settings for select to anon
using (id = true);

drop trigger if exists audit_listing_media on public.listing_media;
create trigger audit_listing_media
after insert or update or delete on public.listing_media
for each row execute function public.record_audit_event();

commit;
