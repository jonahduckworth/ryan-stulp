begin;

create table public.market_updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null,
  body text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  author_name text not null default 'Ryan Stulp',
  cover_image_url text,
  cover_image_path text unique,
  cover_image_alt text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint market_updates_publication_check check (
    status <> 'published' or published_at is not null
  ),
  constraint market_updates_cover_fields_check check (
    (cover_image_url is null and cover_image_path is null and cover_image_alt is null)
    or (
      cover_image_url is not null
      and cover_image_path is not null
      and cover_image_alt is not null
      and length(trim(cover_image_alt)) >= 3
    )
  )
);

create index market_updates_public_idx
  on public.market_updates (published_at desc)
  where status = 'published' and published_at is not null;

create trigger market_updates_updated_at
before update on public.market_updates
for each row execute function public.set_updated_at();

create trigger audit_market_updates
after insert or update or delete on public.market_updates
for each row execute function public.record_audit_event();

alter table public.market_updates enable row level security;

create policy "Published market updates are public"
on public.market_updates for select to anon, authenticated
using (status = 'published' and published_at is not null);

create policy "Admins manage market updates"
on public.market_updates for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant select on table public.market_updates to anon;
grant select, insert, update, delete
on table public.market_updates to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'market-update-media',
  'market-update-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public market update images are readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'market-update-media');

create policy "Admins upload market update images"
on storage.objects for insert to authenticated
with check (bucket_id = 'market-update-media' and public.is_admin());

create policy "Admins update market update images"
on storage.objects for update to authenticated
using (bucket_id = 'market-update-media' and public.is_admin())
with check (bucket_id = 'market-update-media' and public.is_admin());

create policy "Admins delete market update images"
on storage.objects for delete to authenticated
using (bucket_id = 'market-update-media' and public.is_admin());

commit;
