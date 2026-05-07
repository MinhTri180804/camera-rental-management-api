import {
  IsFirstNamePattern,
  IsLastNamePattern,
} from '@modules/profile/shared/presentation/decorator';
import { IsOptional } from 'class-validator';

export class UpdateProfileDTO {
  @IsFirstNamePattern()
  @IsOptional()
  firstName?: string;

  @IsLastNamePattern()
  @IsOptional()
  lastName?: string;
}
