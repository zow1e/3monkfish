# @petcare/listings-ingestion

Lean TinyFish MVP scraping pipeline for ecommerce product listings.

- One primary TinyFish goal builder for visible product-card extraction
- Synchronous `/run` first for fast request/response scraping
- Raw TinyFish output persistence under `data/tinyfish/raw`
- Normalized product listing output under `data/tinyfish/normalized`
- Lightweight site strategies, blocked detection, keyword extraction, and JSON writers
