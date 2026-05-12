import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestBodyEmptyException extends HttpException {
  static readonly DEFAULT_MESSAGE = 'Request body cannot empty';
  static readonly ERROR_CODE = 'REQUEST_BODY_EMPTY';
  constructor(message = RequestBodyEmptyException.DEFAULT_MESSAGE) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
