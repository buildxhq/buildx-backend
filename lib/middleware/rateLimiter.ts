// /lib/middleware/rateLimiter.ts — Redis-based Rate Limiter (Production Safe)

import { NextRequest } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!); // e.g., Upstash or your Redis instance

export function rateLimiter({
  windowSec = 60,
  max = 5,
}: {
  windowSec?: number;
  max?: number;
}) {
  return async function (req: NextRequest) {
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('host') ||
      'unknown';

    const key = `ratelimit:${ip}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSec);
    }

    if (current > max) {
      throw new Error('Too many requests — slow down.');
    }
  };
}

