import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ImageMetadataDTO {
  @IsString()
  @MaxLength(255)
  displayName: string;

  @IsOptional()
  @IsString()
  folderId?: string;

  @IsString()
  alt: string;
}
