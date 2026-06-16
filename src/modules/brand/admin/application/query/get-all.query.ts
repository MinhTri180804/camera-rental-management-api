import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { INCLUDE_NO_ACTIVE } from '../../presentation/constants';
import { PaginationQuery } from '@shared/application/query';
import { DELETE_FILTER, type DeleteFilter } from '@common/constants';

export class GetAllQuery extends PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  /**
   * 1: include no active
   * 0: not include no active
   */
  includeNoActive: number = INCLUDE_NO_ACTIVE;

  @IsOptional()
  @IsEnum(DELETE_FILTER)
  deleted: DeleteFilter = DELETE_FILTER.ALL;
}
