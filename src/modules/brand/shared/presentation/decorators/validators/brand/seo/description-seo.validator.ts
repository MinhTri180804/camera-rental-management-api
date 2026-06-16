import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsDescriptionSeoPattern() {
  const MIN_LENGTH_MESSAGE = 'Description SEO must be at least 10 characters';
  const MAX_LENGTH_MESSAGE = 'Description SEO must be at most 120 characters';
  return applyDecorators(
    IsString(),
    MinLength(10, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(120, { message: MAX_LENGTH_MESSAGE }),
  );
}
