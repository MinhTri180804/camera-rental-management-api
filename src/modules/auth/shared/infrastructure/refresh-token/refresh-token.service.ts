import {
  IJwtRefreshTokenService,
  JwtRefreshTokenPayload,
} from '@modules/auth/shared/domain/port/refresh-token.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshTokenServiceImpl implements IJwtRefreshTokenService {
  constructor(private readonly _jwtService: JwtService) {}

  generate(payload: JwtRefreshTokenPayload): string {
    return this._jwtService.sign(payload);
  }

  validate(token: string): JwtRefreshTokenPayload {
    return this._jwtService.verify(token);
  }

  decode(token: string): JwtRefreshTokenPayload {
    return this._jwtService.decode(token);
  }
}
