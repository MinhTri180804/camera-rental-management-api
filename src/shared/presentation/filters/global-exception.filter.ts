import { NODE_ENV_ENUM } from '@common/constants/config/node-env.constants';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestBodyEmptyException } from '../exceptions';
import { ApiError } from '../response/api-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly _isDevelopmentMode: boolean;
  constructor() {
    this._isDevelopmentMode =
      process.env.NODE_ENV === NODE_ENV_ENUM.DEVELOPMENT;
  }
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

    if (this._isDevelopmentMode) {
      console.log('[GLOBAL EXCEPTION]: ', exception);
    }

    if (exception instanceof UnauthorizedException) {
      const status = exception.getStatus();

      const responseBody: ApiError = {
        success: false,
        error: {
          code: 'UN_AUTHORIZATION',
          message: exception.message,
          details: null,
        },
      };

      response.status(status).json(responseBody);
      return;
    }

    if (exception instanceof RequestBodyEmptyException) {
      const status = exception.getStatus();

      const responseBody: ApiError = {
        success: false,
        error: {
          code: RequestBodyEmptyException.ERROR_CODE,
          message: exception.message,
          details: null,
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
