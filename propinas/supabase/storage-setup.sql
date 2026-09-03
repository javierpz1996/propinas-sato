-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- Crea el bucket "uploads" (público) y las políticas para subir, leer y borrar.

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update
set public = true;

-- Lectura pública de archivos
create policy "Public read uploads"
on storage.objects
for select
to public
using (bucket_id = 'uploads');

-- Subida desde el cliente (anon key)
create policy "Public upload uploads"
on storage.objects
for insert
to public
with check (bucket_id = 'uploads');

-- Borrado desde el panel de administración
create policy "Public delete uploads"
on storage.objects
for delete
to public
using (bucket_id = 'uploads');
