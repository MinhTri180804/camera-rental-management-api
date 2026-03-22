import { registerEnv } from '@common/utils/register-env.util';
import { registerAs } from '@nestjs/config';
import { RedisDTOConfig } from './redis-dto.config';

export const RedisConfigName = 'redis_config';

export interface RedisConfig {
  host: string;
  port: number;
}

export default registerAs(
  RedisConfigName,
  (): RedisConfig =>
    registerEnv<RedisDTOConfig, RedisConfig>({
      plain: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
      },
      classConstructor: RedisDTOConfig,
    }),
);
