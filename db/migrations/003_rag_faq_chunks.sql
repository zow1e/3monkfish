-- Mirror published FAQ rows into rag_chunks for vector search.
-- Run after 002_faq_articles.sql. Embeddings start as NULL; run `pnpm rag:ingest` to embed them.

alter table public.rag_chunks
  alter column embedding drop not null;

comment on column public.rag_chunks.embedding is
  'OpenAI embedding; NULL means pending (e.g. corpus faq row not yet processed by rag:ingest).';

insert into public.rag_chunks (
  corpus,
  species,
  breed,
  title,
  section_heading,
  content,
  embedding,
  metadata,
  source_path,
  content_hash,
  embedding_model
)
select
  'faq',
  f.species,
  f.breed,
  f.question,
  f.question,
  f.question || E'\n\n' || f.answer_markdown,
  null,
  jsonb_build_object(
    'faq_slug', f.slug,
    'faq_id', f.id::text,
    'category', f.category,
    'source', 'faq_articles'
  ),
  'faq_articles:' || f.slug,
  'faq:' || f.slug,
  'pending-embed'
from public.faq_articles f
where f.is_published = true
on conflict (content_hash) do update set
  content = excluded.content,
  title = excluded.title,
  section_heading = excluded.section_heading,
  metadata = excluded.metadata,
  source_path = excluded.source_path,
  embedding = coalesce(public.rag_chunks.embedding, excluded.embedding),
  embedding_model = case
    when public.rag_chunks.embedding is not null then public.rag_chunks.embedding_model
    else excluded.embedding_model
  end;

comment on table public.rag_chunks is
  'RAG chunks (breed_guide, faq, …) with OpenAI embeddings when present; education only, not veterinary advice.';
