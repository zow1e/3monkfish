import type { Client } from "pg";
import type { ActivePetContext } from "./activePet.js";

const DEFAULT_SPECIES = "rabbit";
const DEFAULT_BREED = "holland_lop";

type ChunkRow = {
  id: string;
  section_heading: string;
  content: string;
  distance: string;
};

/**
 * Retrieves nearest rag_chunks, scoped by pet species/breed when provided.
 * Falls back to species-only, then unfiltered, if strict filter returns nothing.
 */
export async function retrieveNearestChunks(
  client: Client,
  vecLiteral: string,
  pet: ActivePetContext | null,
  limit: number,
): Promise<ChunkRow[]> {
  const species = pet?.ragSpecies ?? DEFAULT_SPECIES;
  const breed = pet?.ragBreed ?? DEFAULT_BREED;

  const strict = await client.query<ChunkRow>(
    `select id, section_heading, content, embedding <=> $1::vector as distance
     from public.rag_chunks
     where embedding is not null
       and species = $2
       and breed = $3
     order by embedding <=> $1::vector
     limit $4`,
    [vecLiteral, species, breed, limit],
  );
  if (strict.rows.length > 0) return strict.rows;

  const speciesOnly = await client.query<ChunkRow>(
    `select id, section_heading, content, embedding <=> $1::vector as distance
     from public.rag_chunks
     where embedding is not null
       and species = $2
     order by embedding <=> $1::vector
     limit $3`,
    [vecLiteral, species, limit],
  );
  if (speciesOnly.rows.length > 0) {
    console.error(
      `[rag] No chunks for species=${species} breed=${breed}; using species-only fallback.`,
    );
    return speciesOnly.rows;
  }

  const broad = await client.query<ChunkRow>(
    `select id, section_heading, content, embedding <=> $1::vector as distance
     from public.rag_chunks
     where embedding is not null
     order by embedding <=> $1::vector
     limit $2`,
    [vecLiteral, limit],
  );
  if (broad.rows.length > 0) {
    console.error(
      `[rag] No chunks for species=${species}; using corpus-wide fallback (add RAG data for this species/breed).`,
    );
  }
  return broad.rows;
}

/** Same retrieval without id/distance shape for answer (section + content only). */
export async function retrieveNearestChunksForAnswer(
  client: Client,
  vecLiteral: string,
  pet: ActivePetContext | null,
  limit: number,
): Promise<{ section_heading: string; content: string }[]> {
  const rows = await retrieveNearestChunks(client, vecLiteral, pet, limit);
  return rows.map((r) => ({ section_heading: r.section_heading, content: r.content }));
}
