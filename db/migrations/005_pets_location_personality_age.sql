-- Upgrade path if you already ran an older 004 without location / personality / age rename.
-- Safe to run even on fresh DBs that already have the final 004 (no-ops).

alter table public.pets add column if not exists location text;
update public.pets set location = 'Singapore' where location is null or trim(location) = '';
alter table public.pets alter column location set default 'Singapore';
alter table public.pets alter column location set not null;

alter table public.pets add column if not exists personality text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pets' and column_name = 'age_text'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pets' and column_name = 'age'
  ) then
    alter table public.pets rename column age_text to age;
  end if;
end
$$;

alter table public.pets add column if not exists age text;

comment on column public.pets.age is 'Approximate age in free text (e.g. "4 years", "6 months").';
comment on column public.pets.location is 'Region or country; MVP default Singapore.';
comment on column public.pets.personality is 'Short description of temperament and behavior.';
