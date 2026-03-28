export const resolveFreshnessTimestamp = (...timestamps: Array<string | undefined>): string => {
  const validTimestamps = timestamps.filter((value): value is string => Boolean(value));

  if (validTimestamps.length === 0) {
    return new Date().toISOString();
  }

  return validTimestamps.sort((left, right) => Date.parse(right) - Date.parse(left))[0];
};
