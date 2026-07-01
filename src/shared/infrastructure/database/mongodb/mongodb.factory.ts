import { NODE_ENV_ENUM } from '@common/constants/config/node-env.constants';
import { AppConfig, AppConfigName } from '@config/app/app.config';
import {
  MongoDBConfig,
  MongoDBConfigName,
} from '@config/mongodb/mongodb.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class MongoDBFactory implements MongooseOptionsFactory {
  protected readonly TIMEOUT_MS = 5000;
  protected readonly AUTO_INDEX = true;
  protected readonly SERVER_SELECTION_TIMEOUT_MS = 5000;

  constructor(private readonly _configService: ConfigService) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const { nodeEnv } =
      this._configService.getOrThrow<AppConfig>(AppConfigName);

    const { dbName, password, user, host, port } =
      this._configService.getOrThrow<MongoDBConfig>(MongoDBConfigName);

    if (nodeEnv === NODE_ENV_ENUM.DEVELOPMENT) mongoose.set('debug', true);

    return {
      uri: `mongodb://${user}:${password}@${host}:${port}`,
      dbName,
      authSource: 'admin',
      replicaSet: 'rs0',
      timeoutMS: this.TIMEOUT_MS,
      autoIndex: this.AUTO_INDEX,
      serverSelectionTimeoutMS: this.SERVER_SELECTION_TIMEOUT_MS,
      onConnectionCreate: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connected');
        });

        connection.on('error', (error) => {
          console.error('MongoDB error', error);
        });
      },
    };
  }
}
