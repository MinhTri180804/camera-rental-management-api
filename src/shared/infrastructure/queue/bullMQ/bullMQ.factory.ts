import { RedisConfig, RedisConfigName } from '@config/redis/redis.config';
import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullMQFactory implements SharedBullConfigurationFactory {
  constructor(private readonly _configService: ConfigService) {}

  createSharedConfiguration():
    | Promise<BullRootModuleOptions>
    | BullRootModuleOptions {
    const { host, port } =
      this._configService.getOrThrow<RedisConfig>(RedisConfigName);

    const isTestMode = process.env.NODE_ENV === 'test';

    return {
      connection: {
        host,
        port,
      },
      // Disable workers in test mode by not creating default worker
      defaultJobOptions: {
        removeOnComplete: isTestMode ? 1 : 10,
        removeOnFail: isTestMode ? 1 : 10,
      },
    };
  }
}
