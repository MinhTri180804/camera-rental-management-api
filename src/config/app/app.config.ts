import { NODE_ENV_ENUM } from '@common/constants/config/node-env.constants';
import { DEFAULT_PORT } from '@common/default/port.default';
import { registerAs } from '@nestjs/config';
import { AppConfigDTO } from './app-dto.config';
import { registerEnv } from '@common/utils/register-env.util';

export const AppConfigName = 'app_config';

export interface AppConfig {
  port: number;
  nodeEnv: NODE_ENV_ENUM;
}

export default registerAs(AppConfigName, () =>
  registerEnv<AppConfigDTO, AppConfig>({
    classConstructor: AppConfigDTO,
    plain: {
      port: Number(process.env.PORT || DEFAULT_PORT),
      nodeEnv: process.env.NODE_ENV as NODE_ENV_ENUM,
    },
  }),
);
