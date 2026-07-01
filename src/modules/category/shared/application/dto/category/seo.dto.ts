import {
  IsDescriptionSeoPattern,
  IsKeywordSeoPattern,
  IsTitleSeoPattern,
} from '@modules/category/shared/presentation/decorator/validator/category/seo';
import { IsOptional } from 'class-validator';

export class SeoDTO {
  @IsTitleSeoPattern()
  title: string;

  @IsOptional()
  @IsDescriptionSeoPattern()
  description: string | null;

  @IsKeywordSeoPattern()
  keywords: string[];
}

export class SeoDTOPartial {
  @IsOptional()
  @IsTitleSeoPattern()
  title?: string;

  @IsOptional()
  @IsDescriptionSeoPattern()
  description?: string | null;

  @IsOptional()
  @IsKeywordSeoPattern()
  keywords?: string[];
}
