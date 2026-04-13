import type { EventName } from "./events";

type EventProperties = Record<string, string | number | boolean | null>;

type AnalyticsAdapter = {
  name: string;
  track: (event: EventName, properties?: EventProperties) => void;
  identify?: (userId: string, traits?: EventProperties) => void;
};

class AnalyticsTracker {
  private adapters: AnalyticsAdapter[] = [];

  register(adapter: AnalyticsAdapter) {
    this.adapters.push(adapter);
  }

  track(event: EventName, properties?: EventProperties) {
    for (const adapter of this.adapters) {
      try {
        adapter.track(event, properties);
      } catch {
        // silently fail — analytics should never break the app
      }
    }
  }

  identify(userId: string, traits?: EventProperties) {
    for (const adapter of this.adapters) {
      try {
        adapter.identify?.(userId, traits);
      } catch {
        // silently fail
      }
    }
  }
}

export const tracker = new AnalyticsTracker();
