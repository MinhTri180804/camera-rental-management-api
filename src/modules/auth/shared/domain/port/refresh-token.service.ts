export type JwtRefreshTokenPayload = {
  jti: string;
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export interface IJwtRefreshTokenService {
  generate(
    payload: Omit<JwtRefreshTokenPayload, 'iat' | 'exp' | 'jti'>,
  ): string;
  validate(token: string): JwtRefreshTokenPayload;
  decode(token: string): JwtRefreshTokenPayload;
}

export const JWT_REFRESH_TOKEN_SERVICE = Symbol('JWT_REFRESH_TOKEN_SERVICE');
