import {
  IsDescriptionBrandPattern,
  IsNameBrandPattern,
  IsOriginCountryPattern,
  IsSlugBrandPattern,
  IsWebsiteUrlPattern,
} from '@modules/brand/shared/presentation/decorators/validators/brand';
import {
  IsKeywordSeoPattern,
  IsTitleSeoPattern,
} from '@modules/brand/shared/presentation/decorators/validators/brand/seo';
import { IsDescriptionSeoPattern } from '@modules/category/shared/presentation/decorator/validator/category/seo';
import { KeepNullFields } from '@shared/presentation';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class SeoDTO {
  @IsOptional()
  @IsTitleSeoPattern()
  title: string;

  @IsOptional()
  @IsDescriptionSeoPattern()
  description: string | null;

  @IsOptional()
  @IsKeywordSeoPattern()
  keywords: string[];
}

@KeepNullFields(
  'logoDarkMode',
  'logoLightMode',
  'description',
  'originCountry',
  'websiteUrl',
)
export class UpdateBrandDTO {
  @ValidateIf((_, value) => value !== undefined)
  @IsNameBrandPattern()
  name?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsSlugBrandPattern()
  slug?: string;

  @IsOptional()
  @IsDescriptionBrandPattern()
  description?: string | null;

  @IsOptional()
  @IsOriginCountryPattern()
  originCountry?: string | null;

  @IsOptional()
  @IsWebsiteUrlPattern()
  websiteUrl?: string | null;

  @ValidateIf((_, value) => value !== undefined)
  @ValidateNested()
  @Type(() => SeoDTO)
  seo?: SeoDTO;

  @IsOptional()
  @IsMongoId()
  logoLightMode?: string | null;

  @IsOptional()
  @IsMongoId()
  logoDarkMode?: string | null;

  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @IsMongoId({ each: true })
  banners?: string[];
}
