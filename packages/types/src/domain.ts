export interface Owner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredArea?: string;
  preferredVet?: string;
  preferredGroomer?: string;
  budgetRange?: string;
  notificationPreferences: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  birthday?: string;
  ageText?: string;
  sex?: string;
  weight?: string;
  allergies: string[];
  medications: string[];
  ownerNotes?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetConcernTag {
  id: string;
  petId: string;
  tag: string;
  source: 'owner' | 'model' | 'clinician' | 'system';
  confidence: number;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  fileUrl: string;
  fileType: string;
  title: string;
  extractedText?: string;
  extractedMetadata?: Record<string, unknown>;
  uploadedAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  administeredOn?: string;
  dueOn?: string;
  providerName?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  providerId: string | null;
  type: string;
  scheduledAt: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Reminder {
  id: string;
  petId: string;
  type: string;
  title: string;
  dueAt: string;
  recurrenceRule?: string;
  status: 'pending' | 'done' | 'dismissed';
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  species?: string;
  breed?: string;
  ageGroup?: string;
  severity?: string;
  symptomTags: string[];
  category: string;
  summary: string;
  body: string;
  homeCareTips: string[];
  whenToEscalate: string[];
  urgentRedFlags: string[];
  relatedQuestions: string[];
  productCategories: string[];
  serviceCategories: string[];
  reviewedAt?: string;
  sourceType: 'internal' | 'vetted-external';
}

export interface ListingSourceMetadata {
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  scrapedAt: string;
  freshnessTimestamp: string;
}

export interface Provider {
  id: string;
  name: string;
  area?: string;
  specialties: string[];
  rating?: number;
  sourceMetadata: ListingSourceMetadata;
}

export interface ProviderService {
  id: string;
  providerId: string;
  name: string;
  category: string;
  priceText?: string;
}

export interface ProviderReview {
  id: string;
  providerId: string;
  author?: string;
  rating?: number;
  text?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  priceText?: string;
  sourceMetadata: ListingSourceMetadata;
}

export interface ProductReview {
  id: string;
  productId: string;
  author?: string;
  rating?: number;
  text?: string;
  createdAt?: string;
}

export interface TinyfishRawListing {
  source: string;
  listingType: 'provider' | 'product' | 'service';
  payload: Record<string, unknown>;
  scrapedAt: string;
}

export type SupportedSite = 'amazon' | 'petmall' | 'petlovers';

export interface TinyFishScrapeRequest {
  keywords: string;
  sites: SupportedSite[];
  maxProductsPerSite?: number;
  countryCode?: string;
}

export interface RawTinyFishProduct {
  name?: string;
  image?: string;
  price?: number | null;
  rating?: number | null;
  reviews?: number | null;
  in_stock?: boolean | null;
  listing_url?: string;
  shipping_fee?: number | null;
  delivery_countries?: string[] | null;
  description_text?: string | null;
  review_text?: string | null;
  product_keywords?: string[];
  source_site: SupportedSite;
}

export interface RawTinyFishSiteResult {
  products: RawTinyFishProduct[];
  blocked_reason?: string | null;
  notes?: string | null;
}

export interface NormalizedProductListing {
  id: string;
  source_site: SupportedSite;
  search_keywords: string;
  name: string | null;
  image: string | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  listing_url: string | null;
  shipping_fee: number | null;
  delivery_countries: string[];
  product_keywords: string[];
  description_text: string | null;
  review_text: string | null;
}

export interface TinyFishFailureResult {
  status: 'failed' | 'blocked';
  source_site: SupportedSite;
  error_message: string;
  raw_result?: unknown;
}

export interface TinyFishRunOutcome {
  status: 'completed' | 'failed' | 'blocked' | 'partial';
  source_site: SupportedSite;
  raw_result: unknown;
  normalized_results: NormalizedProductListing[];
  error_message?: string;
  used_stealth_fallback?: boolean;
  raw_file_path?: string;
  normalized_file_path?: string;
}

export interface TinyFishScrapeJobResult {
  keywords: string;
  requestedSites: SupportedSite[];
  status: 'completed' | 'failed' | 'blocked' | 'partial';
  site_outcomes: TinyFishRunOutcome[];
  normalized_results: NormalizedProductListing[];
  files: {
    raw: string[];
    normalized: string[];
  };
  started_at: string;
  completed_at: string;
}
