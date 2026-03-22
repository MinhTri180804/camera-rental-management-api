import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RedisDTOConfig {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;
}
