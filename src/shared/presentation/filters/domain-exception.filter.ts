import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainException } from '../exceptions';
import { ApiError } from '../response';
import { Response } from 'express';

/**
 * Handle the DomainException case.
 *
 * This case is triggered when an instance of DomainException is thrown.
 * It constructs an ApiError object with the error code and message from the exception.
 * If the exception has details, it is included in the ApiError object.
 * The ApiError object is then sent as a JSON response with the status code from the exception.
 *
 * @param {DomainException} exception - The instance of DomainException that was thrown.
 * @return {void} This function does not return anything.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const responseBody: ApiError = {
      success: false,
      error: {
        code: exception.code,
        message: exception.message,
      },
    };

    if (exception.details) {
      responseBody.error.details = exception.details;
    }

    response.status(exception.statusCode).json(responseBody);
  }
}
