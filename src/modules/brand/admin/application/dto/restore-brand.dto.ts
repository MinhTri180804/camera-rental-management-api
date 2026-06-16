import { IsSlugBrandPattern } from '@modules/brand/shared/presentation/decorators/validators/brand';
import { AllowEmptyBody } from '@shared/presentation';
import { IsOptional } from 'class-validator';

@AllowEmptyBody()
export class RestoreBrandDTO {
  @IsOptional()
  @IsSlugBrandPattern()
  newSlug?: string;
}
