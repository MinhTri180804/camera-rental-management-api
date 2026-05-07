/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationRequestException } from '../exceptions';
import { Response } from 'express';
import { ApiError } from '../response';

@Catch(ValidationRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

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
}
