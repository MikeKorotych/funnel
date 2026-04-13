import { tracker } from "./tracker";
import { consoleAdapter } from "./adapters/console";

// Register adapters
tracker.register(consoleAdapter);

// In production, register real adapters:
// import { amplitudeAdapter } from "./adapters/amplitude";
// import { fbPixelAdapter } from "./adapters/facebook-pixel";
// tracker.register(amplitudeAdapter);
// tracker.register(fbPixelAdapter);

export { tracker } from "./tracker";
export { EVENTS } from "./events";
