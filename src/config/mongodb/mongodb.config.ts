import { registerAs } from '@nestjs/config';
import { registerEnv } from '@common/utils/register-env.util';
import { MongodbDtoConfig } from './mongodb-dto.config';

export const MongoDBConfigName = 'mongodb_config';

export interface MongoDBConfig {
  dbName: string;
  user: string;
  password: string;
  host: string;
  port: number;
}

export default registerAs(
  MongoDBConfigName,
  (): MongoDBConfig =>
    registerEnv<MongodbDtoConfig, MongoDBConfig>({
      plain: {
        dbName: process.env.MONGODB_DATABASE!,
        user: process.env.MONGODB_USERNAME!,
        password: process.env.MONGODB_PASSWORD!,
        host: process.env.MONGODB_HOST!,
        port: Number(process.env.MONGODB_PORT!),
      },
      classConstructor: MongodbDtoConfig,
    }),
);
