import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsDescriptionCategoryPattern() {
  const MIN_LENGTH_MESSAGE = 'Description must be at least 10 characters';
  const MAX_LENGTH_MESSAGE = 'Description must be at most 200 characters';
  return applyDecorators(
    IsString(),
    MinLength(10, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(200, { message: MAX_LENGTH_MESSAGE }),
    Transform(({ value }: { value: string }) => value.trim()),
  );
}
