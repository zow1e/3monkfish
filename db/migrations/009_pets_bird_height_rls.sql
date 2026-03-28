-- Extend species (bird), optional height, and RLS for owners/pets + Storage. Run after 004/008.

-- Species: add bird (UI lists Bird).
alter table public.pets drop constraint if exists pets_species_check;
alter table public.pets add constraint pets_species_check check (
  species in ('dog', 'cat', 'rabbit', 'bird', 'other')
);

alter table public.pets add column if not exists height text;

comment on column public.pets.height is 'Optional display height, e.g. "56cm".';

-- Row level security: authenticated users only see/modify their owner row and that owner''s pets.
alter table public.owners enable row level security;
alter table public.pets enable row level security;

drop policy if exists "owners_select_own" on public.owners;
drop policy if exists "owners_insert_own" on public.owners;
drop policy if exists "owners_update_own" on public.owners;
drop policy if exists "owners_delete_own" on public.owners;

create policy "owners_select_own" on public.owners
  for select to authenticated
  using (auth_user_id = auth.uid());

create policy "owners_insert_own" on public.owners
  for insert to authenticated
  with check (auth_user_id = auth.uid());

create policy "owners_update_own" on public.owners
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy "owners_delete_own" on public.owners
  for delete to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists "pets_select_own" on public.pets;
drop policy if exists "pets_insert_own" on public.pets;
drop policy if exists "pets_update_own" on public.pets;
drop policy if exists "pets_delete_own" on public.pets;

create policy "pets_select_own" on public.pets
  for select to authenticated
  using (
    exists (
      select 1 from public.owners o
      where o.id = pets.owner_id and o.auth_user_id = auth.uid()
    )
  );

create policy "pets_insert_own" on public.pets
  for insert to authenticated
  with check (
    exists (
      select 1 from public.owners o
      where o.id = pets.owner_id and o.auth_user_id = auth.uid()
    )
  );

create policy "pets_update_own" on public.pets
  for update to authenticated
  using (
    exists (
      select 1 from public.owners o
      where o.id = pets.owner_id and o.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.owners o
      where o.id = pets.owner_id and o.auth_user_id = auth.uid()
    )
  );

create policy "pets_delete_own" on public.pets
  for delete to authenticated
  using (
    exists (
      select 1 from public.owners o
      where o.id = pets.owner_id and o.auth_user_id = auth.uid()
    )
  );

-- Storage: public bucket for pet photos (safe to re-run).
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "pet_photos_insert_own_folder" on storage.objects;
drop policy if exists "pet_photos_update_own_folder" on storage.objects;
drop policy if exists "pet_photos_delete_own_folder" on storage.objects;

-- First path segment must equal the owner''s id (same as app upload path owner_id/pet_id.ext).
-- Path layout: {owner_id}/{pet_id}.ext — first segment must be an owner row for this user.
create policy "pet_photos_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'pet-photos'
    and split_part(name, '/', 1) in (
      select o.id::text from public.owners o where o.auth_user_id = auth.uid()
    )
  );

create policy "pet_photos_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'pet-photos'
    and split_part(name, '/', 1) in (
      select o.id::text from public.owners o where o.auth_user_id = auth.uid()
    )
  );

create policy "pet_photos_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'pet-photos'
    and split_part(name, '/', 1) in (
      select o.id::text from public.owners o where o.auth_user_id = auth.uid()
    )
  );
