/** Logical name; physical table is `public.owners` (see `db/migrations/004_owners_and_pets.sql`). */
export const ownersTable = {
  name: 'owners',
  physicalTable: 'owners',
  columns: [
    'id',
    'auth_user_id',
    'name',
    'email',
    'phone',
    'preferred_area',
    'preferred_vet',
    'preferred_groomer',
    'budget_range',
    'notification_preferences',
    'created_at',
    'updated_at',
  ],
} as const;
