-- PetCare Copilot RAG — Holland Lop MVP corpus
-- Run once on your Postgres (Supabase: SQL Editor → New query → paste → Run)

create extension if not exists vector;

create table if not exists public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  corpus text not null default 'breed_guide',
  species text not null default 'rabbit',
  breed text not null default 'holland_lop',
  title text,
  section_heading text not null,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  source_path text,
  content_hash text not null,
  embedding_model text not null default 'text-embedding-3-small',
  created_at timestamptz not null default now(),
  constraint rag_chunks_content_hash_key unique (content_hash)
);

create index if not exists rag_chunks_species_breed_idx
  on public.rag_chunks (species, breed);

-- Optional after you have hundreds+ of rows (IVFFlat needs training data; omit for tiny MVP):
-- create index rag_chunks_embedding_ivfflat on public.rag_chunks
--   using ivfflat (embedding vector_cosine_ops) with (lists = 10);

comment on table public.rag_chunks is 'RAG chunks with OpenAI embeddings; educational content only, not veterinary advice.';
