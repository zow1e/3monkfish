export const dedupeById = <T extends { id: string }>(items: T[]): T[] =>
  Object.values(items.reduce<Record<string, T>>((acc, item) => ({ ...acc, [item.id]: item }), {}));
