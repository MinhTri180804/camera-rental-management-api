import { KeepNullFields } from '@shared/presentation';
import { IsMongoId, ValidateIf } from 'class-validator';

@KeepNullFields('parentId')
export class ChangeParentCategoryDTO {
  @ValidateIf((object: ChangeParentCategoryDTO) => object.parentId !== null)
  @IsMongoId()
  parentId: string | null;
}
