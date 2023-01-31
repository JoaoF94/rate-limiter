import {Request, Response} from "express";
import {rateLimit} from "./rateLimit";
import {Config} from "../domain/Config";
import {RateLimiterType} from "../domain/RateLimiterType";
import {RateLimiterServiceFactory} from "../RateLimiterServiceFactory";
import {RateLimiterTracker} from "../domain/RateLimiterTracker";

jest.mock("../RateLimiterServiceFactory");

const mockRateLimiterService = (isValidValue: boolean) => {
  (RateLimiterServiceFactory as jest.Mock).mockImplementation(() => {
    return {
      buildService: jest.fn().mockImplementation(() => {
        return {
          init: jest.fn(),
          useToken: jest.fn(() => isValidValue),
          getRemainingTokensAndTime: jest.fn(() => new RateLimiterTracker(1, 2))
        }
      })
    }
  });
};

const mockRequest = {
  headers: {
    username: "Johnny"
  }
} as unknown as Request;

const mockResponseStatus = jest.fn(() => mockResponse);
const mockResponse = {
  status: mockResponseStatus,
  json: jest.fn(() => mockResponse)
} as unknown as Response;

const config: Config = {
  tokens: 3, type: RateLimiterType.IN_MEMORY, windowTimeInMinutes: 2
}

describe("Rate Limit decorator", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("when user still has tokens", () => {
    beforeEach(() => {
      mockRateLimiterService(true);
    });

    it("should call the original function", () => {
      const originalFn = jest.fn();
      class TestClass {
        @rateLimit(config)
        public decoratedFn(req: Request) {
          originalFn();
        }
      }
      new TestClass().decoratedFn(mockRequest);
      expect(originalFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("when user has no more tokens", () => {
    beforeEach(() => {
      mockRateLimiterService(false);
    });

    const originalFn = jest.fn();
    let result: any;

    describe("when a given function is decorated", () => {
      beforeEach(() => {
        class TestClass {
          @rateLimit(config)
          public decoratedFn(req: Request, res: Response) {
            return originalFn();
          }
        }
        result = new TestClass().decoratedFn(mockRequest, mockResponse);
      });

      it("should NOT call the original function", () => {
        expect(originalFn).not.toHaveBeenCalled();
      });

      it("should have a response with status 429", () => {
        expect(mockResponseStatus).toHaveBeenCalledWith(429);
      });
    });
  });
});