# PetCare Copilot Monorepo

PetCare Copilot is a backend-first AI pet-care assistant scaffold. It is designed for rapid iteration on data ingestion, retrieval-augmented chatbot orchestration, safety controls, and API services.

## What this repository includes

- **Monorepo tooling:** pnpm workspaces + Turborepo + TypeScript.
- **Backend apps:** API server and worker for ingestion/indexing/reminders.
- **Shared packages:** types, validations, db schema scaffolding, prompts, RAG, OpenAI wrappers, safety, analytics.
- **Data pipeline scaffolding:** Tinyfish raw JSON -> normalized listings -> searchable entities.
- **Docs and scripts:** architecture, runbooks, eval and seed script placeholders.
- **Holland Lop RAG CLI:** OpenAI embeddings + Supabase/pgvector ingest, search, and optional `gpt-4o-mini` answers (`scripts/rag/`).

## What is intentionally excluded

- UI implementation (React components/pages/layouts)
- Styling systems and visual design code
- Booking/insurance/clinic-portal specific features

> UI will be generated separately with Stitch.

## Monorepo structure

- `apps/web` - Next.js placeholder only (no UI implementation)
- `apps/api` - API routes and orchestration entrypoints
- `apps/worker` - background jobs for ingestion, embeddings, reminders
- `packages/*` - reusable domain and platform packages
- `data/tinyfish/*` - raw and normalized listing artifacts
- `data/knowledge/*` - curated markdown for the Holland Lop RAG MVP seed
- `db/migrations/*` - SQL for `rag_chunks` (pgvector)
- `docs/*` - architecture, API, prompts, runbooks, eval docs

## Quick start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy env file:

   ```bash
   cp .env.example .env
   ```

3. Run development tasks:

   ```bash
   pnpm dev
   ```

## Holland Lop RAG CLI (OpenAI + pgvector)

Prerequisites: Node 20+, Postgres with **pgvector** (e.g. Supabase), `OPENAI_API_KEY`, and `DATABASE_URL`. For Supabase from a laptop, use **Connect → Transaction pooler** (`:6543`) and user `postgres.<project_ref>`.

1. Run `db/migrations/001_rag_chunks.sql` in the Supabase SQL editor (or `psql`).
2. Ingest, search, and optionally ask:

   ```bash
   pnpm rag:ingest
   pnpm rag:search -- "Holland Lop diet and hay"
   pnpm rag:ask -- "My Holland Lop is molting — any grooming tips?"
   ```

| Path | Purpose |
|------|--------|
| `data/knowledge/holland-lop.md` | MVP corpus (education only; not veterinary advice) |
| `scripts/rag/ingest.ts` | Chunk → embed → upsert `rag_chunks` |
| `scripts/rag/search.ts` | Query embedding → cosine nearest neighbors |
| `scripts/rag/answer.ts` | Retrieve + `OPENAI_CHAT_MODEL` answer |
| `db/migrations/001_rag_chunks.sql` | `rag_chunks` table + vector column |

## Environment variables

See `.env.example` for all settings.

Core variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `OPENAI_CHAT_MODEL` (optional; used by `pnpm rag:ask`)
- `DATABASE_URL`
- `PGVECTOR_ENABLED`
- `TINYFISH_RAW_DATA_DIR`
- `TINYFISH_NORMALIZED_DATA_DIR`

## Current status

This is a production-leaning scaffold with intentionally minimal implementation. It provides coherent module boundaries, interfaces, schemas, prompt assets, and job/API entrypoints.
