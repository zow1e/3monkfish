import "dotenv/config";
import OpenAI from "openai";
import { loadRagEnv } from "./config.js";
import { embedTexts } from "./embed.js";
import { createPgClient } from "./pgClient.js";

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function main() {
  const question =
    process.argv.slice(2).join(" ").trim() ||
    "How much hay should my Holland Lop get each day?";

  const env = loadRagEnv();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const [qEmb] = await embedTexts(env, openai, [question]);
  const vecLiteral = toVectorLiteral(qEmb);

  const client = createPgClient(env.DATABASE_URL);
  await client.connect();

  const { rows } = await client.query<{
    section_heading: string;
    content: string;
  }>(
    `select section_heading, content
     from public.rag_chunks
     where species = $2 and breed = $3
       and embedding is not null
     order by embedding <=> $1::vector
     limit 5`,
    [vecLiteral, "rabbit", "holland_lop"],
  );

  await client.end();

  const context = rows
    .map((r, i) => `[${i + 1}] ${r.section_heading}\n${r.content}`)
    .join("\n\n---\n\n");

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_CHAT_MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a pet-care education assistant for rabbit owners. You must:
- Base answers only on the CONTEXT passages below (plus general common-sense formatting). If context is insufficient, say so.
- Never diagnose disease or replace a veterinarian. Encourage urgent vet care for emergencies (not eating, no stool, bloating, breathing difficulty, trauma, toxin exposure).
- Speak clearly and practically. Mention that information is general education, not veterinary advice.`,
      },
      {
        role: "user",
        content: `CONTEXT (Holland Lop breed guide excerpts):\n\n${context}\n\n---\n\nQUESTION:\n${question}`,
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
