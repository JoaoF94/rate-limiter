import {IRateLimiterTracker} from "./IRateLimiterTracker";

class RequestsRemainingPayload {
  tokens: number;
  secondsMissing: number;

  constructor(rateLimiterTracker: IRateLimiterTracker, windowTimeInMinutes: number) {
    const { tokens, currentWindowTimestamp } = rateLimiterTracker;
    this.tokens = tokens;
    const now = new Date().getTime();
    this.secondsMissing = Math.round(((windowTimeInMinutes * 60 * 1000) - (now - currentWindowTimestamp)) / 1000);
  }
}

export { RequestsRemainingPayload };