import type { EventName } from "../events";

/** Dev-mode adapter that logs all events to browser console */
export const consoleAdapter = {
  name: "console",
  track(event: EventName, properties?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "development") return;
    console.log(
      `%c[Analytics] ${event}`,
      "color: #00d4ff; font-weight: bold",
      properties ?? "",
    );
  },
  identify(userId: string, traits?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "development") return;
    console.log(
      `%c[Analytics] identify: ${userId}`,
      "color: #7c3aed; font-weight: bold",
      traits ?? "",
    );
  },
};
