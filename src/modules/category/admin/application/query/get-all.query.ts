import { PaginationQuery } from '@shared/application/query';
import { IsOptional } from 'class-validator';

export class GetAllCategoriesQuery extends PaginationQuery {
  @IsOptional()
  parentId?: string | null = null;

  @IsOptional()
  isActive?: boolean;
}
