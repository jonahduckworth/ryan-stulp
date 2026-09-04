begin;

revoke all privileges on table public.newsletter_consent_batches from service_role;
revoke all privileges on table public.newsletter_signup_attempts from service_role;
revoke all privileges on table public.newsletter_contacts from service_role;
revoke all privileges on table public.newsletter_campaigns from service_role;
revoke all privileges on table public.newsletter_deliveries from service_role;
revoke all privileges on table public.resend_webhook_events from service_role;

grant select, insert on table public.newsletter_consent_batches to service_role;
grant select, insert on table public.newsletter_signup_attempts to service_role;
grant select, insert, update on table public.newsletter_contacts to service_role;
grant select, update on table public.newsletter_campaigns to service_role;
grant select, insert, update on table public.newsletter_deliveries to service_role;
grant select, insert, update on table public.resend_webhook_events to service_role;

commit;
