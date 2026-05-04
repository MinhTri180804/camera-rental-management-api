import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class ProfileIsExistsException extends DomainException {
  static readonly ERROR_CODE = 'PROFILE_IS_EXISTS';
  static readonly DEFAULT_MESSAGE = 'Profile is exists';

  constructor(message = ProfileIsExistsException.DEFAULT_MESSAGE) {
    super(
      ProfileIsExistsException.ERROR_CODE,
      message,
      null,
      HttpStatus.CONFLICT,
    );
  }
}
