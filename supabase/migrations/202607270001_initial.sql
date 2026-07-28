begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Administrator',
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  address text not null,
  city text not null default 'Calgary',
  province text not null default 'AB',
  postal_code text,
  price integer check (price is null or price >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'pending', 'sold', 'archived')),
  property_type text not null default 'Residential',
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms numeric(4,1) check (bathrooms is null or bathrooms >= 0),
  square_feet integer check (square_feet is null or square_feet > 0),
  description text not null,
  features text[] not null default '{}',
  cover_image_url text,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint public_status_requires_publication check (
    status not in ('active', 'pending', 'sold') or published_at is not null
  )
);

create table public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  intent text not null
    check (intent in ('buy', 'sell', 'invest', 'commercial', 'general')),
  message text not null,
  property_address text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed', 'archived')),
  source text not null,
  notes text,
  request_fingerprint text not null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id boolean primary key default true check (id),
  notification_email text,
  phone_display text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index listings_public_idx
  on public.listings (published_at desc)
  where published_at is not null and status in ('active', 'pending', 'sold');
create index leads_created_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status, created_at desc);
create index leads_rate_limit_idx on public.leads (request_fingerprint, created_at desc);
create index listing_media_listing_idx on public.listing_media (listing_id, sort_order);
create index audit_events_record_idx on public.audit_events (table_name, record_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger listings_updated_at before update on public.listings
for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.record_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id uuid;
begin
  target_id := coalesce(new.id, old.id);
  insert into public.audit_events (
    actor_id,
    table_name,
    record_id,
    action,
    before_data,
    after_data
  )
  values (
    auth.uid(),
    tg_table_name,
    target_id,
    lower(tg_op),
    case when tg_op in ('UPDATE', 'DELETE')
      then to_jsonb(old) - 'request_fingerprint'
      else null
    end,
    case when tg_op in ('INSERT', 'UPDATE')
      then to_jsonb(new) - 'request_fingerprint'
      else null
    end
  );
  return coalesce(new, old);
end;
$$;

create trigger audit_listings
after insert or update or delete on public.listings
for each row execute function public.record_audit_event();

create trigger audit_lead_updates
after update or delete on public.leads
for each row execute function public.record_audit_event();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_events enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());
create policy "Admins manage profiles"
on public.profiles for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Published listings are public"
on public.listings for select to anon, authenticated
using (published_at is not null and status in ('active', 'pending', 'sold'));
create policy "Admins manage listings"
on public.listings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public media rows are readable"
on public.listing_media for select to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_media.listing_id
      and listings.published_at is not null
      and listings.status in ('active', 'pending', 'sold')
  )
);
create policy "Admins manage listing media"
on public.listing_media for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage leads"
on public.leads for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage settings"
on public.site_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "Admins read audit events"
on public.audit_events for select to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-media',
  'listing-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public listing images are readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'listing-media');
create policy "Admins upload listing images"
on storage.objects for insert to authenticated
with check (bucket_id = 'listing-media' and public.is_admin());
create policy "Admins update listing images"
on storage.objects for update to authenticated
using (bucket_id = 'listing-media' and public.is_admin())
with check (bucket_id = 'listing-media' and public.is_admin());
create policy "Admins delete listing images"
on storage.objects for delete to authenticated
using (bucket_id = 'listing-media' and public.is_admin());

insert into public.site_settings (id) values (true)
on conflict (id) do nothing;

commit;
