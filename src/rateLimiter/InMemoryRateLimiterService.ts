import {IRateLimiterService} from "./IRateLimiterService";
import {IRateLimiterTracker} from "./domain/IRateLimiterTracker";
import {RateLimiterTracker} from "./domain/RateLimiterTracker";
import {getMsFromMinutes} from "./utils/timeFormatter";
import {Config} from "./domain/Config";
import {defaultTokens, defaultWindowTimeMinutes, envConfig} from "../env/env";

class InMemoryRateLimiterService implements IRateLimiterService {
  private static instance: InMemoryRateLimiterService;

  private startingTokens: number = defaultTokens;
  private timeWindowInMinutes: number = defaultWindowTimeMinutes;
  private usersTrackerMap: Map<string, RateLimiterTracker> = new Map();

  private constructor() {}

  private isOnSameTimeWindow(now: number, currentSavedTimestamp: number) {
    return now - currentSavedTimestamp < getMsFromMinutes(this.timeWindowInMinutes)
  }

  private removeOneToken(userId: string, tokens: number, timestamp: number): void {
    this.usersTrackerMap.set(userId, {
      tokens: tokens - 1,
      currentWindowTimestamp: timestamp
    })
  }

  private resetTokenCountAndTimestamp(userId: string, timestamp: number): void {
    this.usersTrackerMap.set(userId, {
      tokens: this.startingTokens, currentWindowTimestamp: timestamp
    });
  }

  static getInstance(): InMemoryRateLimiterService {
    if (!InMemoryRateLimiterService.instance) {
      InMemoryRateLimiterService.instance = new InMemoryRateLimiterService();
    }
    return InMemoryRateLimiterService.instance;
  }

  init(config: Config, userId: string) {
    this.startingTokens = config.tokens;
    this.timeWindowInMinutes = config.windowTimeInMinutes;

    if (!InMemoryRateLimiterService.instance.usersTrackerMap.has(userId)) {
      InMemoryRateLimiterService.instance.usersTrackerMap.set(
        userId,
        { tokens: config.tokens, currentWindowTimestamp: new Date().getTime() }
      );
    }
  }

  /**
   * Main scenarios:
   * If the user is outside the time window, we reset the token counter and provide him a token.
   * If the user is inside the time window but still has tokens, he gets a token.
   * If the user is inside the time window but hasn't any more tokens, we do not grant him a token.
   * @param userId
   */
  useToken(userId: string) {
    let userTracker = this.usersTrackerMap.get(userId);
    console.log({map: this.usersTrackerMap});
    if (userTracker) {
      const currentTime = new Date().getTime();
      if (!this.isOnSameTimeWindow(currentTime, userTracker.currentWindowTimestamp)) {
        this.resetTokenCountAndTimestamp(userId, currentTime);
        userTracker = this.usersTrackerMap.get(userId)!;
      }
      if (userTracker.tokens > 0) {
        this.removeOneToken(userId, userTracker.tokens, userTracker.currentWindowTimestamp);
        return true;
      }
    }
    return false;
  }

  getRemainingTokensAndTime(userId: string): IRateLimiterTracker {
    const userTracker = this.usersTrackerMap.get(userId);
    if (!userTracker) {
      throw new Error("No user tracking found");
    }
    return userTracker;
  }
}

export { InMemoryRateLimiterService };