import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsSlugAncestorPattern() {
  const MATCHES_MESSAGE =
    'Slug must contain only lowercase letters, numbers, and hyphens';
  return applyDecorators(
    IsString(),
    Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: MATCHES_MESSAGE,
    }),
  );
}
