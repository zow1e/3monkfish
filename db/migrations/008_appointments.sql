-- Appointments: scheduled visits with user-entered details. Run after 004 (owners/pets).

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  -- Optional link when a providers registry exists; otherwise use provider_name.
  provider_id uuid,
  provider_name text,
  provider_address text,
  appointment_type text not null,
  title text,
  scheduled_at timestamptz not null,
  end_at timestamptz,
  timezone text not null default 'Asia/Singapore',
  status text not null default 'scheduled',
  notes text,
  reason_for_visit text,
  details_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_status_check check (
    status in ('scheduled', 'completed', 'cancelled', 'no_show')
  )
);

create index if not exists appointments_owner_id_idx on public.appointments (owner_id);
create index if not exists appointments_pet_id_idx on public.appointments (pet_id);
create index if not exists appointments_scheduled_at_idx on public.appointments (scheduled_at);

comment on table public.appointments is 'User-scheduled appointments; pet must belong to owner_id.';
comment on column public.appointments.appointment_type is 'e.g. vet, grooming, boarding, consultation, other.';
comment on column public.appointments.reason_for_visit is 'Chief complaint or purpose; free text from the user.';
comment on column public.appointments.details_json is 'Extra structured or ad-hoc fields from the user (e.g. prep instructions, attachments metadata).';

-- Enforce pet_id ↔ owner_id consistency.
create or replace function public.check_appointment_pet_owner()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.pets p
    where p.id = new.pet_id
      and p.owner_id = new.owner_id
  ) then
    raise exception 'appointments.pet_id must belong to appointments.owner_id';
  end if;
  return new;
end;
$$;

drop trigger if exists appointments_check_pet_owner on public.appointments;
create trigger appointments_check_pet_owner
  before insert or update of owner_id, pet_id on public.appointments
  for each row execute procedure public.check_appointment_pet_owner();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at();
