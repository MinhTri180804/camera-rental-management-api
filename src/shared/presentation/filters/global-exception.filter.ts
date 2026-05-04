/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationRequestException } from '../exceptions/validation.exception';
import { ApiError } from '../response/api-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * The catch method is called when an exception is thrown.
   *
   * @param {any} exception - The exception that was thrown.
   * @param {ArgumentsHost} host - The host object that contains references to the
   *                               application context.
   * @return {void} This method does not return anything.
   */
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('[ROOT EXCEPTION]: ', exception);

    if (exception instanceof ValidationRequestException) {
      const status = exception.getStatus();
      //   TODO: Refactor here
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const exceptionResponse = exception.getResponse() as any;
      //   TODO: Refactor here

      console.log('[EXCEPTION]: ', exceptionResponse.details);

      const responseBody: ApiError = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: exceptionResponse.details,
        },
      };

      response.status(status).json(responseBody);
      return;
    }

    /**
     * Handle the default case.
     *
     * This case is triggered when an exception is thrown that is not an instance of DomainException or HttpException.
     * It constructs an ApiError object with the error code and message from the exception.
     * If the exception has details, it is included in the ApiError object.
     * The ApiError object is then sent as a JSON response with the status code from the exception.
     *
     * @param {any} exception - The exception that was thrown.
     * @return {void} This function does not return anything.
     */
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    } as ApiError);
    return;
  }

  /**
   * Parses the validation message string and returns an object with the field and message.
   *
   * @param {string} message - The validation message string.
   * @return {Object} An object with the field and message.
   */
  private _parseValidationMsg(message: string) {
    const parts = message.split(':');
    return {
      /**
       * The name of the field that failed validation.
       * @type {string}
       */
      field: parts[0].trim(),
      /**
       * The error message for the failed validation.
       * @type {string}
       */
      message: parts[1].trim(),
    };
  }
}
