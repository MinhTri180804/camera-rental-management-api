import { registerEnv } from '@common/utils/register-env.util';
import { registerAs } from '@nestjs/config';
import { AccessTokenDTOConfig } from './access-token-dto.config';

export const accessTokenConfigName = 'access_token_config';

export interface AccessTokenConfig {
  secret: string;
  expiresIn: number;
}

export default registerAs(
  accessTokenConfigName,
  (): AccessTokenConfig =>
    registerEnv({
      classConstructor: AccessTokenDTOConfig,
      plain: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
      },
    }),
);
