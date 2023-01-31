import {IRateLimiterTracker} from "./IRateLimiterTracker";

class RateLimiterTracker implements IRateLimiterTracker {
  currentWindowTimestamp: number;
  tokens: number;

  constructor(currentWindowTimestamp: number, tokens: number) {
    this.currentWindowTimestamp = currentWindowTimestamp;
    this.tokens = tokens;
  }
}

export { RateLimiterTracker };