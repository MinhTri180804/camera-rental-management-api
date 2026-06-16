import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class BrandNotDeletedException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Brand is not deleted';
  static readonly ERROR_CODE = 'BRAND_NOT_DELETED';

  constructor(message = BrandNotDeletedException.DEFAULT_MESSAGE) {
    super(
      BrandNotDeletedException.ERROR_CODE,
      message,
      null,
      HttpStatus.BAD_REQUEST,
    );
  }
}
