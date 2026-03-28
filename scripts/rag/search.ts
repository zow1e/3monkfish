import "dotenv/config";
import OpenAI from "openai";
import {
  augmentQueryForEmbedding,
  loadPetById,
  createPgClient,
  embedTexts,
  loadRagEnv,
  retrieveNearestChunks,
} from "@petcare/rag-answer";
import { parsePetIdAndQuery } from "./parseArgs.js";

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function main() {
  const defaultQuery = "My Holland Lop is not eating much, what should I watch for?";
  const { petId, query } = parsePetIdAndQuery(process.argv.slice(2), defaultQuery);

  const env = loadRagEnv();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const client = createPgClient(env.DATABASE_URL);
  await client.connect();

  let pet = petId ? await loadPetById(client, petId) : null;
  if (petId && !pet) {
    console.error(`[rag] No pet found for id=${petId}; using default species/breed filters.`);
  }
  if (pet) {
    console.error(
      `[rag] Active pet: ${pet.name} (${pet.species}) → rag filter species=${pet.ragSpecies} breed=${pet.ragBreed} (owner ${pet.ownerId})`,
    );
  }

  const textToEmbed = augmentQueryForEmbedding(pet, query);
  const [qEmb] = await embedTexts(env, openai, [textToEmbed]);
  const vecLiteral = toVectorLiteral(qEmb);

  const rows = await retrieveNearestChunks(client, vecLiteral, pet, 5);

  await client.end();

  console.log(`Query: ${query}\n`);
  for (const row of rows) {
    console.log("---");
    console.log(`section: ${row.section_heading}`);
    console.log(`distance (cosine): ${row.distance} (lower is closer)`);
    console.log(row.content);
    console.log("");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
