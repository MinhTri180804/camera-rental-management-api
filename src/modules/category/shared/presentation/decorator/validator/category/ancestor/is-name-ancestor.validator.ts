import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsNameAncestorPattern() {
  const MIN_LENGTH_NAME = 'Name must be at least 3 characters long';
  const MAX_LENGTH_NAME = 'Name must be at most 60 characters long';
  return applyDecorators(
    IsString(),
    MinLength(3, { message: MIN_LENGTH_NAME }),
    MaxLength(60, { message: MAX_LENGTH_NAME }),
  );
}
