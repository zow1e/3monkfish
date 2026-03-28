export const applyMetadataFilters = <T extends { metadata?: Record<string, unknown> }>(
  items: T[],
  filters: Record<string, unknown> = {},
): T[] => {
  if (!Object.keys(filters).length) return items;
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => item.metadata?.[key] === value),
  );
};
