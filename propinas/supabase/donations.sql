-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- Pagos oficiales confirmados por el webhook de Mercado Pago.

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  mp_payment_id text not null unique,
  mp_preference_id text,
  image_id uuid references public.images (id) on delete set null,
  amount integer not null,
  currency text not null default 'ARS',
  status text not null,
  payer_email text,
  payment_type text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists donations_image_id_idx on public.donations (image_id);
create index if not exists donations_status_idx on public.donations (status);

alter table public.donations enable row level security;

drop policy if exists "Public read donations" on public.donations;

create policy "Public read donations"
on public.donations
for select
to public
using (true);

-- Inserts/updates solo con service role (webhook). Sin policies de write para anon.
