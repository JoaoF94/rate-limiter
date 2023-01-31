import {RequestsRemainingPayload} from "../domain/RequestsRemainingPayload";
import {Config} from "../domain/Config";
import {envConfig} from "../../env/env";
import {IRateLimiterService} from "../IRateLimiterService";
import {RateLimiterServiceFactory} from "../RateLimiterServiceFactory";

const rateLimit = (config: Config) => {
  const { tokens, windowTimeInMinutes, type } = config;
  const rateLimiterServiceFactory = new RateLimiterServiceFactory();

  return (target: Object, decoratedFnName: string, descriptor: PropertyDescriptor) => {
    const childFunction = descriptor.value;
    descriptor.value = (...args: any[]) => {
      const [req, res] = args;
      const userId = req.headers["username"];

      const rateLimiterSvc: IRateLimiterService = rateLimiterServiceFactory.buildService(type);
      rateLimiterSvc.init(config, userId);
      const hasValidToken = rateLimiterSvc.useToken(userId);
      const rateLimiterTracker = rateLimiterSvc.getRemainingTokensAndTime(userId);
      const requestsRemaining = new RequestsRemainingPayload(rateLimiterTracker, envConfig.rateLimiter.windowTimeInMinutes);

      return hasValidToken ?
        // @ts-ignore
        childFunction.apply(this, args)
        : res.status(429).json({ message:`Rate limit exceeded. Try again in ${requestsRemaining.secondsMissing} seconds`});
    };
    return descriptor;
  }
}

export { rateLimit };