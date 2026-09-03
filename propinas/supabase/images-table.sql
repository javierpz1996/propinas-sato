-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- Guarda título y descripción de cada imagen.

create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  file_path text not null,
  url text not null,
  original_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.images enable row level security;

drop policy if exists "Public read images" on public.images;
drop policy if exists "Public insert images" on public.images;
drop policy if exists "Public delete images" on public.images;

create policy "Public read images"
on public.images
for select
to public
using (true);

create policy "Public insert images"
on public.images
for insert
to public
with check (true);

create policy "Public delete images"
on public.images
for delete
to public
using (true);
