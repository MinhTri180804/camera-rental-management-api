import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class BrandNotFoundException extends DomainException {
  static readonly DEFAULT_MESSAGE = '';
  static readonly ERROR_CODE = 'BRAND_NOT_FOUND';

  constructor(message = BrandNotFoundException.DEFAULT_MESSAGE) {
    super(
      BrandNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
