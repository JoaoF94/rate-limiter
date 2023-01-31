interface EnvConfig {
  rateLimiter: {
    tokens: number;
    windowTimeInMinutes: number;
  }
}

export { EnvConfig };