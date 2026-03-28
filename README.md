# 3Rabbits Copilot Monorepo

3Rabbits Copilot is a backend-first pet management and pet shopping platform. It is designed to help pet owners manage pet profiles, discover relevant pet products, and support future AI-powered pet-care workflows such as concern answering and reminders.

## High-Level Overview

3Rabbits Copilot focuses on three connected areas:

- Pet profiles and management
  Store core pet information such as species, breed, age, personality, photos, and ownership relationships.
- TinyFish-powered product discovery
  Accept product keywords, scrape supported ecommerce sites, normalize the results, and return a clean list of pet products.
- AI-ready backend foundation
  Provide shared schemas, API routes, storage, and data pipelines that can later support chat, reminders, and profile-aware recommendations.

## Current Product / Web App Concept

The intended web app experience is:

- Pet owners can manage pet profiles in one place
- Pet owners can search for pet-related products using keywords
- The backend uses TinyFish to scrape supported ecommerce sites for relevant visible products
- The backend returns a top-level `products` array with fields like:
  `name`, `image`, `price`, `rating`, `reviews`, `in_stock`, `listing_url`, `shipping_fee`, `delivery_countries`, `description_text`, `review_text`, `product_keywords`, `source_site`
- The scraping results are persisted as raw and normalized JSON for debugging and downstream use

This repository intentionally does not include the final UI implementation.

## Current Functionality

### TinyFish scraping MVP

The current backend MVP supports:

- keyword-driven product scraping
- synchronous TinyFish `/run` execution first for fast requests
- extraction of the first few visible products only
- product image scraping as a required field
- TinyFish-playground-style output with a top-level `products` array
- normalization of scraped fields into a consistent response shape
- raw output persistence in `data/tinyfish/raw`
- normalized output persistence in `data/tinyfish/normalized`

### Backend foundations already in the repo

- API route scaffolding for listings scraping and other pet-care workflows
- shared TypeScript domain types
- shared Zod validation schemas
- configuration helpers for TinyFish and OpenAI-related services
- database migration scaffolding for owners, pets, appointments, and RAG data
- unit tests for TinyFish prompts, validation, normalization, blocked detection, filenames, and response formatting

## Monorepo Structure

- `apps/api`
  Main API routes, request handling, and scrape response formatting.
- `apps/worker`
  Background job runner scaffold for future async workflows.
- `packages/listings-ingestion`
  Lean TinyFish scraping MVP pipeline.
- `packages/types`
  Shared domain and TinyFish request/result types.
- `packages/validations`
  Shared Zod validation layer.
- `packages/config`
  Environment and config parsing helpers.
- `data/tinyfish/raw`
  Raw TinyFish outputs.
- `data/tinyfish/normalized`
  Normalized product outputs.
- `docs`
  API docs, architecture notes, and TinyFish runbooks.

## TinyFish MVP Flow

1. The API receives a keyword request such as `rabbit treats`.
2. A site strategy selects the start URL and fallback behavior for the requested site.
3. A strict TinyFish goal prompt tells the agent to extract only the first few visible product cards.
4. TinyFish returns a top-level `products` array.
5. The backend normalizes and enriches the data.
6. Raw and normalized JSON files are written to disk.
7. The API returns a clean `products` array for the web app.

## Quick Start

