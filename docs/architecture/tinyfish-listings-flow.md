# TinyFish Listings Flow

## Overview

The TinyFish listings flow is backend-first and optimized for a roughly 30-second scrape request.

## Flow

1. API request enters one of:
   - `POST /api/listings/scrape`
   - `POST /api/listings/scrape/chatbot`
   - `POST /api/listings/scrape/search-page`
2. `packages/validations` validates the request body.
3. For chatbot flow, placeholder chatbot keywords are resolved first.
4. For search-page flow, selected-pet preset keywords are combined with the search-bar input and a `product` or `service` search type.
5. `packages/listings-ingestion` maps each site to a strategy with:
   - start URL
   - anti-bot risk
   - stealth fallback policy
6. A strict TinyFish goal prompt is generated for the requested keyword and per-site product limit, with product image extraction as a required field.
7. TinyFish `/run` executes with `browser_profile: "lite"`.
8. If the result is empty or looks blocked, the runner optionally retries with `browser_profile: "stealth"` and proxy config.
9. Raw result payloads are persisted to `data/tinyfish/raw`.
10. The normalization layer trims fields, normalizes arrays, computes deterministic IDs, and derives `product_keywords`.
11. Normalized payloads are persisted to `data/tinyfish/normalized` using a top-level `products` array.
12. API returns request metadata plus a top-level `products` array shaped to mirror TinyFish playground output.

## Package responsibilities

- `packages/types`
  Shared TinyFish request, raw product, normalized listing, and outcome contracts.
- `packages/validations`
  Shared request and payload schemas.
- `packages/config`
  TinyFish env parsing and defaults.
- `packages/listings-ingestion`
  Strategy selection, goal building, TinyFish client wrapper, fallback logic, normalization, and JSON persistence.
- `apps/api`
  Route, controller, validation handoff, and response formatting.
- `apps/worker`
  Future queue entrypoints and scheduled refresh placeholders.
