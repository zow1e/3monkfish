-- FAQ library (MVP): hard-coded Holland Lop entries for RAG / product demos.
-- Run in Supabase SQL Editor after 001_rag_chunks.sql (extension vector already exists).
-- Next: run 003_rag_faq_chunks.sql to copy these rows into public.rag_chunks for embeddings (then pnpm rag:ingest).

create table if not exists public.faq_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  question text not null,
  answer_markdown text not null,
  species text not null default 'rabbit',
  breed text not null default 'holland_lop',
  category text not null default 'general',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_articles_slug_key unique (slug)
);

create index if not exists faq_articles_species_breed_idx
  on public.faq_articles (species, breed);

create index if not exists faq_articles_category_idx
  on public.faq_articles (category);

comment on table public.faq_articles is 'Curated FAQs; general education only—not veterinary diagnosis or treatment.';

insert into public.faq_articles (slug, question, answer_markdown, category, sort_order)
values
(
  'holland-lop-shedding-adult',
  'Why is my 4-year-old Holland Lop shedding so much?',
  $markdown$
**Disclaimer:** General pet-care education only—not a substitute for a rabbit-savvy veterinarian.

Holland Lops have a dense coat and often go through **normal seasonal or stress-related molts**, especially in spring and fall. At four years old, heavy shedding can still be within normal range if your rabbit is otherwise eating well, active, passing normal fecal pellets, and has healthy skin (no bald patches, scabs, or intense scratching).

**Things that commonly increase shedding**

- Seasonal coat change
- Indoor heating or humidity shifts
- Stress (recent move, new pet, loud environment)
- Reduced grooming if overweight or sore (e.g., arthritis—more common as rabbits age)

**Supportive home care**

- Gentle brushing with a rabbit-safe brush during molts; remove loose fur to reduce hair ingestion
- Unlimited grass hay, fresh water, and consistent diet (avoid sudden food changes)
- Enrichment and a calm routine

**When to contact a vet promptly**

- Bald patches, red or flaky skin, open wounds, or heavy scratching (possible parasites, infection, or allergy)
- **Reduced appetite**, smaller or fewer fecal pellets, bloating, or lethargy (can be serious in rabbits; seek **urgent** rabbit-experienced care)
- Any sudden behavior change that worries you

If you are unsure, a quick check-in with a **rabbit-experienced vet** is reasonable, especially if appetite or stool output has changed.
$markdown$,
  'grooming',
  1
),
(
  'holland-lop-reduced-hay-intake',
  'My 4-year-old Holland Lop is not eating as much hay. Should I worry?',
  $markdown$
**Disclaimer:** General pet-care education only—not a substitute for a rabbit-savvy veterinarian.

Hay should be the **main food** for healthy adult rabbits. A noticeable drop in hay interest is **worth taking seriously** because rabbits can develop **gastrointestinal (GI) stasis** or dental pain, both of which can become emergencies.

**First checks at home (same day)**

- Is your rabbit eating **anything** (pellets, greens) or **nothing**?
- Are **fecal pellets** normal in size and number, or smaller/absent?
- Any **hunched posture**, teeth grinding, bloating, or less movement?
- Any recent diet change, new treats, or stress?

**If hay is down but the rabbit is still eating other foods and stools look normal**

- Offer fresh, fragrant hay; try a different cut or mix (e.g., timothy, orchard) if your vet has approved variety
- Reduce pellets slightly if they are overfed (pellets can crowd out hay—ask your vet for amounts)
- Rule out pain (mouth, spine, sore hocks) that makes it hard to eat comfortably

**When to treat as urgent**

- **Not eating** or **markedly reduced food intake** for roughly **12 hours** or less in a small/risky rabbit, or **any** sign of pain, bloat, or no stool—contact an **emergency rabbit-savvy vet** **now**. GI issues in rabbits can deteriorate quickly.

This is one situation where **waiting “a few days” is usually not appropriate** without professional guidance.
$markdown$,
  'diet',
  2
),
(
  'holland-lop-bored-less-active',
  'What can I do if my 4-year-old Holland Lop seems bored or less active?',
  $markdown$
**Disclaimer:** General pet-care education only—not a substitute for a rabbit-savvy veterinarian.

A **less active** rabbit can be **normal** (resting more as an adult) or a **sign of illness, pain, or boredom**. First rule out health issues before assuming it is only behavior.

**Red flags—contact a vet if you see these**

- **Not eating normally**, smaller or fewer fecal pellets, weight loss, hunched posture, drooling, head tilt, labored breathing, or sudden collapse
- **Gradual** decrease in activity **with** weight change or stool changes

**If your vet says your rabbit is healthy**

Rabbits need **space, predictability, and safe things to do**.

- **Larger exercise area** daily (supervised if not fully bunny-proofed)
- **Tunnels, hides, low platforms**, and **safe chew toys** (hay-based, untreated wood, cardboard)
- **Digging box** (e.g., shredded paper or a towel to rearrange)
- **Foraging**: hay in racks, toilet-paper tubes stuffed with hay, scattered pellets in a snuffle mat (if diet allows)
- **Social time** with you on the floor; some rabbits enjoy a **compatible bonded partner** (introductions must be done carefully with guidance)

**Holland Lop note**

Lop breeds can be prone to ear issues; if “low energy” comes with head tilt, ear scratching, or odor from ears, schedule a vet visit.

When in doubt, a **wellness exam** can separate “quiet personality” from pain or illness.
$markdown$,
  'behavior',
  3
)
on conflict (slug) do update set
  question = excluded.question,
  answer_markdown = excluded.answer_markdown,
  category = excluded.category,
  sort_order = excluded.sort_order,
  updated_at = now();
