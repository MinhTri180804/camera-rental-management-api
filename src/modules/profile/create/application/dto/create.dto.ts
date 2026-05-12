import {
  IsFirstNamePattern,
  IsLastNamePattern,
} from '@modules/profile/shared/presentation/decorator';
import { IsOptional } from 'class-validator';

export class CreateProfileDTO {
  @IsFirstNamePattern()
  firstName: string;

  @IsLastNamePattern()
  lastName: string;

  @IsOptional()
  avatar?: {
    public_id: string;
    version: number;
  };
}
