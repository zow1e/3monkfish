# @petcare/listings-ingestion

Backend-first TinyFish scraping and normalization pipeline for ecommerce product listings.

- Request-driven keyword scraping across supported sites
- Raw TinyFish output persistence under `data/tinyfish/raw`
- Normalized product listing output under `data/tinyfish/normalized`
- Goal builders, site strategies, anti-bot fallback heuristics, and file writers for API and worker usage
