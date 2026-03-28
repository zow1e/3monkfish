-- App users (owners) and their pets. Run after 003 (or any prior migrations).
-- Supabase: optional link to auth.users via auth_user_id.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null,
  phone text,
  preferred_area text,
  preferred_vet text,
  preferred_groomer text,
  budget_range text,
  notification_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists owners_email_lower_unique on public.owners (lower(email));

create index if not exists owners_auth_user_id_idx on public.owners (auth_user_id)
  where auth_user_id is not null;

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners (id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  birthday date,
  age_text text,
  sex text,
  weight text,
  allergies_json jsonb not null default '[]'::jsonb,
  medications_json jsonb not null default '[]'::jsonb,
  owner_notes text,
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pets_species_check check (
    species in ('dog', 'cat', 'rabbit', 'other')
  )
);

create index if not exists pets_owner_id_idx on public.pets (owner_id);

drop trigger if exists set_owners_updated_at on public.owners;
create trigger set_owners_updated_at
  before update on public.owners
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_pets_updated_at on public.pets;
create trigger set_pets_updated_at
  before update on public.pets
  for each row execute procedure public.set_updated_at();

comment on table public.owners is 'Pet owner profiles; auth_user_id links to Supabase Auth when used.';
comment on table public.pets is 'Pets belonging to an owner; species includes rabbit for small-mammal MVP.';

-- Supabase only: tie owner row to login identity (safe no-op if auth schema missing).
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'auth')
     and exists (select 1 from information_schema.tables where table_schema = 'auth' and table_name = 'users') then
    alter table public.owners
      drop constraint if exists owners_auth_user_id_fkey;
    alter table public.owners
      add constraint owners_auth_user_id_fkey
      foreign key (auth_user_id) references auth.users (id) on delete set null;
  end if;
end
$$;
