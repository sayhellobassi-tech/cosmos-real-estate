begin;
do $$
declare uid uuid:=gen_random_uuid(); n integer; allowed boolean;
begin
 insert into auth.users(id,email,email_confirmed_at) values(uid,'mngmntstd@gmail.com',now());
 perform set_config('request.jwt.claims',json_build_object('sub',uid,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 if not public.is_cosmos_admin() then raise exception 'Verified owner admin check failed'; end if;
 insert into public.properties(id,slug,name,country,city,kind,type,beds,baths,area,price,status) values('TEST-BACKEND','test-backend','Backend test','Ghana','Accra','sale','house',2,1,100,100,'draft');
 update public.properties set price=200 where id='TEST-BACKEND';
 select price into n from public.properties where id='TEST-BACKEND';
 if n<>200 then raise exception 'Admin update failed'; end if;
 execute 'reset role';
 execute 'set local role anon';
 select count(*) into n from public.properties where id='TEST-BACKEND';
 if n<>0 then raise exception 'Draft exposed to public'; end if;
 execute 'reset role';
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
 execute 'set local role authenticated';
 if public.is_cosmos_admin() then raise exception 'Unrelated account is admin'; end if;
 update public.properties set price=1 where id='TEST-BACKEND';
 get diagnostics n=row_count;
 if n<>0 then raise exception 'Unauthorized update succeeded'; end if;
 execute 'reset role';
end $$;
select 'PASS: verified owner CRUD, draft privacy, non-admin denial; all test data rolled back' as result;
rollback;