1. Install dependencies:

   ```bash
   corepack pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Run development tasks:

   ```bash
   corepack pnpm dev
   ```

## Environment Variables

See `.env.example` for the full list.
   ```bash
   export PET_ID="<uuid-from-public.pets>"
   pnpm rag:search -- "Should I worry about less hay?"
   # or
   pnpm rag:search -- --pet-id="<uuid>" "Should I worry about less hay?"
   pnpm rag:ask -- --pet-id="<uuid>" "Any enrichment ideas?"
   ```

   Embedding uses **pet context + question**; `rag_chunks` are filtered by that pet’s species/breed (with fallbacks if the corpus has no exact match).

| Path | Purpose |
|------|--------|
| `data/knowledge/holland-lop.md` | MVP corpus (education only; not veterinary advice) |
| `scripts/rag/ingest.ts` | Chunk → embed → upsert `rag_chunks` |
| `scripts/rag/search.ts` | Query embedding → cosine nearest neighbors |
| `scripts/rag/answer.ts` | Retrieve + `OPENAI_CHAT_MODEL` answer |
| `db/migrations/001_rag_chunks.sql` | `rag_chunks` table + vector column |
| `db/migrations/002_faq_articles.sql` | `faq_articles` + 3 seeded Holland Lop questions |
| `db/migrations/003_rag_faq_chunks.sql` | FAQ rows mirrored into `rag_chunks`; run `pnpm rag:ingest` to embed |
| `db/migrations/004_owners_and_pets.sql` | `owners` (user profiles) + `pets`; optional `auth_user_id` → Supabase Auth |
| `db/migrations/005_pets_location_personality_age.sql` | Upgrade: `location` / `personality` / rename `age_text` → `age` if you ran an older 004 |
| `db/migrations/006_pets_photo_url.sql` | `pets.photo_url` optional cached URL |
| `db/migrations/007_pets_photo_storage.sql` | `pets.photo_bucket` + `pets.photo_storage_path` for Supabase Storage keys |
| `db/migrations/008_appointments.sql` | `appointments` — scheduled visits with user-entered provider, reason, notes, `details_json` |
| `db/migrations/009_pets_bird_height_rls.sql` | `pets`: species `bird`, `height`; RLS on `owners`/`pets`; Storage bucket `pet-photos` + policies |

## App database (owners & pets)

Run `db/migrations/004_owners_and_pets.sql` in Supabase after prior migrations. If you previously created `pets` with `age_text` and without `location` / `personality`, also run **`005_pets_location_personality_age.sql`**.

- **`owners`** — name, email (case-insensitive unique), preferences JSON, optional **`auth_user_id`** (FK to `auth.users` on Supabase when the block runs).
- **`pets`** — many rows can share the same **`owner_id`** (one user, multiple pets). Photo fields: **`photo_url`** (optional cached URL), **`photo_bucket`** (default `pet-photos`), **`photo_storage_path`** (object key in that bucket, e.g. `{owner_id}/{pet_id}.webp`). Query pets from PostgREST/API as usual; on the frontend use **`@petcare/pet-photo`** `resolvePetPhotoPublicUrl({ supabaseProjectUrl, photoUrl, photoBucket, photoStoragePath })` for **public** buckets, or the Supabase client’s **`createSignedUrl`** for private buckets. Run **`007_pets_photo_storage.sql`** if you already applied `006` without bucket/path columns.
- **`appointments`** — after **`008_appointments.sql`**: links **`owner_id`** + **`pet_id`** (trigger enforces the pet belongs to that owner), **`scheduled_at`**, optional **`end_at`**, **`appointment_type`**, **`reason_for_visit`**, **`notes`**, optional **`provider_name`** / **`provider_address`**, flexible **`details_json`**, **`status`** (`scheduled` \| `completed` \| `cancelled` \| `no_show`).
- **`009_pets_bird_height_rls.sql`** — adds species **`bird`**, optional **`pets.height`**, **RLS** on **`owners`** / **`pets`** for the Supabase **`authenticated`** role, **`pet-photos`** storage bucket + policies (upload path `{owner_id}/{pet_id}.ext`). Use when wiring the API or a Supabase-backed client; the bundled Vite UI does not require it.

### Web app (`apps/web/app`)

Pets are stored in the **browser** (`localStorage`) — no login or Supabase env needed for the default flow.

1. From **`apps/web/app`**: `npm install` then `npm run dev`.
2. Open the URL Vite prints (e.g. **http://localhost:5173/**). **Dashboard** lists pets; use **Add pet** / **`/onboarding`** to add another. **My Pets** opens the first pet or **`/pet-profile?id=<uuid>`** for a specific card.

Core variables include:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `DATABASE_URL`
- `PGVECTOR_ENABLED`
- `TINYFISH_API_KEY`
- `TINYFISH_DEFAULT_TIMEOUT_MS`
- `TINYFISH_DEFAULT_MAX_PRODUCTS`
- `TINYFISH_PROXY_COUNTRY_CODE`
- `TINYFISH_USE_STEALTH_FALLBACK`
- `TINYFISH_RAW_DATA_DIR`
- `TINYFISH_NORMALIZED_DATA_DIR`

## Current Status

This repository currently contains a strong backend MVP with:

- TinyFish scraping scaffolding
- pet profile and app data foundations
- normalized JSON output for downstream use
- AI/RAG-oriented backend groundwork

The frontend UI is intentionally separate and can be created later.

## Future Features

Possible next features that can be implemented:

- link a pet camera feed directly inside the pet profile page
- create a Telegram bot to answer pet concerns
- send Telegram reminders for feeding time, medicine time, and other recurring pet-care tasks
- add richer product ranking, filtering, and comparison features
- expand the AI assistant into a more profile-aware pet-care companion
