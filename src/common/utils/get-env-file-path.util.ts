import { NODE_ENV_ENUM } from '@common/constants/config/node-env.constants';

export const getEnvFilePath = () => {
  switch (process.env.NODE_ENV as NODE_ENV_ENUM) {
    case NODE_ENV_ENUM.DEVELOPMENT:
      return '.env.dev';

    case NODE_ENV_ENUM.TEST:
      return '.env.test';

    case NODE_ENV_ENUM.PRODUCTION:
      return '.env.prod';

    default:
      return '.env.dev';
  }
};
