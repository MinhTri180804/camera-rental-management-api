import { NODE_ENV_ENUM } from '@common/constants/config/node-env.constants';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

export class AppConfigDTO {
  @Type(() => Number)
  @IsNumber({}, { message: 'Port must be a number' })
  port: number;

  @IsEnum(NODE_ENV_ENUM, { message: 'App env must be a valid enum value' })
  nodeEnv: NODE_ENV_ENUM;
}
