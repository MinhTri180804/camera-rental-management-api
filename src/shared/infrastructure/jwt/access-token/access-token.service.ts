import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtAccessTokenService,
  JwtAccessTokenPayload,
} from '@shared/domain/ports/access-token.service';

@Injectable()
export class JwtAccessTokenServiceIml implements IJwtAccessTokenService {
  constructor(private readonly _jwtService: JwtService) {}

  generate(payload: JwtAccessTokenPayload): string {
    return this._jwtService.sign(payload);
  }

  validate(token: string): JwtAccessTokenPayload {
    return this._jwtService.verify(token);
  }

  decode(token: string): JwtAccessTokenPayload {
    return this._jwtService.decode(token);
  }
}
