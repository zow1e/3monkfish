# 3Rabbits Copilot

A pet-care and product-discovery prototype combining a React interface, a TypeScript API, TinyFish product ingestion, and retrieval-assisted answers. The repository contains working implementations alongside unfinished service and worker scaffolds.

## Technical skills

- **Languages and application stack:** TypeScript, React, Vite, Node.js, Express, pnpm workspaces, Turborepo.
- **Data ingestion:** TinyFish API requests, blocked-response detection, optional stealth/proxy fallback, JSON normalization, and Zod validation.
- **Retrieval:** OpenAI embeddings/chat, PostgreSQL vector queries, pet-context filtering, and SQL migrations.
- **Verification:** Vitest unit tests for schemas, ingestion helpers, prompts, and response formatting.

## Start here

| Path | Contents |
| --- | --- |
| [apps/web/app](apps/web/app) | React UI; default pet profiles persist in browser localStorage |
| [apps/api](apps/api) | Express routes for chat, listings, and pet-care workflows |
| [packages/listings-ingestion/src/pipelines/runSiteScrape.ts](packages/listings-ingestion/src/pipelines/runSiteScrape.ts) | TinyFish requests, fallback handling, and raw/normalized output |
| [packages/listings-ingestion/src/normalizers/productListing.ts](packages/listings-ingestion/src/normalizers/productListing.ts) | Product normalization and schema validation |
| [packages/rag-answer/src/answerCore.ts](packages/rag-answer/src/answerCore.ts) | Embed a question, retrieve context, and generate an answer |
| [db/migrations](db/migrations) | Vector, FAQ, owner, pet, and appointment schema migrations |

## Run locally

Use Node.js 20+ and the repository's pnpm 9.12.0 package manager. From the repository root:

```sh
corepack pnpm install
corepack pnpm dev:web
```

Open the URL printed by Vite. The default pet-profile flow uses browser storage. Chat and product scraping require the API and configured external services.

For those workflows, copy `.env.example` to `.env`, configure the values for the features you use, then run:

```sh
corepack pnpm dev:stack
```

- Product scraping needs `TINYFISH_API_KEY`; raw and normalized JSON are written under `data/tinyfish/` by default.
- RAG needs `OPENAI_API_KEY`, `DATABASE_URL`, the relevant SQL migrations, and an embedded knowledge corpus. Inspect [scripts/rag](scripts/rag) before running `corepack pnpm rag:ingest`, `corepack pnpm rag:search -- "your question"`, or `corepack pnpm rag:ask -- "your question"`.
- The Vite development configuration proxies API requests to port 4000 by default.

See [local setup](docs/runbooks/local-development-setup.md), [environment setup](docs/runbooks/environment-setup.md), and the [scraping runbook](docs/runbooks/tinyfish-scraping.md) for supporting configuration. Do not commit service credentials.

## Scope

This is a prototype, with some orchestration, worker, and shared-package placeholders still present. The UI and API need appropriate data/service configuration for connected workflows. No production-readiness, retrieval-quality benchmark, or deployment result is claimed. Pet-care answers are educational and do not replace veterinary advice.
