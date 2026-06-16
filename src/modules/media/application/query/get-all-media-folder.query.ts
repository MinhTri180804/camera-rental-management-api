import { PaginationQuery } from '@shared/application/query';
import { IsOptional, IsString } from 'class-validator';

export class GetAllMediaFolderQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  parentId?: string;
}
