import { JwtAccessTokenPayload } from '@shared/domain/ports/access-token.service';
import { JwtRefreshTokenPayload } from './refresh-token.service';

export interface IJwtService {
  signAccessToken(payload: { userId: string; email: string }): string;
  signRefreshToken(payload: { userId: string; email: string }): string;
  verifyAccessToken(token: string): JwtAccessTokenPayload;
  verifyRefreshToken(token: string): JwtRefreshTokenPayload;
}

export const JWT_SERVICE_TOKEN = Symbol('JWT_SERVICE');
