# Architecture Overview

## Core layers

1. **API Layer (`apps/api`)**
   - HTTP routing, request validation, auth middleware hooks, orchestration calls.
2. **Worker Layer (`apps/worker`)**
   - Async/background workloads: ingestion, normalization, embeddings refresh, reminders.
3. **Domain/Platform Packages (`packages/*`)**
   - Shared schemas, prompt templates, RAG helpers, OpenAI wrappers, safety policies.
4. **Data Layer (`packages/db`)**
   - ORM-agnostic schema definitions, migrations/seeds placeholders.

## Data flow (high-level)

Tinyfish JSON -> listings ingestion package -> normalized entities -> DB/search index -> RAG retrieval -> chatbot orchestration -> response with citations and safety disclaimer.

## Planned pgvector usage

- Embeddings table(s) for FAQ, records, profile-context chunks.
- Hybrid retrieval (vector + metadata + keyword).
- Reranking after initial retrieval set.
