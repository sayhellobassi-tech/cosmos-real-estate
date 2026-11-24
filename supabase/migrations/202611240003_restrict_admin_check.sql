-- Supabase default function privileges may directly grant anon EXECUTE.
revoke all on function public.is_cosmos_admin() from anon;
