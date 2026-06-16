import {
  IsDescriptionBrandPattern,
  IsNameBrandPattern,
  IsOriginCountryPattern,
  IsSlugBrandPattern,
  IsWebsiteUrlPattern,
} from '@modules/brand/shared/presentation/decorators/validators/brand';
import {
  IsDescriptionSeoPattern,
  IsKeywordSeoPattern,
  IsTitleSeoPattern,
} from '@modules/brand/shared/presentation/decorators/validators/brand/seo';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class SeoDTO {
  @IsTitleSeoPattern()
  title: string;

  @IsOptional()
  @IsDescriptionSeoPattern()
  description: string | null;

  @IsKeywordSeoPattern()
  keywords: string[];
}

export class CreateBrandDTO {
  @IsNameBrandPattern()
  name: string;

  @IsOptional()
  @IsSlugBrandPattern()
  slug?: string | null;

  @IsOptional()
  @IsDescriptionBrandPattern()
  description: string | null;

  @IsOptional()
  @IsMongoId()
  logoDarkMode?: string;

  @IsOptional()
  @IsMongoId()
  logoLightMode?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @IsMongoId({ each: true })
  banners: string[];

  @IsOptional()
  @IsOriginCountryPattern()
  originCountry: string | null;

  @IsOptional()
  @IsWebsiteUrlPattern()
  websiteUrl: string | null;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsDefined({ message: 'SEO is required' })
  @ValidateNested()
  @Type(() => SeoDTO)
  seo: SeoDTO;
}
