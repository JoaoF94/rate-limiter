import {Config} from "./domain/Config";
import {RateLimiterType} from "./domain/RateLimiterType";
import {InMemoryRateLimiterService} from "./InMemoryRateLimiterService";

const config: Config = {
  tokens: 3,
  type: RateLimiterType.IN_MEMORY,
  windowTimeInMinutes: 5
};

describe("InMemoryRateLimiterService", () => {
  const rateLimiterSvc = InMemoryRateLimiterService.getInstance();

  describe("when initiated for user Jon", () => {
    beforeAll(() => {
      rateLimiterSvc.init(config, "Jon");
      rateLimiterSvc.init(config, "Snow");
    });

    describe("when user Jon requests a token", () => {
      let result: boolean;
      beforeAll(() => {
        result = rateLimiterSvc.useToken("Jon");
      });

      it("number of tokens should decrease for Jon", () => {
        const {tokens} = rateLimiterSvc.getRemainingTokensAndTime("Jon");
        expect(result).toBeTruthy();
        expect(tokens).toEqual(2);
      });

      describe("when user Jon requests 3 more tokens", () => {
        let tries: boolean[] = [];
        beforeAll(() => {
          for(let i = 0; i < 3; i++) {
            tries.push(rateLimiterSvc.useToken("Jon"));
          }
        });

        it("should have received two tokens", () => {
          expect(tries[0]).toBeTruthy();
          expect(tries[1]).toBeTruthy();
        });

        it("should NOT have received the last token", () => {
          expect(tries[2]).toBeFalsy();
        });

        describe("when other user 'Snow' requests a token", () => {
          let result: boolean;
          beforeAll(() => {
            result = rateLimiterSvc.useToken("Snow");
          });

          it("should have received the token, because it's a different user", () => {
            expect(result).toBeTruthy();
            expect(rateLimiterSvc.getRemainingTokensAndTime("Snow").tokens).toEqual(2);
          });
        });

        describe("after the time window has passed", () => {
          beforeAll(() => {
            const currentDate = new Date();
            jest.useFakeTimers();
            jest.setSystemTime(new Date(currentDate.setMinutes(currentDate.getMinutes() + 5)));
          });

          describe("when user Jon requests one token", () => {
            let result: boolean;
            beforeAll(() => {
              result = rateLimiterSvc.useToken("Jon");
            });

            it("should receive a new token", () => {
              const { tokens } = rateLimiterSvc.getRemainingTokensAndTime("Jon");
              expect(result).toBeTruthy();
              expect(tokens).toEqual(2);
            });
          });

          afterAll(() => {
            jest.useRealTimers();
          });
        });
      });
    });
  });
});