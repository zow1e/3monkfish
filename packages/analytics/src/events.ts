export interface AnalyticsEvent {
  name: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

export const trackEvent = async (_event: AnalyticsEvent): Promise<void> => {
  // TODO: wire to analytics backend.
};
