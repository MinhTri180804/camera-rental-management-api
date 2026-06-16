import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  ListDataResponse,
  SingleDataResponse,
} from '@shared/presentation/response/data-response';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../response/api-response';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from '../decorator/response-message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  private readonly _DEFAULT_MESSAGE: string = 'Default message success';

  constructor(private readonly _reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        /**
         * If the data is an instance of ListDataResponse, it will be mapped to an ApiResponse
         * with success set to true and the listData property of the ListDataResponse,
         * along with the pagination object containing the page, limit, and total properties.
         *
         * @param {ListDataResponse<T>} data - The ListDataResponse instance.
         * @return {ApiResponse<T[]>} The ApiResponse instance with success set to true and the listData property of the ListDataResponse,
         *                            along with the pagination object containing the page, limit, and total properties.
         */
        const message = this._reflector.get<string>(
          RESPONSE_MESSAGE_METADATA,
          context.getHandler() || this._DEFAULT_MESSAGE,
        );

        if (data instanceof ListDataResponse) {
          return {
            success: true,
            message,
            data: data.listData,
            pagination: {
              page: data.page,
              limit: data.limit,
              total: data.total,
              totalPage: data.totalPages,
              hasNextPage: data.hasNextPage,
              hasPreviousPage: data.hasPreviousPage,
            },
          };
        }

        /**
         * If the data is an instance of SingleDataResponse, it will be mapped to an ApiResponse
         * with success set to true and the data property of the SingleDataResponse.
         *
         * @param {SingleDataResponse<T>} data - The SingleDataResponse instance.
         * @return {ApiResponse<T>} The ApiResponse instance with success set to true and the data property of the SingleDataResponse.
         */
        if (data instanceof SingleDataResponse) {
          return {
            success: true,
            message,
            data: data.data as T,
          };
        }

        /**
         * If the data is not an instance of ListDataResponse or SingleDataResponse,
         * it will be mapped to an ApiResponse with success set to true and the data property
         * containing the original data.
         *
         * @param {T} data - The original data.
         * @return {ApiResponse<T>} The ApiResponse instance with success set to true and the data property containing the original data.
         */
        return {
          success: true,
          message,
          data: data,
        };
      }),
    );
  }
}
