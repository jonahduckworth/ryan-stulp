begin;

update storage.buckets
set public = false
where id = 'market-update-media';

drop policy if exists "Public market update images are readable"
on storage.objects;

create policy "Published market update images are readable"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'market-update-media'
  and exists (
    select 1
    from public.market_updates
    where market_updates.id::text = (storage.foldername(name))[1]
      and market_updates.status = 'published'
      and market_updates.published_at is not null
      and market_updates.cover_image_path = storage.objects.name
  )
);

create policy "Admins read market update images"
on storage.objects for select to authenticated
using (bucket_id = 'market-update-media' and public.is_admin());

commit;
