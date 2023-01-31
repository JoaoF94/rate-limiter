interface IRateLimiterTracker {
  currentWindowTimestamp: number;
  tokens: number;
}

export { IRateLimiterTracker };
