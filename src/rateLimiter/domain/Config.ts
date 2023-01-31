import {RateLimiterType} from "./RateLimiterType";

interface Config {
  tokens: number;
  windowTimeInMinutes: number;
  type: RateLimiterType
}

export { Config };
