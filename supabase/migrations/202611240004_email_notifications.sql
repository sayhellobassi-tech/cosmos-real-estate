create table public.enquiry_notifications (
 enquiry_id uuid primary key references public.enquiries(id) on delete cascade,
 status text not null default 'pending' check(status in('pending','sending','sent','failed')),
 attempts integer not null default 0, last_attempt_at timestamptz, sent_at timestamptz, provider_id text
);
alter table public.enquiry_notifications enable row level security;
revoke all on public.enquiry_notifications from anon,authenticated;
grant select on public.enquiry_notifications to authenticated;
create policy notifications_admin_read on public.enquiry_notifications for select to authenticated using((select public.is_cosmos_admin()));
create function private.queue_enquiry_email() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.enquiry_notifications(enquiry_id) values(NEW.id);return NEW;end;$$;
create trigger queue_enquiry_email after insert on public.enquiries for each row execute function private.queue_enquiry_email();
create function public.claim_enquiry_email(p_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare claimed uuid;
begin
 update public.enquiry_notifications set status='sending',attempts=attempts+1,last_attempt_at=now()
 where enquiry_id=p_id and (status in('pending','failed') or (status='sending' and last_attempt_at<now()-interval '2 minutes')) returning enquiry_id into claimed;
 return claimed is not null;
end;$$;
revoke all on function public.claim_enquiry_email(uuid) from public,anon,authenticated;
grant execute on function public.claim_enquiry_email(uuid) to service_role;
