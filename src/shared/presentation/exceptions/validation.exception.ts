import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationRequestException extends HttpException {
  static readonly DEFAULT_MESSAGE = 'Validation request failed';
  static readonly ERROR_CODE = 'VALIDATION_ERROR';

  constructor(
    details: {
      field: string;
      message: string[];
    }[],
    message = ValidationRequestException.DEFAULT_MESSAGE,
  ) {
    super(
      { message, errorCode: ValidationRequestException.ERROR_CODE, details },
      HttpStatus.BAD_REQUEST,
    );
  }
}
