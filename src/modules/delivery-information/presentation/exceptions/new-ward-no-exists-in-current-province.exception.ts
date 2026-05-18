import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class NewWardNoExistsInCurrentProvinceException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'New ward no exists in current province';
  static readonly ERROR_CODE = 'NEW_WARD_NO_EXISTS_IN_CURRENT_PROVINCE';

  constructor(
    message = NewWardNoExistsInCurrentProvinceException.DEFAULT_MESSAGE,
  ) {
    super(
      message,
      NewWardNoExistsInCurrentProvinceException.ERROR_CODE,
      null,
      HttpStatus.CONFLICT,
    );
  }
}
