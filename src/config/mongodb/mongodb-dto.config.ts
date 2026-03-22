import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class MongodbDtoConfig {
  @IsString({ message: 'Database name is required' })
  dbName: string;

  @IsString({ message: 'User is required' })
  user: string;

  @IsString({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Host is required' })
  host: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Port must be a number' })
  port: number;
}
