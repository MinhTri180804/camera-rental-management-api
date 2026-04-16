export type JwtAccessTokenPayload = {
  jti: string;
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export interface IJwtAccessTokenService {
  generate(payload: Omit<JwtAccessTokenPayload, 'iat' | 'exp' | 'jti'>): string;
  validate(token: string): JwtAccessTokenPayload;
  decode(token: string): JwtAccessTokenPayload;
}

export const JWT_ACCESS_TOKEN_SERVICE = Symbol('JWT_ACCESS_TOKEN_SERVICE');
