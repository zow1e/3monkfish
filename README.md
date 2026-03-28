# PetCare Copilot Monorepo

PetCare Copilot is a backend-first pet management and pet shopping platform. It is designed to help pet owners manage pet profiles, discover relevant pet products, and support future AI-powered pet-care workflows such as concern answering and reminders.

## Submission Links

- Social media post: add your X or LinkedIn post link here
- Demo: add your YouTube video, Google Drive link, or hosted demo link here
- Description: PetCare Copilot is a web application concept that combines pet profile management, pet-related shopping discovery, and AI-ready backend services in one platform.

## High-Level Overview

PetCare Copilot focuses on three connected areas:

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
