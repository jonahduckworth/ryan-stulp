begin;

create table public.newsletter_consent_batches (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  confirmed_by text not null,
  confirmation_note text not null,
  confirmed_at timestamptz not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.newsletter_signup_attempts (
  id bigint generated always as identity primary key,
  request_fingerprint text not null,
  created_at timestamptz not null default now()
);

create index newsletter_signup_attempts_rate_limit_idx
  on public.newsletter_signup_attempts (request_fingerprint, created_at desc);

create table public.newsletter_contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  email text not null unique,
  subscription_status text not null default 'subscribed'
    check (subscription_status in ('subscribed', 'unsubscribed', 'suppressed')),
  consent_source text not null
    check (consent_source in ('existing_client_batch', 'public_signup', 'admin_added')),
  consent_confirmed_by text not null,
  consent_confirmed_at timestamptz not null,
  consent_batch_id uuid references public.newsletter_consent_batches(id) on delete set null,
  unsubscribed_at timestamptz,
  suppressed_at timestamptz,
  suppression_reason text,
  resend_contact_id text unique,
  resend_sync_status text not null default 'pending'
    check (resend_sync_status in ('pending', 'synced', 'failed')),
  resend_sync_error text,
  last_delivery_status text
    check (
      last_delivery_status is null
      or last_delivery_status in (
        'scheduled', 'sent', 'delivered', 'delivery_delayed',
        'bounced', 'failed', 'suppressed', 'complained'
      )
    ),
  last_delivery_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_contacts_email_normalized check (
    email = lower(trim(email)) and position('@' in email) > 1
  ),
  constraint newsletter_contacts_unsubscribe_state check (
    (subscription_status = 'unsubscribed' and unsubscribed_at is not null)
    or (subscription_status <> 'unsubscribed' and unsubscribed_at is null)
  ),
  constraint newsletter_contacts_suppression_state check (
    (subscription_status = 'suppressed' and suppressed_at is not null)
    or (subscription_status <> 'suppressed' and suppressed_at is null)
  )
);

create index newsletter_contacts_status_idx
  on public.newsletter_contacts (subscription_status, updated_at desc);
create index newsletter_contacts_delivery_idx
  on public.newsletter_contacts (last_delivery_status, last_delivery_at desc);

create table public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  market_update_id uuid unique references public.market_updates(id) on delete set null,
  market_update_title text not null,
  market_update_slug text not null,
  subject text not null,
  preview_text text not null,
  article_excerpt text not null,
  article_body text not null,
  article_cover_image_url text,
  status text not null default 'prepared'
    check (status in ('prepared', 'sending', 'sent', 'failed')),
  resend_broadcast_id text unique,
  recipient_count integer not null default 0 check (recipient_count >= 0),
  delivered_count integer not null default 0 check (delivered_count >= 0),
  problem_count integer not null default 0 check (problem_count >= 0),
  sent_at timestamptz,
  failure_message text,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_campaigns_sent_state check (
    (status = 'sent' and sent_at is not null)
    or (status <> 'sent')
  )
);

create index newsletter_campaigns_created_idx
  on public.newsletter_campaigns (created_at desc);

create table public.newsletter_deliveries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.newsletter_campaigns(id) on delete cascade,
  contact_id uuid references public.newsletter_contacts(id) on delete set null,
  resend_email_id text not null unique,
  recipient_email text not null,
  status text not null
    check (
      status in (
        'scheduled', 'sent', 'delivered', 'delivery_delayed',
        'bounced', 'failed', 'suppressed', 'complained'
      )
    ),
  status_at timestamptz not null,
  detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_deliveries_email_normalized check (
    recipient_email = lower(trim(recipient_email))
  )
);

create index newsletter_deliveries_campaign_idx
  on public.newsletter_deliveries (campaign_id, status, status_at desc);
create index newsletter_deliveries_contact_idx
  on public.newsletter_deliveries (contact_id, status_at desc);

