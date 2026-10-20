-- CineLab · firma de las reseñas
-- Ejecutar en el SQL Editor (una sola vez). Agrega la firma opcional
-- (nombre y apellido) que se puede poner al escribir una reseña.
alter table public.reviews add column if not exists firma text
  check (firma is null or char_length(firma) between 3 and 80);
