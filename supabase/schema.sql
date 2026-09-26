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
