begin;

create or replace function public.register_listing_media(
  target_listing_id uuid,
  target_storage_path text,
  target_public_url text,
  target_alt_text text
)
returns setof public.listing_media
language plpgsql
security invoker
set search_path = ''
as $$
declare
  next_sort_order integer;
  should_feature boolean;
  inserted_media public.listing_media;
begin
  if not public.is_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;

  perform 1
  from public.listings
  where id = target_listing_id
  for update;

  if not found then
    raise exception 'listing_not_found' using errcode = 'P0002';
  end if;

  if target_storage_path not like target_listing_id::text || '/%'
     or position('..' in target_storage_path) > 0 then
    raise exception 'invalid_listing_media_path' using errcode = '22023';
  end if;

  select
    coalesce(max(sort_order), -1) + 1,
    count(*) = 0
  into next_sort_order, should_feature
  from public.listing_media
  where listing_id = target_listing_id;

  insert into public.listing_media (
    listing_id,
    storage_path,
    public_url,
    alt_text,
    sort_order,
    is_featured
  )
  values (
    target_listing_id,
    target_storage_path,
    target_public_url,
    target_alt_text,
    next_sort_order,
    should_feature
  )
  returning * into inserted_media;

  if should_feature then
    update public.listings
    set cover_image_url = target_public_url
    where id = target_listing_id;
  end if;

  return next inserted_media;
end;
$$;

create or replace function public.set_listing_featured_media(
  target_listing_id uuid,
  target_media_id uuid
)
returns setof public.listing_media
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_media public.listing_media;
begin
  if not public.is_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;

  perform 1
  from public.listings
  where id = target_listing_id
  for update;

  if not found then
    raise exception 'listing_not_found' using errcode = 'P0002';
  end if;

  select *
  into selected_media
  from public.listing_media
  where id = target_media_id
    and listing_id = target_listing_id
  for update;

  if not found then
    raise exception 'listing_media_not_found' using errcode = 'P0002';
  end if;

  update public.listing_media
  set is_featured = false
  where listing_id = target_listing_id
    and is_featured;

  update public.listing_media
  set is_featured = true
  where id = target_media_id
  returning * into selected_media;

  update public.listings
  set cover_image_url = selected_media.public_url
  where id = target_listing_id;

  return next selected_media;
end;
$$;

create or replace function public.delete_listing_media(
  target_listing_id uuid,
  target_media_id uuid
)
returns table (
  deleted_storage_path text,
  replacement_media_id uuid,
  replacement_public_url text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  listing_status text;
  listing_published_at timestamptz;
  selected_media public.listing_media;
  replacement_media public.listing_media;
  remaining_count integer;
begin
  if not public.is_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;

  select status, published_at
  into listing_status, listing_published_at
  from public.listings
  where id = target_listing_id
  for update;

  if not found then
    raise exception 'listing_not_found' using errcode = 'P0002';
  end if;

  select *
  into selected_media
  from public.listing_media
  where id = target_media_id
    and listing_id = target_listing_id
  for update;

  if not found then
    raise exception 'listing_media_not_found' using errcode = 'P0002';
  end if;

  select count(*)
  into remaining_count
  from public.listing_media
  where listing_id = target_listing_id
    and id <> target_media_id;

  if selected_media.is_featured
     and remaining_count = 0
     and listing_published_at is not null
     and listing_status in ('active', 'pending', 'sold') then
    raise exception 'public_listing_requires_featured_media'
      using errcode = '23514';
  end if;

  delete from public.listing_media
  where id = target_media_id;

  replacement_media := null;
  if selected_media.is_featured then
    select *
    into replacement_media
    from public.listing_media
    where listing_id = target_listing_id
    order by sort_order, created_at
    limit 1
    for update;

    if found then
      update public.listing_media
      set is_featured = true
      where id = replacement_media.id
      returning * into replacement_media;
    end if;

    update public.listings
    set cover_image_url = replacement_media.public_url
    where id = target_listing_id;
  end if;

  return query
  select
    selected_media.storage_path,
    replacement_media.id,
    replacement_media.public_url;
end;
$$;

revoke all on function public.register_listing_media(uuid, text, text, text)
  from public, anon;
revoke all on function public.set_listing_featured_media(uuid, uuid)
  from public, anon;
revoke all on function public.delete_listing_media(uuid, uuid)
  from public, anon;

grant execute on function public.register_listing_media(uuid, text, text, text)
  to authenticated;
grant execute on function public.set_listing_featured_media(uuid, uuid)
  to authenticated;
grant execute on function public.delete_listing_media(uuid, uuid)
  to authenticated;

commit;
