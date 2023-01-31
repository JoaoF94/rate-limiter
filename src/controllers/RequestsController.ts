import {Request, Response} from 'express';
import {RequestsRemainingPayload} from "../rateLimiter/domain/RequestsRemainingPayload";
import {IRequestsController} from "./IRequestsController";
import {rateLimit} from "../rateLimiter/decorator/rateLimit";
import {InMemoryRateLimiterService} from "../rateLimiter/InMemoryRateLimiterService";
import {envConfig} from "../env/env";
import {RateLimiterType} from "../rateLimiter/domain/RateLimiterType";

class RequestsController implements IRequestsController {

  @rateLimit({...envConfig.rateLimiter, type: RateLimiterType.IN_MEMORY})
  async getRequests (req: Request, res: Response): Promise<Response> {
    const userId: string = req.headers["username"] as string;
    // hardcoded for simplicity, just to have visibility on the remaining available requests on the api response
    const rateLimiterTracker = InMemoryRateLimiterService.getInstance().getRemainingTokensAndTime(userId);
    return res.status(201).json(new RequestsRemainingPayload(rateLimiterTracker!, envConfig.rateLimiter.windowTimeInMinutes));
  };
}



export { RequestsController };