import type { Client } from "pg";

function isUndefinedColumnError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === "42703"
  );
}

/** Row shape from `public.pets` (+ owner link). */
export type ActivePetContext = {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  weight: string | null;
  location: string | null;
  personality: string | null;
  /** Values for `rag_chunks.species` / `rag_chunks.breed` filters. */
  ragSpecies: string;
  ragBreed: string;
};

/** Map free-text breed to rag_chunks slug (e.g. Holland Lop → holland_lop). */
export function breedToRagSlug(breed: string | null | undefined): string {
  if (!breed?.trim()) return "holland_lop";
  return breed
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/** Map pets.species to rag_chunks.species (lowercase enum). */
export function speciesToRagSpecies(species: string): string {
  return species.trim().toLowerCase();
}

export function formatPetForPrompt(pet: ActivePetContext): string {
  const lines = [
    `Active pet profile (use for personalization only; not a medical record):`,
    `- Name: ${pet.name}`,
    `- Species: ${pet.species}`,
    `- Breed: ${pet.breed ?? "not specified"}`,
    `- Age: ${pet.age ?? "not specified"}`,
    `- Weight: ${pet.weight ?? "not specified"}`,
    `- Location: ${pet.location ?? "not specified"}`,
    `- Personality: ${pet.personality ?? "not specified"}`,
  ];
  return lines.join("\n");
}

/** Combine pet context with the user question for better embedding similarity. */
export function augmentQueryForEmbedding(pet: ActivePetContext | null, userQuery: string): string {
  if (!pet) return userQuery;
  return `${formatPetForPrompt(pet)}\n\nOwner question:\n${userQuery}`;
}

type PetRowFull = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  weight: string | null;
  location: string | null;
  personality: string | null;
};

type PetRowMinimal = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
};

function rowToContext(row: PetRowFull | PetRowMinimal): ActivePetContext {
  const ragSpecies = speciesToRagSpecies(row.species);
  const ragBreed = breedToRagSlug(row.breed);
  const f = row as Partial<PetRowFull>;
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    age: f.age ?? null,
    weight: f.weight ?? null,
    location: f.location ?? null,
    personality: f.personality ?? null,
    ragSpecies,
    ragBreed,
  };
}

export async function loadPetById(
  client: Client,
  petId: string,
): Promise<ActivePetContext | null> {
  const sqlFull = `select id, owner_id, name, species, breed, age, weight, location, personality
     from public.pets
     where id = $1`;
  const sqlMinimal = `select id, owner_id, name, species, breed
     from public.pets
     where id = $1`;

  try {
    const { rows } = await client.query<PetRowFull>(sqlFull, [petId]);
    const row = rows[0];
    if (!row) return null;
    return rowToContext(row);
  } catch (e) {
    if (!isUndefinedColumnError(e)) throw e;
    const { rows } = await client.query<PetRowMinimal>(sqlMinimal, [petId]);
    const row = rows[0];
    if (!row) return null;
    return rowToContext(row);
  }
}
