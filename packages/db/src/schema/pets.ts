/** Logical name; physical table is `public.pets` (see `db/migrations/004_owners_and_pets.sql`, `005_*` upgrade). */
export const petsTable = {
  name: 'pets',
  physicalTable: 'pets',
  columns: [
    'id',
    'owner_id',
    'name',
    'species',
    'breed',
    'birthday',
    'age',
    'sex',
    'weight',
    'location',
    'personality',
    'allergies_json',
    'medications_json',
    'owner_notes',
    'ai_summary',
    'created_at',
    'updated_at',
  ],
} as const;
