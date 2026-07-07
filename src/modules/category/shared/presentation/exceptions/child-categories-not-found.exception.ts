import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class ChildCategoriesNotFoundException extends DomainException {
  static readonly ERROR_CODE = 'CHILD_CATEGORIES_NOT_FOUND';
  static readonly DEFAULT_MESSAGE = 'Child categories not found';
  constructor(
    childCategoriesId: string[],
    message = ChildCategoriesNotFoundException.DEFAULT_MESSAGE,
  ) {
    super(
      ChildCategoriesNotFoundException.ERROR_CODE,
      message,
      childCategoriesId,
      HttpStatus.NOT_FOUND,
    );
  }
}
