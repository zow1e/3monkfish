import { createHash } from 'node:crypto';
import type { NormalizedProductListing, RawTinyFishProduct } from '@petcare/types';
import { normalizedProductListingSchema } from '@petcare/validations';
import { extractProductKeywords } from '../utils/keywords';

const cleanText = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const SOURCE_SITE_BASE_URL: Record<RawTinyFishProduct['source_site'], string> = {
  amazon: 'https://www.amazon.com',
  petmall: 'https://petmall.sg',
  petlovers: 'https://www.petloverscentre.com',
};

const normalizeUrl = (
  value: string | null | undefined,
  sourceSite: RawTinyFishProduct['source_site'],
): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed, SOURCE_SITE_BASE_URL[sourceSite]).toString();
  } catch {
    return null;
  }
};

const buildId = (site: string, listingUrl: string | null, productName: string | null): string =>
  createHash('sha1')
    .update([site, listingUrl ?? 'no-url', productName ?? 'no-name'].join('::'))
    .digest('hex')
    .slice(0, 16);

export const normalizeProductListing = (
  product: RawTinyFishProduct,
  searchKeywords: string,
): NormalizedProductListing =>
  normalizedProductListingSchema.parse({
    id: buildId(product.source_site, normalizeUrl(product.listing_url, product.source_site), cleanText(product.name)),
    source_site: product.source_site,
    search_keywords: searchKeywords,
    name: cleanText(product.name),
    image: normalizeUrl(product.image, product.source_site),
    price: product.price ?? null,
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    in_stock: product.in_stock ?? null,
    listing_url: normalizeUrl(product.listing_url, product.source_site),
    shipping_fee: product.shipping_fee ?? null,
    delivery_countries: (product.delivery_countries ?? []).map((country) => country.trim()).filter(Boolean),
    product_keywords:
      product.product_keywords && product.product_keywords.length > 0
        ? product.product_keywords
        : extractProductKeywords(
            [product.name, product.description_text].filter(Boolean).join(' '),
            product.review_text,
            searchKeywords,
          ),
    description_text: cleanText(product.description_text),
    review_text: cleanText(product.review_text),
  });
