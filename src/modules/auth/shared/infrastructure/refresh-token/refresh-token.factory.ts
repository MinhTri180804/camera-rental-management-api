import {
  RefreshTokenConfig,
  refreshTokenConfigName,
} from '@config/refresh-token/refresh-token.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtRefreshTokenFactory implements JwtOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const { secret, expiresIn } =
      this._configService.getOrThrow<RefreshTokenConfig>(
        refreshTokenConfigName,
      );

    return {
      secret,
      signOptions: {
        expiresIn: expiresIn * 1000,
        jwtid: uuidv4(),
        algorithm: 'HS256',
      },
    };
  }
}
