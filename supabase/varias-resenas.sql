-- CineLab · varias reseñas por título para los admins
-- Ejecutar en el SQL Editor (una sola vez). Los usuarios comunes siguen con
-- una reseña por título; los admins (por ejemplo la cuenta del equipo)
-- pueden publicar varias, una por integrante.
alter table public.reviews drop constraint if exists reviews_user_id_item_id_key;
create index if not exists reviews_user_item_idx on public.reviews (user_id, item_id);

create or replace function public.one_review_per_title()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if not coalesce((select is_admin from public.profiles where id = new.user_id), false)
     and exists (select 1 from public.reviews r
                 where r.user_id = new.user_id and r.item_id = new.item_id and r.id <> new.id) then
    raise exception 'Ya publicaste una reseña de este título' using errcode = 'unique_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_one_per_title on public.reviews;
create trigger reviews_one_per_title
  before insert or update of user_id, item_id on public.reviews
  for each row execute function public.one_review_per_title();
