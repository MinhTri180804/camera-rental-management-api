import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class CurrentWardNoExistsInNewProvinceException extends DomainException {
  static readonly DEFAULT_MESSAGE =
    'Current ward no exists in new province updating';
  static readonly ERROR_CODE = 'CURRENT_WARD_NO_EXISTS_IN_NEW_PROVINCE';
  constructor() {
    super(
      CurrentWardNoExistsInNewProvinceException.ERROR_CODE,
      CurrentWardNoExistsInNewProvinceException.DEFAULT_MESSAGE,
      null,
      HttpStatus.CONFLICT,
    );
  }
}
