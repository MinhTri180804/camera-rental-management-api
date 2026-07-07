import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class UnprocessableCategoryException extends DomainException {
  static readonly ERROR_CODE = this.buildErrorCode({
    module: 'CATEGORY',
    resource: 'category',
    errorType: 'CANNOT_CHANGE_PARENT',
  });
  static readonly DEFAULT_MESSAGE = 'Cannot change parent into this child';
  constructor(message = UnprocessableCategoryException.DEFAULT_MESSAGE) {
    super(
      UnprocessableCategoryException.ERROR_CODE,
      message,
      null,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
