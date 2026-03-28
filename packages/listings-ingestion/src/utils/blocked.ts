const BLOCKED_PATTERNS = [
  'access denied',
  'blocked',
  'captcha',
  'security challenge',
  'verify you are human',
  'robot or human',
];

export const detectBlockedResult = (payload: unknown): boolean => {
  const text = JSON.stringify(payload).toLowerCase();
  if (BLOCKED_PATTERNS.some((pattern) => text.includes(pattern))) {
    return true;
  }

  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const products = extractProducts(payload);
  if (products.length === 0) {
    return true;
  }

  return products.every((product) =>
    Object.values(product).every((value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return value === null || value === undefined || value === '';
    }),
  );
};

const extractProducts = (payload: unknown): Record<string, unknown>[] => {
  if (typeof payload !== 'object' || payload === null) {
    return [];
  }

  const candidate = payload as Record<string, unknown>;

  if (Array.isArray(candidate.products)) {
    return candidate.products.filter(
      (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
    );
  }

  if (typeof candidate.resultJson === 'object' && candidate.resultJson !== null) {
    const nested = candidate.resultJson as Record<string, unknown>;
    if (Array.isArray(nested.products)) {
      return nested.products.filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      );
    }
  }

  if (typeof candidate.result === 'object' && candidate.result !== null) {
    const nested = candidate.result as Record<string, unknown>;
    if (Array.isArray(nested.products)) {
      return nested.products.filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      );
    }
  }

  return [];
};
