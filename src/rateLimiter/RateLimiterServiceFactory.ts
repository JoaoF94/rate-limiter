import {RateLimiterType} from "./domain/RateLimiterType";
import {InMemoryRateLimiterService} from "./InMemoryRateLimiterService";

/**
 * Doesn't do much right now, but the idea is to
 * be extendable for other type of Rate Limiters, using different storages (Redis or a DB for example)
 *
 * A nice refactor: We may change it to RateLimiterPERSISTENCEFactory if the only thing that is going to change
 * is the persistence layer and we may keep one unique service with the business logic.
 */
class RateLimiterServiceFactory {
  buildService(type: RateLimiterType) {
    switch(type) {
      case RateLimiterType.IN_MEMORY:
        return InMemoryRateLimiterService.getInstance();
      default:
        return InMemoryRateLimiterService.getInstance();
    }
  }
}

export { RateLimiterServiceFactory };