# TinyFish Scraping Runbook

## Request flow

1. API receives `POST /api/listings/scrape`.
2. API can also receive `POST /api/listings/scrape/chatbot` or `POST /api/listings/scrape/search-page`.
3. Request body is validated with shared Zod schemas.
4. For chatbot flow, placeholder chatbot keywords are resolved first.
5. For search-page flow, pet-profile preset keywords are merged with the entered search term and tagged as a `product` or `service` search.
6. `packages/listings-ingestion` selects a per-site strategy and builds a strict TinyFish goal.
7. TinyFish `/run` executes first with `browser_profile: "lite"`.
8. If the result looks blocked or empty, supported sites can retry once with `browser_profile: "stealth"` and optional proxy country config.
9. Raw output is written to `data/tinyfish/raw`.
10. Products are normalized, keywords are derived from description and review text, and normalized output is written to `data/tinyfish/normalized`.
11. API returns a top-level `products` array that intentionally mirrors TinyFish playground-style output for easier debugging.

## Goal design

Each goal includes:

- an explicit objective and target page scope
- exact required product fields, including the product image URL
- strict guardrails against clicking purchase flows
- cookie-banner handling
- a blocked-page fallback
- a JSON-only sample structure
- a stop condition that limits extraction to the first N listings

Product image scraping is required. The goal tells TinyFish to extract the image URL from the visible product card image whenever possible.

## Endpoint choices

### `/run`

Primary MVP path.

- Best fit for the 30-second synchronous API target
- Simple request-response shape
- Good for extracting the first 3 to 5 listings per site

### `/run-sse`

Useful for debugging.

- Lets us inspect streamed browser progress
- Helps diagnose anti-bot issues and page-flow problems
- Not currently wired into the API response path

### `/run-async`

Reserved for scaling.

- Better for queued jobs and scheduled refreshes
- Useful once scraping moves fully into `apps/worker`

## Anti-bot fallback strategy

- Run `lite` first for speed.
- If the payload looks blocked, empty, or challenge-like, retry once with `stealth` when the site strategy allows it.
- Amazon is treated as the highest-risk site and supports stealth fallback.
- PetMall supports stealth fallback as a secondary option.
- Pet Lovers Centre currently starts from the homepage and does not force stealth by default.
- CAPTCHA solving is intentionally not attempted.

## Output files

Per-site raw file:

- `data/tinyfish/raw/{timestamp}__{site}__{slugified-keywords}.json`

Per-site normalized file:

- `data/tinyfish/normalized/{timestamp}__{site}__{slugified-keywords}.json`

Aggregate normalized file for multi-site requests:

- `data/tinyfish/normalized/{timestamp}__all-sites__{slugified-keywords}.json`

Both raw and normalized files preserve the top-level `products` array shape so they are easy to compare against TinyFish playground runs.

## Current limitations

- Site URL strategies for PetMall and Pet Lovers Centre include TODO notes and may need tuning against live production behavior.
- The blocked-result detector is heuristic and intentionally simple.
- The MVP stays on listing pages and does not do deep product-page drilling.
- Queue infrastructure in `apps/worker` is scaffolding only.
