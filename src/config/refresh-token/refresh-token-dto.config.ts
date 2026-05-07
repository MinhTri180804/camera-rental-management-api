import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDTOConfig {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  expiresIn: number;
}
