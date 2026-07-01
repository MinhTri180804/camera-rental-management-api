import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class ParentCategoryNotFoundException extends DomainException {
  static readonly _DEFAULT_MESSAGE = 'Parent category not found';
  static readonly _ERROR_CODE = 'PARENT_CATEGORY_NOT_FOUND';
  constructor(message = ParentCategoryNotFoundException._DEFAULT_MESSAGE) {
    super(
      ParentCategoryNotFoundException._ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
