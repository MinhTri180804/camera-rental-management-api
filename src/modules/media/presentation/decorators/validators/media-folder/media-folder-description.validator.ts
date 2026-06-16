import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsDescriptionMediaFolderPattern() {
  const MIN_LENGTH_VALUE = 3;
  const MAX_LENGTH_VALUE = 255;
  const MIN_LENGTH_MESSAGE = `Description must be at least ${MIN_LENGTH_VALUE} characters long`;
  const MAX_LENGTH_MESSAGE = `Description must be at most ${MAX_LENGTH_VALUE} characters long`;
  return applyDecorators(
    IsString(),
    MinLength(MIN_LENGTH_VALUE, { message: MIN_LENGTH_MESSAGE }),
    MaxLength(MAX_LENGTH_VALUE, { message: MAX_LENGTH_MESSAGE }),
  );
}
