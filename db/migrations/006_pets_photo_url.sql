-- Primary pet photo: store the public/signed URL after upload to object storage (e.g. Supabase Storage).
-- Safe to run if 004 already created pets without this column.

alter table public.pets add column if not exists photo_url text;

comment on column public.pets.photo_url is 'HTTPS URL to primary pet photo (e.g. Supabase Storage public or signed URL).';
