import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsNameCategoryPattern() {
  const MIN_LENGTH_MESSAGE = 'Name must be at least 3 characters long';
  const MAX_LENGTH_MESSAGE = 'Name must be at most 100 characters long';
  return applyDecorators(
    IsString(),
    MinLength(3, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(100, { message: MAX_LENGTH_MESSAGE }),
    Transform(({ value }: { value: string }) => value.trim()),
  );
}
