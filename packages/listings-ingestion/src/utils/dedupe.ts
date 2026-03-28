export const dedupeByKey = <T>(items: readonly T[], getKey: (item: T) => string): T[] => {
  const seen = new Map<string, T>();
  for (const item of items) {
    seen.set(getKey(item), item);
  }

  return [...seen.values()];
};
