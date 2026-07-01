import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class CategoryNotFoundException extends DomainException {
  static readonly ERROR_CODE = 'CATEGORY_NOT_FOUND';
  static readonly DEFAULT_MESSAGE = 'Category not found';

  constructor(message = CategoryNotFoundException.DEFAULT_MESSAGE) {
    super(
      CategoryNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
