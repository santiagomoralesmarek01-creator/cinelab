-- CineLab · fotos, firma de artículos y moderación del admin
-- Ejecutar en el SQL Editor DESPUÉS de schema.sql y admin.sql (una sola vez).

-- Foto opcional en cada reseña y foto de perfil.
alter table public.reviews add column if not exists photo_url text;
alter table public.profiles add column if not exists avatar_url text;

-- Cada usuario puede cambiar solo su nombre y su foto de perfil (nunca is_admin).
grant update (username, avatar_url) on public.profiles to authenticated;

-- El admin puede cambiar la foto de cualquier reseña y borrar reseñas (moderación).
drop policy if exists "admin edita reseñas" on public.reviews;
drop policy if exists "admin borra reseñas" on public.reviews;
create policy "admin edita reseñas" on public.reviews for update
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin borra reseñas" on public.reviews for delete
  using ((select public.is_admin()));

-- Contenido que el admin edita desde el sitio:
--   img:item:<id>        foto de una película o serie
--   img:article:<id>     foto de portada de un artículo
--   author:article:<id>  firma de un artículo
--   author:item:<id>     firma de la reseña del equipo de un título
--   author:review:<id>   firma (nombre y apellido) de una reseña publicada desde la cuenta del equipo
create table if not exists public.site_content (
  key text primary key check (char_length(key) <= 120),
  value text not null check (char_length(value) <= 1000),
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "contenido visible" on public.site_content;
drop policy if exists "admin crea contenido" on public.site_content;
drop policy if exists "admin edita contenido" on public.site_content;
drop policy if exists "admin borra contenido" on public.site_content;
create policy "contenido visible" on public.site_content for select using (true);
create policy "admin crea contenido" on public.site_content for insert with check ((select public.is_admin()));
create policy "admin edita contenido" on public.site_content for update
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin borra contenido" on public.site_content for delete using ((select public.is_admin()));

-- Bucket público para las fotos (máximo 5 MB, solo imágenes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cinelab', 'cinelab', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Cada usuario sube fotos de reseñas y de perfil solo dentro de su carpeta
-- (reviews/<su id>/... y avatars/<su id>/...). El admin puede subir en
-- cualquier carpeta, incluida media/ (fotos de películas y artículos).
drop policy if exists "cinelab subir mis fotos" on storage.objects;
drop policy if exists "cinelab admin sube fotos" on storage.objects;
drop policy if exists "cinelab borrar mis fotos" on storage.objects;
create policy "cinelab subir mis fotos" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cinelab'
    and (storage.foldername(name))[1] in ('reviews', 'avatars')
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
create policy "cinelab admin sube fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'cinelab' and (select public.is_admin()));
create policy "cinelab borrar mis fotos" on storage.objects for delete to authenticated
  using (
    bucket_id = 'cinelab'
    and ((storage.foldername(name))[2] = (select auth.uid())::text or (select public.is_admin()))
  );
