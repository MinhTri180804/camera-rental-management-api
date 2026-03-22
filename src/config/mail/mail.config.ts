import { registerEnv } from '@common/utils/register-env.util';
import { registerAs } from '@nestjs/config';
import { MailConfigDTO } from './mail-dto.config';

export const mailConfigName = 'mail_config';

export interface MailConfig {
  emailFrom: string;
}

export default registerAs<MailConfig>(mailConfigName, () =>
  registerEnv({
    classConstructor: MailConfigDTO,
    plain: {
      emailFrom: process.env.EMAIL_FROM!,
    },
  }),
);
