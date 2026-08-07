create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read site content"
on public.site_content for select
using (true);

create policy "Admins can manage site content"
on public.site_content for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Users can verify their admin record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

create policy "Public can view site images"
on storage.objects for select
using (bucket_id = 'site-images');

create policy "Admins can upload site images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Admins can update site images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Admins can delete site images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);
