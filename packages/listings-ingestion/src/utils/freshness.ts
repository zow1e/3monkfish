export const resolveFreshnessTimestamp = (...timestamps: Array<string | undefined>): string => {
  const validTimestamps = timestamps.filter((value): value is string => Boolean(value));

  if (validTimestamps.length === 0) {
    return new Date().toISOString();
  }

  return validTimestamps.sort((left, right) => Date.parse(right) - Date.parse(left))[0];
};

export const isFreshWithinHours = (timestamp: string, hours: number, now = new Date()): boolean => {
  const ageMs = now.getTime() - Date.parse(timestamp);
  return ageMs <= hours * 60 * 60 * 1000;
};
