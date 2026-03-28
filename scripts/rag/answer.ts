import "dotenv/config";
import OpenAI from "openai";
import {
  augmentQueryForEmbedding,
  formatPetForPrompt,
  loadPetById,
} from "./activePet.js";
import { loadRagEnv } from "./config.js";
import { embedTexts } from "./embed.js";
import { parsePetIdAndQuery } from "./parseArgs.js";
import { createPgClient } from "./pgClient.js";
import { retrieveNearestChunksForAnswer } from "./ragRetrieve.js";

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function main() {
  const defaultQuestion = "How much hay should my Holland Lop get each day?";
  const { petId, query: question } = parsePetIdAndQuery(process.argv.slice(2), defaultQuestion);

  const env = loadRagEnv();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const client = createPgClient(env.DATABASE_URL);
  await client.connect();

  let pet = petId ? await loadPetById(client, petId) : null;
  if (petId && !pet) {
    console.error(`[rag] No pet found for id=${petId}; answering without pet profile.`);
  }
  if (pet) {
    console.error(
      `[rag] Active pet: ${pet.name} (${pet.species}) → rag filter species=${pet.ragSpecies} breed=${pet.ragBreed}`,
    );
  }

  const textToEmbed = augmentQueryForEmbedding(pet, question);
  const [qEmb] = await embedTexts(env, openai, [textToEmbed]);
  const vecLiteral = toVectorLiteral(qEmb);

  const rows = await retrieveNearestChunksForAnswer(client, vecLiteral, pet, 5);

  await client.end();

  const context = rows
    .map((r, i) => `[${i + 1}] ${r.section_heading}\n${r.content}`)
    .join("\n\n---\n\n");

  const petBlock = pet ? `${formatPetForPrompt(pet)}\n\n` : "";

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_CHAT_MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a pet-care education assistant. You must:
- Base answers on the CONTEXT passages below (plus general common-sense formatting). If context is insufficient, say so.
- When an ACTIVE PET PROFILE is provided, personalize examples and wording to that animal (species, breed, age, personality) without inventing medical facts not stated in the profile or context.
- Never diagnose disease or replace a veterinarian. Encourage urgent vet care for emergencies (not eating, no stool, bloating, breathing difficulty, trauma, toxin exposure).
- Speak clearly and practically. Information is general education, not veterinary advice.`,
      },
      {
        role: "user",
        content: `${petBlock}CONTEXT (knowledge excerpts):\n\n${context}\n\n---\n\nQUESTION:\n${question}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";
  console.log(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
