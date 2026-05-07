import { Module } from '@nestjs/common';
import { CacheModule as CacheModuleNestjs } from '@nestjs/cache-manager';
import { CacheRedisFactory } from './redis/redis.factory';
import { CACHE_SERVICE_TOKEN } from '@shared/domain/ports/cache.service';
import { CacheServiceIml } from './cache.service';

@Module({
  imports: [
    CacheModuleNestjs.registerAsync({
      useClass: CacheRedisFactory,
    }),
  ],
  providers: [
    {
      provide: CACHE_SERVICE_TOKEN,
      useClass: CacheServiceIml,
    },
  ],
  exports: [CACHE_SERVICE_TOKEN],
})
export class CacheModule {}
