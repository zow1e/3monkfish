/** Logical name; physical table is `public.faq_articles` (see `db/migrations/002_faq_articles.sql`). */
export const faqArticlesTable = {
  name: 'faqArticles',
  physicalTable: 'faq_articles',
  columns: [
    'id',
    'slug',
    'question',
    'answer_markdown',
    'species',
    'breed',
    'category',
    'sort_order',
    'is_published',
    'created_at',
    'updated_at',
  ],
} as const;
