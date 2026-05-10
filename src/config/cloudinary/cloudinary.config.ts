import { registerEnv } from '@common/utils/register-env.util';
import { registerAs } from '@nestjs/config';
import { CloudinaryConfigDTO } from './cloudinary-dto.config';

export const cloudinaryConfigName = 'cloudinary_config';

export interface CloudinaryConfig {
  apiKey: string;
  cloudName: string;
  apiSecret: string;
}

export default registerAs(
  cloudinaryConfigName,
  (): CloudinaryConfig =>
    registerEnv({
      classConstructor: CloudinaryConfigDTO,
      plain: {
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
    }),
);
