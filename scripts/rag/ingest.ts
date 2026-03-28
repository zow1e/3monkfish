import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { chunkMarkdownByH2 } from "./chunkMarkdown.js";
import { loadRagEnv } from "./config.js";
import { embedTexts } from "./embed.js";
import { createPgClient } from "./pgClient.js";

/** Run via `pnpm rag:*` from the monorepo root so cwd is the repo root. */
const REPO_ROOT = process.cwd();
const DEFAULT_KNOWLEDGE = path.join(REPO_ROOT, "data/knowledge/holland-lop.md");

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function main() {
  const env = loadRagEnv();
  const knowledgePath = process.env.KNOWLEDGE_PATH ?? DEFAULT_KNOWLEDGE;

  const markdown = await readFile(knowledgePath, "utf8");
  const relativeSource = path.relative(REPO_ROOT, knowledgePath) || "holland-lop.md";
  const chunks = chunkMarkdownByH2(markdown, relativeSource);

  if (chunks.length === 0) {
    console.error("No chunks produced from markdown.");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const embeddings = await embedTexts(
    env,
    openai,
    chunks.map((c) => c.content),
  );

  const client = createPgClient(env.DATABASE_URL);
  await client.connect();

  for (let i = 0; i < chunks.length; i += 1) {
    const c = chunks[i];
    const vecLiteral = toVectorLiteral(embeddings[i]);

    await client.query(
      `insert into public.rag_chunks (
        corpus, species, breed, title, section_heading, content, embedding,
        metadata, source_path, content_hash, embedding_model
      ) values ($1,$2,$3,$4,$5,$6,$7::vector,$8,$9,$10,$11)
      on conflict (content_hash) do update set
        content = excluded.content,
        embedding = excluded.embedding,
        title = excluded.title,
        section_heading = excluded.section_heading,
        metadata = excluded.metadata,
        embedding_model = excluded.embedding_model`,
      [
        "breed_guide",
        "rabbit",
        "holland_lop",
        c.title,
        c.sectionHeading,
        c.content,
        vecLiteral,
        JSON.stringify({ disclaimer: "general_education_only" }),
        relativeSource,
        c.contentHash,
        env.OPENAI_EMBEDDING_MODEL,
      ],
    );
  }

  await client.end();

  console.log(
    `Upserted ${chunks.length} chunks from ${relativeSource} using OpenAI model "${env.OPENAI_EMBEDDING_MODEL}".`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
