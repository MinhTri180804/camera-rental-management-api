import { applyDecorators } from '@nestjs/common';
import { IsArray, IsString, MaxLength } from 'class-validator';

export function IsKeywordSeoPattern() {
  const IS_ARRAY_MESSAGE = 'Keyword SEO must be an array';
  const EACH_IS_STRING_MESSAGE = 'Each element of Keyword SEO must be a string';
  const MAX_LENGTH_MESSAGE =
    'Each element of Keyword SEO must be at most 60 characters';

  return applyDecorators(
    IsArray({ message: IS_ARRAY_MESSAGE }),
    IsString({ each: true, message: EACH_IS_STRING_MESSAGE }),
    MaxLength(60, { each: true, message: MAX_LENGTH_MESSAGE }),
  );
}
