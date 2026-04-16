import { registerAs } from '@nestjs/config';
import { registerEnv } from '@common/utils/register-env.util';
import { RefreshTokenDTOConfig } from './refresh-token-dto.config';

export const refreshTokenConfigName = 'refresh_token_config';

export interface RefreshTokenConfig {
  secret: string;
  expiresIn: number;
}

export default registerAs<RefreshTokenConfig>(refreshTokenConfigName, () =>
  registerEnv({
    classConstructor: RefreshTokenDTOConfig,
    plain: {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    },
  }),
);
