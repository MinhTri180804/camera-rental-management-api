import { IsInt, IsPositive, IsString, Matches } from 'class-validator';

export class UpdateAvatarDTO {
  /**
   * Cloudinary public ID of the new avatar
   */
  @IsString()
  @Matches(/^users\/[a-zA-Z0-9_-]+\/avatar\/current$/)
  publicId: string;

  /**
   * Cloudinary version for cache busting
   */
  @IsInt()
  @IsPositive()
  version: number;
}
