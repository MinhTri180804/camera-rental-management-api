import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsTitleSeoPattern() {
  const MIN_LENGTH_MESSAGE = 'Title SEO must be at least 3 characters';
  const MAX_LENGTH_MESSAGE = 'Title SEO must be at most 60 characters';
  return applyDecorators(
    IsString(),
    MinLength(3, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(60, { message: MAX_LENGTH_MESSAGE }),
  );
}
