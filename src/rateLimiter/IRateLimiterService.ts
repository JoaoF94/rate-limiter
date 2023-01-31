import {IRateLimiterTracker} from "./domain/IRateLimiterTracker";
import {Config} from "./domain/Config";

interface IRateLimiterService {
  init: (config: Config, userId: string) => void;
  useToken: (userId: string) => boolean;
  getRemainingTokensAndTime: (userId: string) => IRateLimiterTracker;
}

export { IRateLimiterService };