create table public.resend_webhook_events (
  event_id text primary key,
  event_type text not null,
  event_at timestamptz not null,
  processing_status text not null default 'processing'
    check (processing_status in ('processing', 'processed', 'failed')),
  failure_message text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create trigger newsletter_contacts_updated_at
before update on public.newsletter_contacts
for each row execute function public.set_updated_at();

create trigger newsletter_campaigns_updated_at
before update on public.newsletter_campaigns
for each row execute function public.set_updated_at();

create trigger newsletter_deliveries_updated_at
before update on public.newsletter_deliveries
for each row execute function public.set_updated_at();

create or replace function public.prepare_market_update_newsletter_campaign()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' then
    insert into public.newsletter_campaigns (
      market_update_id,
      market_update_title,
      market_update_slug,
      subject,
      preview_text,
      article_excerpt,
      article_body,
      article_cover_image_url,
      created_by,
      updated_by
    )
    values (
      new.id,
      new.title,
      new.slug,
      new.title,
      new.excerpt,
      new.excerpt,
      new.body,
      new.cover_image_url,
      new.updated_by,
      new.updated_by
    )
    on conflict (market_update_id) do update set
      market_update_title = excluded.market_update_title,
      market_update_slug = excluded.market_update_slug,
      subject = excluded.subject,
      preview_text = excluded.preview_text,
      article_excerpt = excluded.article_excerpt,
      article_body = excluded.article_body,
      article_cover_image_url = excluded.article_cover_image_url,
      updated_by = excluded.updated_by
    where public.newsletter_campaigns.status = 'prepared';
  end if;
  return new;
end;
$$;

create trigger prepare_market_update_newsletter_campaign
after insert or update of status, title, slug, excerpt, body, cover_image_url
on public.market_updates
for each row execute function public.prepare_market_update_newsletter_campaign();

create or replace function public.record_newsletter_delivery_event(
  p_broadcast_id text,
  p_resend_email_id text,
  p_recipient_email text,
  p_status text,
  p_status_at timestamptz,
  p_detail text
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_campaign_id uuid;
  v_contact_id uuid;
begin
  if p_status not in (
    'scheduled', 'sent', 'delivered', 'delivery_delayed',
    'bounced', 'failed', 'suppressed', 'complained'
  ) then
    raise exception 'Unsupported newsletter delivery status';
  end if;

  select id into v_campaign_id
  from public.newsletter_campaigns
  where resend_broadcast_id = p_broadcast_id;

  if v_campaign_id is null then
    return;
  end if;

  select id into v_contact_id
  from public.newsletter_contacts
  where email = lower(trim(p_recipient_email));

  insert into public.newsletter_deliveries (
    campaign_id,
    contact_id,
    resend_email_id,
    recipient_email,
    status,
    status_at,
    detail
  )
  values (
    v_campaign_id,
    v_contact_id,
    p_resend_email_id,
    lower(trim(p_recipient_email)),
    p_status,
    p_status_at,
    p_detail
  )
  on conflict (resend_email_id) do update set
    contact_id = coalesce(excluded.contact_id, public.newsletter_deliveries.contact_id),
    status = excluded.status,
    status_at = excluded.status_at,
    detail = excluded.detail
  where excluded.status_at >= public.newsletter_deliveries.status_at;

  update public.newsletter_campaigns
  set
    delivered_count = (
      select count(*) from public.newsletter_deliveries
      where campaign_id = v_campaign_id and status = 'delivered'
    ),
    problem_count = (
      select count(*) from public.newsletter_deliveries
      where campaign_id = v_campaign_id
        and status in ('bounced', 'failed', 'suppressed', 'complained')
    )
  where id = v_campaign_id;

  if v_contact_id is not null then
    update public.newsletter_contacts
    set
      last_delivery_status = p_status,
      last_delivery_at = p_status_at,
      subscription_status = case
        when p_status in ('bounced', 'suppressed', 'complained') then 'suppressed'
        else subscription_status
      end,
      suppressed_at = case
        when p_status in ('bounced', 'suppressed', 'complained')
          then coalesce(suppressed_at, p_status_at)
        else suppressed_at
      end,
      suppression_reason = case
        when p_status in ('bounced', 'suppressed', 'complained')
          then coalesce(p_detail, p_status)
        else suppression_reason
      end,
      unsubscribed_at = case
        when p_status in ('bounced', 'suppressed', 'complained') then null
        else unsubscribed_at
      end
    where id = v_contact_id
      and (last_delivery_at is null or p_status_at >= last_delivery_at);
  end if;
end;
$$;

alter table public.newsletter_consent_batches enable row level security;
alter table public.newsletter_signup_attempts enable row level security;
alter table public.newsletter_contacts enable row level security;
alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_deliveries enable row level security;
alter table public.resend_webhook_events enable row level security;

create policy "Admins manage newsletter consent batches"
on public.newsletter_consent_batches for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage newsletter contacts"
on public.newsletter_contacts for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage newsletter campaigns"
on public.newsletter_campaigns for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Admins read newsletter deliveries"
on public.newsletter_deliveries for select to authenticated
using (public.is_admin());

grant select, insert, update, delete
on table public.newsletter_consent_batches to authenticated;
grant select, insert, update, delete
on table public.newsletter_contacts to authenticated;
grant select, insert, update, delete
on table public.newsletter_campaigns to authenticated;
grant select on table public.newsletter_deliveries to authenticated;

revoke all on function public.record_newsletter_delivery_event(
  text, text, text, text, timestamptz, text
) from public, anon, authenticated;
grant execute on function public.record_newsletter_delivery_event(
  text, text, text, text, timestamptz, text
) to service_role;

commit;
