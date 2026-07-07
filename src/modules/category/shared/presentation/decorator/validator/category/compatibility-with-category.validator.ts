import { applyDecorators } from '@nestjs/common';
import { IsArray, IsString } from 'class-validator';

export function IsCompatibilityWithCategoryPattern() {
  const IS_ARRAY_MESSAGE = 'compatibilityWith must be an array';
  return applyDecorators(
    IsArray({ message: IS_ARRAY_MESSAGE }),
    IsString({ each: true }),
  );
}
