import {
  SeoDTO,
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
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsMongoId,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

@KeepNullFields('description', 'parentId', 'image', 'icon', 'brandRef')
export class CreateCategoryDTO {
  @IsNameCategoryPattern()
  name: string;

  @IsOptional()
  @IsSlugCategoryPattern()
  slug?: string;

  @IsOptional()
  @IsDescriptionCategoryPattern()
  description: string | null;

  @IsOptional()
  @IsMongoId()
  parentId: string | null;

  @IsOptional()
  @IsMongoId()
  image: string | null;

  @IsOptional()
  @IsMongoId()
  icon: string | null;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  banners: string[];

  @IsInt()
  sortOrder: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsClassificationTypePattern()
  classificationType: constants.ClassificationType;

  @ValidateIf(
    (object: CreateCategoryDTO) =>
      object.classificationType === constants.CLASSIFICATION_TYPE.BRAND,
  )
  @IsDefined({
    message: `BrandRef required when classification_type is ${constants.CLASSIFICATION_TYPE.BRAND}`,
  })
  @IsMongoId()
  brandRef: string | null;

  // @ValidateIf(
  //   (object: CreateCategoryDTO) =>
  //     object.classificationType === constants.CLASSIFICATION_TYPE.COMPATIBILITY,
  // )
  // @IsCompatibilityWithCategoryPattern()
  // compatibilityWith: string[];

  @ValidateNested()
  @Type(() => SeoDTO)
  seo: SeoDTO;

  @IsBoolean()
  inheritSpecs: boolean;

  @IsArray()
  @IsValidSpecSchema()
  specSchema: (
    | SelectSpecSchemaDto
    | RangeSpecSchemaDto
    | BooleanSpecSchemaDto
    | TextSpecSchemaDto
  )[];
}
