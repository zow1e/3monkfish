/**
 * Parses argv for optional `--pet-id=<uuid>` / `--pet-id <uuid>` (after `pnpm … --`).
 * Also reads `process.env.PET_ID` when CLI omits pet id.
 */
export function parsePetIdAndQuery(
  argv: string[],
  defaultQuery: string,
): { petId: string | undefined; query: string } {
  let petId = process.env.PET_ID?.trim() || undefined;
  const rest: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith("--pet-id=")) {
      petId = a.slice("--pet-id=".length).trim() || petId;
    } else if (a === "--pet-id") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        petId = next.trim();
        i += 1;
      }
    } else {
      rest.push(a);
    }
  }

  const query = rest.join(" ").trim() || defaultQuery;
  return { petId, query };
}
