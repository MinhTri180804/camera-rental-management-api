import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsNameMediaFolderPattern() {
  const MIN_LENGTH_VALUE = 3;
  const MAX_LENGTH_VALUE = 42;
  const MIN_LENGTH_MESSAGE = `Media folder name be at least ${MIN_LENGTH_VALUE} characters long`;
  const MAX_LENGTH_MESSAGE = `Media folder name must be at most ${MAX_LENGTH_VALUE} characters long`;
  return applyDecorators(
    IsString(),
    MaxLength(MAX_LENGTH_VALUE, { message: MAX_LENGTH_MESSAGE }),
    MinLength(MIN_LENGTH_VALUE, { message: MIN_LENGTH_MESSAGE }),
  );
}
