import type { SupportedSite } from '@petcare/types';
import { getSiteSearchStrategy } from '../strategies/siteStrategies';

export interface ProductSearchGoalInput {
  keyword: string;
  site: SupportedSite;
  maxProductCount: number;
}

const sampleJson = `{
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
      "source_site": "amazon"
    }
  ]
}`;

export const buildProductSearchGoal = (input: ProductSearchGoalInput): string => {
  const strategy = getSiteSearchStrategy(input.site);

  return `
Go to the ${strategy.displayName} search or listing page for "${input.keyword}" and extract product details.

Objective:
Extract product name, product image, current price, star rating, review count, and availability status from the first few relevant visible products on the current page.

Target:
- Current page only
- First visible relevant products only
- No pagination unless explicitly configured
- No deep product-page navigation in this MVP unless absolutely required to get the listing URL

Required actions:
- Close any cookie or consent banner first if it appears.
- Wait for the results page to fully load before extracting.
- Extract only the first ${input.maxProductCount} relevant visible products on the current page.
- Extract the product image URL from the visible product card image whenever possible.
- Do not click Add to Cart, Buy Now, checkout, or sign in buttons.
- Do not paginate.
- If price shows "See price in cart", set price to null.
- If a field is not visible, set it to null or [] as appropriate.
- If the page shows access denied, CAPTCHA, robot checks, or a security challenge, return {"products": []}.

Required fields per product:
- name
- image
- price
- rating
- reviews
- in_stock
- listing_url
- shipping_fee
- delivery_countries
- description_text
- review_text
- source_site set to "${input.site}"

Site-specific guidance:
- ${strategy.listingGoalHint}

Return JSON only using exactly this shape:
${sampleJson}
`.trim();
};
