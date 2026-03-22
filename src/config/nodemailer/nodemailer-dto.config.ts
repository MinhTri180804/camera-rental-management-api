import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class NodemailerDTOConfig {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
