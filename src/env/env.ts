import * as dotenv from "dotenv";
import {EnvConfig} from "./EnvConfig";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const defaultTokens = 20;
export const defaultWindowTimeMinutes = 60;

const envConfig: EnvConfig = {
  rateLimiter: {
    tokens: Number(process.env.RATE_LIMITER_TOKENS) || defaultTokens,
    windowTimeInMinutes: Number(process.env.RATE_LIMITER_WINDOW_TIME_MINUTES) || defaultWindowTimeMinutes
  }
};

export { envConfig };
