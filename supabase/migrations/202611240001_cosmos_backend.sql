create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.admin_accounts(email text primary key check(email=lower(email)));
insert into private.admin_accounts(email) values('mngmntstd@gmail.com');
create or replace function public.is_cosmos_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.users u join private.admin_accounts a on a.email=lower(u.email) where u.id=auth.uid() and u.email_confirmed_at is not null);
$$;
revoke all on function public.is_cosmos_admin() from public;
grant execute on function public.is_cosmos_admin() to authenticated;
create table public.properties(
 id text primary key check(id ~ '^[A-Za-z0-9-]{1,40}$'),
 slug text unique not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)<=100),
 name text not null check(length(name) between 1 and 150),
 country text not null check(length(country) between 1 and 100), city text not null check(length(city) between 1 and 100),
 kind text not null check(kind in('sale','rent')), type text not null check(type in('villa','house','apartment')),
 beds integer not null check(beds between 0 and 100), baths integer not null check(baths between 0 and 100),
 area numeric not null check(area>0 and area<10000000), price numeric not null check(price>=0 and price<100000000000),
 image integer not null default 1 check(image between 1 and 6),
 images jsonb not null default '[]' check(jsonb_typeof(images)='array' and jsonb_array_length(images)<=12),
 amenities text[] not null default '{}', description text not null default '' check(length(description)<=6000),
 tag text not null default '', is_sample boolean not null default true,
 status text not null default 'draft' check(status in('draft','published','archived')),
 availability text not null default 'available' check(availability in('available','under_offer','sold','rented')),
 sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.site_settings(
 id integer primary key default 1 check(id=1), contact_email text not null check(contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 whatsapp_number text not null check(whatsapp_number ~ '^[1-9][0-9]{7,14}$'),
 primary_color text not null default '#173a32' check(primary_color ~ '^#[0-9a-fA-F]{6}$'),
 accent_color text not null default '#d6b879' check(accent_color ~ '^#[0-9a-fA-F]{6}$'), updated_at timestamptz not null default now()
);
insert into public.site_settings(id,contact_email,whatsapp_number) values(1,'mngmntstd@gmail.com','233501206171');
create table public.enquiries(
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique,
 name text not null check(length(name) between 2 and 100), email text not null check(length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 property_id text references public.properties(id) on delete set null,
 message text not null check(length(message) between 10 and 4000),
 status text not null default 'new' check(status in('new','in_progress','closed','spam')),
 notes text not null default '' check(length(notes)<=6000), locale text not null default 'en' check(locale in('en','fr','es','ar')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.audit_log(id bigint generated always as identity primary key,actor_id uuid,entity text not null,record_id text,action text not null,created_at timestamptz not null default now());
create function private.record_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='UPDATE' then NEW.updated_at=now(); end if;
 insert into public.audit_log(actor_id,entity,record_id,action) values(auth.uid(),TG_TABLE_NAME,coalesce(NEW.id::text,OLD.id::text),TG_OP);
 if TG_OP='DELETE' then return OLD; else return NEW; end if;
end;$$;
create trigger property_audit before insert or update or delete on public.properties for each row execute function private.record_change();
create trigger settings_audit before update on public.site_settings for each row execute function private.record_change();
create trigger enquiry_audit before insert or update on public.enquiries for each row execute function private.record_change();
alter table public.properties enable row level security;
alter table public.site_settings enable row level security;
alter table public.enquiries enable row level security;
alter table public.audit_log enable row level security;
revoke all on public.properties,public.site_settings,public.enquiries,public.audit_log from anon,authenticated;
grant select on public.properties,public.site_settings to anon,authenticated;
grant insert,update,delete on public.properties to authenticated;
grant update on public.site_settings to authenticated;
grant select,update on public.enquiries to authenticated;
grant select on public.audit_log to authenticated;
create policy properties_public on public.properties for select to anon using(status='published');
create policy properties_authenticated on public.properties for select to authenticated using(status='published' or (select public.is_cosmos_admin()));
create policy properties_admin_insert on public.properties for insert to authenticated with check((select public.is_cosmos_admin()));
create policy properties_admin_update on public.properties for update to authenticated using((select public.is_cosmos_admin())) with check((select public.is_cosmos_admin()));
create policy properties_admin_delete on public.properties for delete to authenticated using((select public.is_cosmos_admin()));
create policy settings_read on public.site_settings for select to anon,authenticated using(true);
create policy settings_admin on public.site_settings for update to authenticated using((select public.is_cosmos_admin())) with check((select public.is_cosmos_admin()));
create policy enquiries_admin_read on public.enquiries for select to authenticated using((select public.is_cosmos_admin()));
create policy enquiries_admin_update on public.enquiries for update to authenticated using((select public.is_cosmos_admin())) with check((select public.is_cosmos_admin()));
create policy audit_admin on public.audit_log for select to authenticated using((select public.is_cosmos_admin()));
create index properties_public_order on public.properties(status,sort_order);
create index enquiries_created on public.enquiries(created_at desc);
create index enquiries_property on public.enquiries(property_id);
create table private.enquiry_limits(key text primary key, started_at timestamptz not null, attempts integer not null);
create function private.take_enquiry_limit(p_key text,p_seconds integer,p_max integer) returns void language plpgsql set search_path='' as $$
declare n integer;
begin
 insert into private.enquiry_limits as l(key,started_at,attempts) values(p_key,now(),1)
 on conflict(key) do update set started_at=case when l.started_at < now()-make_interval(secs=>p_seconds) then now() else l.started_at end,
 attempts=case when l.started_at < now()-make_interval(secs=>p_seconds) then 1 else l.attempts+1 end returning attempts into n;
 if n>p_max then raise exception 'Too many enquiries. Please try again later.' using errcode='P0001'; end if;
end;$$;
create function public.submit_cosmos_enquiry(p_request_id uuid,p_name text,p_email text,p_property_id text,p_message text,p_locale text,p_ip_hash text)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 select id into result from public.enquiries where request_id=p_request_id;
 if result is not null then return result; end if;
 perform private.take_enquiry_limit('global',86400,200);
 perform private.take_enquiry_limit('email:'||lower(trim(p_email)),3600,3);
 perform private.take_enquiry_limit('ip:'||p_ip_hash,3600,10);
 if p_property_id is not null and not exists(select 1 from public.properties where id=p_property_id and status='published') then raise exception 'Property is not available for enquiry'; end if;
 insert into public.enquiries(request_id,name,email,property_id,message,locale) values(p_request_id,trim(p_name),lower(trim(p_email)),p_property_id,trim(p_message),p_locale) returning id into result;
 return result;
end;$$;
revoke all on function public.submit_cosmos_enquiry(uuid,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_cosmos_enquiry(uuid,text,text,text,text,text,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('property-images','property-images',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy cosmos_images_read on storage.objects for select to anon,authenticated using(bucket_id='property-images');
create policy cosmos_images_insert on storage.objects for insert to authenticated with check(bucket_id='property-images' and (select public.is_cosmos_admin()));
create policy cosmos_images_update on storage.objects for update to authenticated using(bucket_id='property-images' and (select public.is_cosmos_admin())) with check(bucket_id='property-images' and (select public.is_cosmos_admin()));
create policy cosmos_images_delete on storage.objects for delete to authenticated using(bucket_id='property-images' and (select public.is_cosmos_admin()));
