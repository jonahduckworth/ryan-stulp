begin;

grant select, insert, update, delete
on table public.newsletter_consent_batches to service_role;
grant select, insert, update, delete
on table public.newsletter_signup_attempts to service_role;
grant select, insert, update, delete
on table public.newsletter_contacts to service_role;
grant select, insert, update, delete
on table public.newsletter_campaigns to service_role;
grant select, insert, update, delete
on table public.newsletter_deliveries to service_role;
grant select, insert, update, delete
on table public.resend_webhook_events to service_role;

commit;
