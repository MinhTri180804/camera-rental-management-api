import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { getEnvFilePath } from '@common/utils/get-env-file-path.util';
import appConfig from './app/app.config';
import mongodbConfig from './mongodb/mongodb.config';
import redisConfig from './redis/redis.config';
import nodemailerConfig from './nodemailer/nodemailer.config';
import mailConfig from './mail/mail.config';
import accessTokenConfig from './access-token/access-token.config';
import refreshTokenConfig from './refresh-token/refresh-token.config';
import cloudinaryConfig from './cloudinary/cloudinary.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      cache: true,
      load: [
        appConfig,
        mongodbConfig,
        redisConfig,
        nodemailerConfig,
        mailConfig,
        accessTokenConfig,
        refreshTokenConfig,
        cloudinaryConfig,
      ],
    }),
  ],
  providers: [],
  exports: [],
})
export class ConfigModule {}
