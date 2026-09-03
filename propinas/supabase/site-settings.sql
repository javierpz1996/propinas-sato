-- Fondo y textos de donación. Si la tabla ya existe, igual corré este archivo.

create table if not exists public.site_settings (
  id text primary key default 'main',
  detail_background_url text,
  detail_background_path text,
  donation_message text not null default 'Invitame un café',
  donation_color text not null default '#ec4899',
  title_color text not null default '#171717',
  description_color text not null default '#525252',
  donation_message_color text not null default '#171717',
  thanks_title text not null default '¡Gracias por tu apoyo!',
  thanks_body text not null default 'Tu donación de {monto} fue recibida correctamente.',
  thanks_message text not null default 'Gracias por invitarme un café ☕💜',
  title_font text not null default 'sans',
  description_font text not null default 'sans',
  donation_message_font text not null default 'sans',
  thanks_title_font text not null default 'sans',
  thanks_body_font text not null default 'sans',
  thanks_message_font text not null default 'sans',
  thanks_title_color text not null default '#171717',
  thanks_body_color text not null default '#525252',
  thanks_message_color text not null default '#171717',
  thanks_card_enabled boolean not null default true,
  thanks_image_url text,
  thanks_image_path text
);

alter table public.site_settings
  add column if not exists donation_message text not null default 'Invitame un café';

alter table public.site_settings
  add column if not exists donation_color text not null default '#ec4899';

alter table public.site_settings
  add column if not exists title_color text not null default '#171717';

alter table public.site_settings
  add column if not exists description_color text not null default '#525252';

alter table public.site_settings
  add column if not exists donation_message_color text not null default '#171717';

alter table public.site_settings
  add column if not exists thanks_title text not null default '¡Gracias por tu apoyo!';

alter table public.site_settings
  add column if not exists thanks_body text not null default 'Tu donación de {monto} fue recibida correctamente.';

alter table public.site_settings
  add column if not exists thanks_message text not null default 'Gracias por invitarme un café ☕💜';

alter table public.site_settings
  add column if not exists title_font text not null default 'sans';

alter table public.site_settings
  add column if not exists description_font text not null default 'sans';

alter table public.site_settings
  add column if not exists donation_message_font text not null default 'sans';

alter table public.site_settings
  add column if not exists thanks_title_font text not null default 'sans';

alter table public.site_settings
  add column if not exists thanks_body_font text not null default 'sans';

alter table public.site_settings
  add column if not exists thanks_message_font text not null default 'sans';

alter table public.site_settings
  add column if not exists thanks_title_color text not null default '#171717';

alter table public.site_settings
  add column if not exists thanks_body_color text not null default '#525252';

alter table public.site_settings
  add column if not exists thanks_message_color text not null default '#171717';

alter table public.site_settings
  add column if not exists thanks_card_enabled boolean not null default true;

alter table public.site_settings
  add column if not exists thanks_image_url text;

alter table public.site_settings
  add column if not exists thanks_image_path text;

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public read settings" on public.site_settings;
drop policy if exists "Public update settings" on public.site_settings;
drop policy if exists "Public insert settings" on public.site_settings;

create policy "Public read settings"
on public.site_settings
for select
to public
using (true);

create policy "Public insert settings"
on public.site_settings
for insert
to public
with check (true);

create policy "Public update settings"
on public.site_settings
for update
to public
using (true);
