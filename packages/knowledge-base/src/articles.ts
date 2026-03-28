export interface SeedArticle {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

export const seedArticles: SeedArticle[] = [
  { slug: 'excessive-shedding', title: 'Managing Excessive Shedding', summary: 'Baseline guidance.', body: 'TODO: add vetted content.' },
  { slug: 'itchy-skin', title: 'Itchy Skin Overview', summary: 'Common causes and care.', body: 'TODO: add vetted content.' },
  { slug: 'vomiting', title: 'Vomiting in Pets', summary: 'When to monitor vs escalate.', body: 'TODO: add vetted content.' },
  { slug: 'grooming-anxiety', title: 'Grooming Anxiety', summary: 'Behavior and desensitization basics.', body: 'TODO: add vetted content.' },
  { slug: 'picky-eating', title: 'Picky Eating', summary: 'Safe appetite support ideas.', body: 'TODO: add vetted content.' },
];
