import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  avatarPublicId?: string;
}
