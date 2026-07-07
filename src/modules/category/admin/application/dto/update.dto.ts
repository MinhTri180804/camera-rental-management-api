import {
  BooleanSpecSchemaDto,
  RangeSpecSchemaDto,
  SelectSpecSchemaDto,
  TextSpecSchemaDto,
} from '@modules/category/shared/application/dto/category';
import * as constants from '@modules/category/shared/presentation/constants';
import {
  IsClassificationTypePattern,
  IsDescriptionCategoryPattern,
  IsNameCategoryPattern,
  IsSlugCategoryPattern,
  IsValidSpecSchema,
} from '@modules/category/shared/presentation/decorator/validator/category';
import { KeepNullFields } from '@shared/presentation';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from 'class-validator';

@KeepNullFields('description', 'image', 'icon', 'parentId', 'brandRef')
export class UpdateCategoryDTO {
  @IsOptional()
  @IsNameCategoryPattern()
  name?: string;

  @IsOptional()
  @IsSlugCategoryPattern()
  slug?: string;

  @IsOptional()
  @IsDescriptionCategoryPattern()
  description?: string;

  @IsOptional()
  @IsMongoId()
  image?: string | null;

  @IsOptional()
  @IsMongoId()
  icon?: string | null;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  banners?: string[];

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsClassificationTypePattern()
  classificationType?: constants.ClassificationType;

  @ValidateIf(
    (object: UpdateCategoryDTO) =>
      object.classificationType === constants.CLASSIFICATION_TYPE.BRAND,
  )
  @IsDefined({
    message: `BrandRef required when classification_type is ${constants.CLASSIFICATION_TYPE.BRAND}`,
  })
  @IsMongoId()
  brandRef: string | null;

  @IsOptional()
  @IsArray()
  @IsValidSpecSchema()
  specsSchema: (
    | SelectSpecSchemaDto
    | RangeSpecSchemaDto
    | BooleanSpecSchemaDto
    | TextSpecSchemaDto
  )[];
}
