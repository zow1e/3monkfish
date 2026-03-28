import "dotenv/config";
import OpenAI from "openai";
import { loadRagEnv } from "./config.js";
import { embedTexts } from "./embed.js";
import { createPgClient } from "./pgClient.js";

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function main() {
  const query =
    process.argv.slice(2).join(" ").trim() ||
    "My Holland Lop is not eating much, what should I watch for?";

  const env = loadRagEnv();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const [qEmb] = await embedTexts(env, openai, [query]);
  const vecLiteral = toVectorLiteral(qEmb);

  const client = createPgClient(env.DATABASE_URL);
  await client.connect();

  const { rows } = await client.query<{
    id: string;
    section_heading: string;
    content: string;
    distance: string;
  }>(
    `select id, section_heading, content, embedding <=> $1::vector as distance
     from public.rag_chunks
     where species = $2 and breed = $3
       and embedding is not null
     order by embedding <=> $1::vector
     limit 5`,
    [vecLiteral, "rabbit", "holland_lop"],
  );

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
