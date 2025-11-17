import Redis from 'redis';
import { logger } from './logger';

export class RedisCache {
  private client: Redis.RedisClient;
  private isConnected = false;

  constructor(private host = 'localhost', private port = 6379) {
    this.client = Redis.createClient({
      host: this.host,
      port: this.port,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis connection refused');
          return new Error('Redis server connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis max retry attempts reached');
          return new Error('Max retry attempts reached');
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.client.on('connect', () => {
      logger.info('Redis connected successfully');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      logger.error(err, 'Redis connection error');
      this.isConnected = false;
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache get');
        return null;
      }
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      logger.error(error as Error, `Error getting cache key: ${key}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache set');
        return;
      }

      if (ttlSeconds) {
        await this.setexAsync(key, ttlSeconds, value);
      } else {
        await this.setAsync(key, value);
      }
    } catch (error) {
      logger.error(error as Error, `Error setting cache key: ${key}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache delete');
        return;
      }
      await this.delAsync(key);
    } catch (error) {
      logger.error(error as Error, `Error deleting cache key: ${key}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }
      const result = await this.existsAsync(key);
      return result === 1;
    } catch (error) {
      logger.error(error as Error, `Error checking cache key existence: ${key}`);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache clear');
        return;
      }
      await this.flushallAsync();
      logger.info('Cache cleared successfully');
    } catch (error) {
      logger.error(error as Error, 'Error clearing cache');
    }
  }

  async getStats(): Promise<any> {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected' };
      }
      const info = await this.infoAsync('all');
      return {
        status: 'connected',
        info: this.parseRedisInfo(info)
      };
    } catch (error) {
      logger.error(error as Error, 'Error getting cache stats');
      return { status: 'error', error: (error as Error).message };
    }
  }

  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const result: any = {};

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    }

    return result;
  }

  async disconnect(): Promise<void> {
    try {
      await this.quitAsync();
      this.isConnected = false;
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error(error as Error, 'Error disconnecting from Redis');
    }
  }

  // Promisify Redis methods
  private getAsync = (key: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private setAsync = (key: string, value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private setexAsync = (key: string, ttl: number, value: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.setex(key, ttl, value, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private delAsync = (key: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private existsAsync = (key: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private flushallAsync = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.flushall((err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private infoAsync = (section: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.info(section, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };

  private quitAsync = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.quit((err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  };
}
