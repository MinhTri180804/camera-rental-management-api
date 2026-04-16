import { IJwtService } from '@modules/auth/shared/domain/port/jwt.service';
import {
  JWT_REFRESH_TOKEN_SERVICE,
  JwtRefreshTokenPayload,
  type IJwtRefreshTokenService,
} from '@modules/auth/shared/domain/port/refresh-token.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  JWT_ACCESS_TOKEN_SERVICE,
  JwtAccessTokenPayload,
  type IJwtAccessTokenService,
} from '@shared/domain/ports';

@Injectable()
export class JwtServiceIml implements IJwtService {
  constructor(
    @Inject(JWT_ACCESS_TOKEN_SERVICE)
    private readonly _jwtAccessTokenService: IJwtAccessTokenService,

    @Inject(JWT_REFRESH_TOKEN_SERVICE)
    private readonly _jwtRefreshTokenService: IJwtRefreshTokenService,
  ) {}

  signAccessToken({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }): string {
    return this._jwtAccessTokenService.generate({
      email,
      sub: userId,
    });
  }

  signRefreshToken({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }): string {
    return this._jwtRefreshTokenService.generate({
      email,
      sub: userId,
    });
  }

  verifyAccessToken(token: string): JwtAccessTokenPayload {
    return this._jwtAccessTokenService.validate(token);
  }

  verifyRefreshToken(token: string): JwtRefreshTokenPayload {
    return this._jwtRefreshTokenService.validate(token);
  }
}
