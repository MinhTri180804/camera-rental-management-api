import {
  AccessTokenConfig,
  accessTokenConfigName,
} from '@config/access-token/access-token.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtAccessTokenPayload } from '@shared/domain/ports/access-token.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    const { secret } = _configService.getOrThrow<AccessTokenConfig>(
      accessTokenConfigName,
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtAccessTokenPayload): JwtAccessTokenPayload {
    return payload;
  }
}
