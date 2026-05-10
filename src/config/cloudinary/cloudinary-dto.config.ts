import { IsNotEmpty, IsString } from 'class-validator';

export class CloudinaryConfigDTO {
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  apiSecret: string;

  @IsString()
  @IsNotEmpty()
  cloudName: string;
}
