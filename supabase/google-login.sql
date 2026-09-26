-- CineLab · actualización para el login con Google
-- Ejecutar en el SQL Editor SOLO si ya habías corrido schema.sql antes de
-- que existiera el login con Google (si lo corrés ahora por primera vez, ya
-- lo incluye). Reemplaza la función que crea el perfil de cada usuario nuevo.

-- Crea el perfil automáticamente al registrarse. Con email se usa el username
-- elegido; con Google, el comienzo del email. Si el nombre ya existe se le
-- agrega un número para que no choque.
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
