# `POST /api/listings/scrape`

Triggers TinyFish product listing scraping for one or more supported ecommerce sites.

The response intentionally mirrors TinyFish playground-style output with a top-level `products` array. Product image extraction is required and should come from the visible product card where possible.

## Request body

```json
{
  "keywords": "cat shedding brush",
  "sites": ["amazon", "petmall", "petlovers"],
  "maxProductsPerSite": 5,
  "countryCode": "SG"
}
```

## Response shape

```json
{
  "keywords": "rabbit treats",
  "requestedSites": ["amazon"],
  "status": "completed",
  "products": [
    {
      "name": "Example Product",
      "image": "https://example.com/image.jpg",
      "price": 9.9,
      "rating": 4.7,
      "reviews": 2603,
      "in_stock": true,
      "listing_url": "https://example.com/product",
      "shipping_fee": null,
      "delivery_countries": [],
      "description_text": null,
      "review_text": null,
      "product_keywords": ["rabbit", "treats"],
      "source_site": "amazon"
    }
  ],
  "siteOutcomes": [],
  "files": {
    "raw": [],
    "normalized": []
  },
  "startedAt": "2026-03-28T12:00:00.000Z",
  "completedAt": "2026-03-28T12:00:25.000Z"
}
```

## Notes

- `keywords` is the backend request field that the future UI can pass through directly.
- Results are normalized across sites before being returned, but the API keeps TinyFish-style keys such as `name`, `image`, `price`, `rating`, `reviews`, and `in_stock`.
- Raw and normalized JSON artifacts are stored on disk for downstream inspection and ingestion.
- Multi-site requests also create an aggregated normalized file under `data/tinyfish/normalized`.

## Additional entry paths

### `POST /api/listings/scrape/chatbot`

Uses placeholder chatbot keyword output for now, then runs TinyFish once per keyword set.

Example request:

```json
{
  "sites": ["amazon"],
  "searchType": "product",
  "placeholderKeywords": ["rabbit treats", "timothy hay feeder"]
}
```

### `POST /api/listings/scrape/search-page`

Uses the currently selected pet profile plus the search bar input to build a combined keyword query.

Example request:

```json
{
  "petProfile": {
    "petId": "pet-123",
    "petName": "Mochi",
    "species": "rabbit",
    "breed": "Holland Lop",
    "productKeywords": ["rabbit treats", "small animal brush"],
    "serviceKeywords": ["rabbit vet", "small animal groomer"]
  },
  "searchType": "product",
  "searchInput": "banana treats",
  "sites": ["amazon", "petmall"]
}
```
