import { registerEnv } from '@common/utils/register-env.util';
import { registerAs } from '@nestjs/config';
import { NodemailerDTOConfig } from './nodemailer-dto.config';

export const nodemailerConfigName = 'nodemailer_config';

export interface NodemailerConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export default registerAs(
  nodemailerConfigName,
  (): NodemailerConfig =>
    registerEnv({
      classConstructor: NodemailerDTOConfig,
      plain: {
        host: process.env.NODEMAILER_HOST,
        port: Number(process.env.NODEMAILER_PORT),
        username: process.env.NODEMAILER_USERNAME,
        password: process.env.NODEMAILER_PASSWORD,
      },
    }),
);
