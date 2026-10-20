-- CineLab · instalación completa (schema + admin + fotos)
-- Para un proyecto de Supabase NUEVO: pegar todo en el SQL Editor y ejecutar una sola vez.

-- ===================================================== 1. schema.sql
-- CineLab · esquema de Supabase
-- Ejecutar completo en el SQL Editor del proyecto (una sola vez).

-- Perfil público de cada usuario (el email queda privado en auth.users).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 24),
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  unique (user_id, item_id)            -- una reseña por persona y título
);

create table public.review_likes (
  review_id uuid not null references public.reviews (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)     -- un like por persona y reseña
);

create table public.watchlist (
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index reviews_item_idx on public.reviews (item_id);
create index review_likes_user_idx on public.review_likes (user_id);

-- Crea el perfil automáticamente al registrarse con el username elegido.
-- Si faltara o ya existiera, se arma uno a partir del email con un número
-- al final para que no choque.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  base text;
  candidate text;
  tries int := 0;
begin
  base := coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1));
  base := left(regexp_replace(base, '[^A-Za-z0-9_.ÁÉÍÓÚáéíóúÑñ]', '', 'g'), 19);
  if char_length(base) < 3 then base := 'cinefilo'; end if;
  candidate := base;
  while exists (select 1 from public.profiles where lower(username) = lower(candidate)) and tries < 50 loop
    tries := tries + 1;
    candidate := base || floor(random() * 90000 + 10000)::int;
  end loop;
  insert into public.profiles (id, username) values (new.id, candidate);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------ seguridad (RLS)
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.review_likes enable row level security;
alter table public.watchlist enable row level security;

-- Cualquiera (aun sin cuenta) puede leer perfiles, reseñas y likes.
create policy "perfiles visibles" on public.profiles for select using (true);
create policy "reseñas visibles" on public.reviews for select using (true);
create policy "likes visibles" on public.review_likes for select using (true);

-- Solo el dueño modifica lo suyo.
create policy "editar mi perfil" on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "crear mi reseña" on public.reviews for insert
  with check ((select auth.uid()) = user_id);
create policy "editar mi reseña" on public.reviews for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar mi reseña" on public.reviews for delete
  using ((select auth.uid()) = user_id);

-- No se puede dar like a una reseña propia.
create policy "dar like" on public.review_likes for insert
  with check (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.reviews r where r.id = review_id and r.user_id = (select auth.uid()))
  );
create policy "quitar mi like" on public.review_likes for delete
  using ((select auth.uid()) = user_id);

-- La lista "Quiero verla" es privada.
create policy "mi lista" on public.watchlist for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ===================================================== 2. admin.sql
-- CineLab · administradores y puntaje del equipo
-- Ejecutar en el SQL Editor (una sola vez). Si corrés schema.sql desde cero,
-- ejecutá este archivo después.

-- Marca de administrador en el perfil.
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Los usuarios solo pueden cambiar su username, nunca volverse admin solos.
revoke update on public.profiles from anon, authenticated;
grant update (username) on public.profiles to authenticated;

-- ¿La persona que hace el pedido es admin? (security definer para poder
-- usarlo dentro de las políticas sin chocar con el RLS de profiles).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce((select is_admin from public.profiles where id = (select auth.uid())), false);
$$;

-- Puntaje del equipo editable desde el sitio. Si un título no tiene fila
-- acá, se usa el puntaje escrito en js/data.js; rating null = sin puntaje.
create table if not exists public.team_ratings (
  item_id text primary key,
  rating numeric(3, 1) check (rating between 0 and 10),
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.team_ratings enable row level security;

drop policy if exists "puntajes visibles" on public.team_ratings;
drop policy if exists "admin crea puntajes" on public.team_ratings;
drop policy if exists "admin edita puntajes" on public.team_ratings;
drop policy if exists "admin borra puntajes" on public.team_ratings;
alter table public.team_ratings alter column rating drop not null;

create policy "puntajes visibles" on public.team_ratings for select using (true);
create policy "admin crea puntajes" on public.team_ratings for insert with check ((select public.is_admin()));
create policy "admin edita puntajes" on public.team_ratings for update
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin borra puntajes" on public.team_ratings for delete using ((select public.is_admin()));

-- Para nombrar admin a alguien, reemplazá el nombre de usuario y ejecutá:
-- update public.profiles set is_admin = true where username = 'Elpibedeoft';

-- ===================================================== 3. fotos.sql
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
