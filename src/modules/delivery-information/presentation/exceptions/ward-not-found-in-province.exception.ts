import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class WardNotFoundInProvinceException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Ward not found in Province';
  static readonly ERROR_CODE = 'WARD_NOT_FOUND_IN_PROVINCE';

  constructor({ provinceCode }: { provinceCode?: number }) {
    const message = provinceCode
      ? `${WardNotFoundInProvinceException.DEFAULT_MESSAGE} (Province ID: ${provinceCode})`
      : WardNotFoundInProvinceException.DEFAULT_MESSAGE;
    super(
      WardNotFoundInProvinceException.ERROR_CODE,
      message,
      null,
      HttpStatus.BAD_REQUEST,
    );
  }
}
