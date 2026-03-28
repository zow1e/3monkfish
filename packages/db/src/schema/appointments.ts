/** Physical table `public.appointments` — see `db/migrations/008_appointments.sql`. */
export const appointmentsTable = {
  name: 'appointments',
  physicalTable: 'appointments',
  columns: [
    'id',
    'owner_id',
    'pet_id',
    'provider_id',
    'provider_name',
    'provider_address',
    'appointment_type',
    'title',
    'scheduled_at',
    'end_at',
    'timezone',
    'status',
    'notes',
    'reason_for_visit',
    'details_json',
    'created_at',
    'updated_at',
  ],
} as const;
