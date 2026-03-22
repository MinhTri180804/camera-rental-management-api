import { RedisConfig, RedisConfigName } from '@config/redis/redis.config';
import KeyvRedis from '@keyv/redis';
import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheRedisFactory implements CacheOptionsFactory {
  private _emitListenEvent(redisStore: KeyvRedis<unknown>) {
    redisStore.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisStore.on('connect', () => {
      console.log('Redis connected');
    });
  }
  constructor(private readonly _configService: ConfigService) {}
  createCacheOptions(): CacheOptions<Record<string, any>> {
    const { host, port } =
      this._configService.getOrThrow<RedisConfig>(RedisConfigName);
    const uri = `redis://${host}:${port}`;
    const store = new KeyvRedis(uri, {
      throwOnConnectError: true,
      throwOnErrors: true,
    });

    this._emitListenEvent(store);

    return { stores: [store] };
  }
}
