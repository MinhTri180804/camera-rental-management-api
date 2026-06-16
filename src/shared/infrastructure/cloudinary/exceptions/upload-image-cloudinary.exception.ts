import { InfrastructureException } from '@shared/presentation';

export class UploadImageCloudinaryException extends InfrastructureException {
  constructor({
    httpCode,
    requestId,
    message,
    name,
  }: {
    httpCode: number;
    requestId: string | undefined;
    message: string;
    name: string;
  }) {
    super(httpCode, message, 'CLOUDINARY_PROVIDER', {
      requestId: requestId,
      name,
    });
  }
}
