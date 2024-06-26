import { Redis } from "ioredis";

const redisUrl = () => {
  if (process.env.UPSTASH_KEY) {
    return process.env.UPSTASH_KEY;
  }

  throw new Error("UPSTASH_KEY is not defined");
};

export const redis = new Redis(redisUrl());
