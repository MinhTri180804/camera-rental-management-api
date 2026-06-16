import { PaginationQuery } from '@shared/application/query';
import { IsOptional, IsString } from 'class-validator';

export class GetAllMediaQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  folderId?: string;
}
