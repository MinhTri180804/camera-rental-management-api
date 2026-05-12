/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AccessTokenConfig,
  accessTokenConfigName,
} from '@config/access-token/access-token.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtAccessTokenFactory implements JwtOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const { secret, expiresIn } =
      this._configService.getOrThrow<AccessTokenConfig>(accessTokenConfigName);

    return {
      secret,
      signOptions: {
        expiresIn: `${expiresIn}s`,
        jwtid: uuidv4(),
        algorithm: 'HS256',
      },
    };
  }
}
