import { createHash } from "node:crypto";

export type MarkdownChunk = {
  sectionHeading: string;
  title: string | null;
  content: string;
  contentHash: string;
};

function hashContent(s: string): string {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

/**
 * Splits markdown on level-2 headings (## ...).
 * Material before the first ## becomes an "Overview" chunk (e.g. title + disclaimer).
 */
export function chunkMarkdownByH2(markdown: string, sourcePath: string): MarkdownChunk[] {
  const lines = markdown.split(/\r?\n/);
  let docTitle: string | null = null;
  let bodyStart = 0;

  if (lines[0]?.trim().startsWith("# ")) {
    docTitle = lines[0].trim().slice(2).trim();
    bodyStart = 1;
  }

  const body = lines.slice(bodyStart).join("\n");
  const h2Regex = /^## (.+)$/gm;
  const headings: { index: number; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(body)) !== null) {
    headings.push({ index: m.index, title: m[1].trim() });
  }

  const chunks: MarkdownChunk[] = [];

  if (headings.length === 0) {
    const trimmed = body.trim();
    if (!trimmed) return chunks;
    const content = (docTitle ? `${docTitle}\n\n` : "") + trimmed;
    const slice = content.slice(0, 8000);
    chunks.push({
      sectionHeading: docTitle ?? "Document",
      title: docTitle,
      content: slice,
      contentHash: hashContent(slice + "\n" + sourcePath),
    });
    return chunks;
  }

  const firstH2Start = headings[0].index;
  const preamble = body.slice(0, firstH2Start).trim();
  if (preamble) {
    const block = (docTitle ? `${docTitle}\n\n` : "") + preamble;
    const slice = block.slice(0, 8000);
    chunks.push({
      sectionHeading: "Overview",
      title: docTitle,
      content: slice,
      contentHash: hashContent(slice + "\n" + sourcePath + "#overview"),
    });
  }

  for (let i = 0; i < headings.length; i += 1) {
    const h = headings[i];
    const nextStart = headings[i + 1]?.index ?? body.length;
    const sectionRaw = body.slice(h.index, nextStart);
    const withoutHeading = sectionRaw.replace(/^## .+$/m, "").trim();
    const block = `${h.title}\n\n${withoutHeading}`.trim();
    const slice = block.slice(0, 8000);
    chunks.push({
      sectionHeading: h.title,
      title: docTitle,
      content: slice,
      contentHash: hashContent(slice + "\n" + sourcePath + `#${i}`),
    });
  }

  return chunks;
}
