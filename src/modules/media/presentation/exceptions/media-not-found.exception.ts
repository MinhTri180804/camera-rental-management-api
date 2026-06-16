import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class MediaNotFoundException extends DomainException {
  static readonly ERROR_CODE = 'MEDIA_NOT_FOUND';
  static readonly DEFAULT_MESSAGE = 'Media not found';

  constructor(message = MediaNotFoundException.DEFAULT_MESSAGE) {
    super(
      MediaNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
