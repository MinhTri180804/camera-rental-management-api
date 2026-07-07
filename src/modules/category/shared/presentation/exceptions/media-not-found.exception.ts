import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class MediaNotFoundException extends DomainException {
  static readonly ERROR_CODE = this.buildErrorCode({
    module: 'CATEGORY',
    resource: 'MEDIA',
    errorType: 'NOT_FOUND',
  });

  static readonly DEFAULT_MESSAGE = 'Media not found';

  constructor({
    fieldName,
    fieldValue,
    messageFieldName,
    message = MediaNotFoundException.DEFAULT_MESSAGE,
  }: {
    fieldName: string;
    fieldValue: string | number | string[] | number[];
    messageFieldName: string;
    message?: string;
  }) {
    super(
      MediaNotFoundException.ERROR_CODE,
      message,
      { fieldName, message: messageFieldName, fieldValue },
      HttpStatus.NOT_FOUND,
    );
  }
}
