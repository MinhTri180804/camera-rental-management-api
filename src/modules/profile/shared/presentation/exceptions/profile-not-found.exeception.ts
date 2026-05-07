import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

// ProfileNotFoundException using when update profile before create or init profile
export class ProfileNotFoundException extends DomainException {
  static readonly DEFAULT_ERROR_CODE = 'PROFILE_NOT_FOUND';
  static readonly DEFAULT_MESSAGE =
    'Profile not found or profile update before profile init';

  constructor(message = ProfileNotFoundException.DEFAULT_MESSAGE) {
    super(
      ProfileNotFoundException.DEFAULT_ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
