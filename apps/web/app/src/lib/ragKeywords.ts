/** Strip common markdown / formatting so RAG answers display and tokenize as plain text. */
export function ragAnswerToPlainText(rag: string): string {
  let s = rag.replace(/\r\n/g, '\n');
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/^#{1,6}\s+/gm, '');
  s = s.replace(/^\s*[-*+]\s+/gm, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const STOP = new Set(
  [
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'if',
    'so',
    'to',
    'of',
    'in',
    'on',
    'for',
    'at',
    'by',
    'with',
    'as',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'it',
    'its',
    'this',
    'that',
    'these',
    'those',
    'from',
    'your',
    'you',
    'we',
    'they',
    'their',
    'may',
    'can',
    'could',
    'should',
    'would',
    'will',
    'just',
    'also',
    'not',
    'no',
    'yes',
    'when',
    'what',
    'which',
    'who',
    'how',
    'why',
    'into',
    'about',
    'over',
    'such',
    'any',
    'all',
    'each',
    'than',
    'then',
    'there',
    'here',
    'very',
    'more',
    'most',
    'some',
    'only',
    'other',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'done',
  ].map((w) => w.toLowerCase()),
);

/**
 * Up to `max` keyword tokens for TinyFish (passed as a single space-joined string).
 * Prefers non-stopword terms by frequency, then length.
 */
export function extractKeywordsFromPlainText(plain: string, max = 15): string[] {
  const lower = plain.toLowerCase();
  const tokens = lower.match(/\b[a-z][a-z'-]{1,}\b/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of tokens) {
    if (STOP.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const ranked = [...freq.entries()].sort(
    (a, b) => b[1] - a[1] || b[0].length - a[0].length,
  );
  const out: string[] = [];
  const seen = new Set<string>();
  for (const [w] of ranked) {
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
    if (out.length >= max) return out;
  }
  for (const w of tokens) {
    if (STOP.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
    if (out.length >= max) return out;
  }
  const fallback = plain
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9'-]/g, '').toLowerCase())
    .filter((w) => w.length > 2 && !STOP.has(w));
  for (const w of fallback) {
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
    if (out.length >= max) break;
  }
  if (out.length === 0 && plain.trim().length > 0) {
    const rough = plain
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9'-]/g, '').toLowerCase())
      .filter((w) => w.length > 1)
      .slice(0, max);
    return rough.length > 0 ? rough : ['pet'];
  }
  return out.slice(0, max);
}
