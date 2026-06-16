import {
  IsDescriptionMediaFolderPattern,
  IsNameMediaFolderPattern,
} from '@modules/media/presentation/decorators/validators/media-folder';
import { IsOptional, IsString } from 'class-validator';

export class CreateMediaFolderDTO {
  @IsNameMediaFolderPattern()
  name: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsDescriptionMediaFolderPattern()
  description?: string;
}
