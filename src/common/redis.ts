import Redis from 'ioredis';

interface Request {
  key: string;
  expirationTime?: number;
  value?: string;
}

class RedisCache {
  redis: any;

  constructor() {
    this.redis = new Redis({
      port: parseInt(process.env.REDIS_PORT) || 6379,
      host: process.env.REDIS_HOST || 'localhost',
      keyPrefix: 'cache:',
    });
  }

  public async get({ key }: Request) {
    console.log('function activated');
    const tokens = await this.redis.get(key);
    return tokens ? JSON.parse(tokens) : null;
  }

  public set({ key, value, expirationTime }: Request) {
    return this.redis.set(key, JSON.stringify(value), 'EX', expirationTime);
  }

  public del({ key }: Request) {
    return this.redis.del(key);
  }
}

export default new RedisCache();
