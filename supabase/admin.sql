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
