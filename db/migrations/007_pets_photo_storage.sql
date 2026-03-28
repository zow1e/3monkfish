-- Supabase Storage: object path inside a bucket (query + resolve URL on the frontend or API).
-- Use with storage.from(photo_bucket).getPublicUrl(photo_storage_path) or createSignedUrl().

alter table public.pets add column if not exists photo_bucket text default 'pet-photos';
alter table public.pets add column if not exists photo_storage_path text;

alter table public.pets alter column photo_bucket set default 'pet-photos';

comment on column public.pets.photo_url is
  'Optional cached HTTPS URL (e.g. public URL); can be derived from bucket + path instead.';
comment on column public.pets.photo_bucket is
  'Supabase Storage bucket name (default pet-photos).';
comment on column public.pets.photo_storage_path is
  'Object key within the bucket, e.g. {owner_id}/{pet_id}.webp — use with Storage client for display.';
