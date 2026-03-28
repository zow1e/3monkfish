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
  species: 'dog' | 'cat' | 'rabbit' | 'other';
  breed?: string;
  /** Human-readable age, e.g. "4 years", "6 months". */
  age?: string;
  birthday?: string;
  sex?: string;
  weight?: string;
  /** Region or country; MVP default Singapore. */
  location?: string;
  /** Short description of temperament and behavior. */
  personality?: string;
  /** URL of uploaded primary photo (e.g. Supabase Storage). */
  photoUrl?: string;
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
