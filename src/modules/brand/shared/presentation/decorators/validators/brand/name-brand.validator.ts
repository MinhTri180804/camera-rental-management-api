import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsNameBrandPattern() {
  const MIN_LENGTH = 3;
  const MIN_LENGTH_MESSAGE = `Name must be at least ${MIN_LENGTH} characters`;
  const MAX_LENGTH = 100;
  const MAX_LENGTH_MESSAGE = `Name must be at most ${MAX_LENGTH} characters`;
  return applyDecorators(
    IsString(),
    MinLength(MIN_LENGTH, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(MAX_LENGTH, { message: MAX_LENGTH_MESSAGE }),
    Transform(({ value }: { value: string | undefined }) =>
      value ? value.trim() : value,
    ),
  );
}
