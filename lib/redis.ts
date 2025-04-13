// lib/redis.ts - Modern Redis client using ioredis for future task queues/sessions
import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('❌ REDIS_URL is not defined in your environment variables.');
}

export const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => console.log('✅ Redis Connected'));
redis.on('error', (err) => console.error('❌ Redis Error:', err));
