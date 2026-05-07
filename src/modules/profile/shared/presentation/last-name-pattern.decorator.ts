import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsLastNamePattern() {
  return applyDecorators(
    IsString(),
    MinLength(2, { message: 'Min length last name is 2' }),
    MaxLength(16, { message: 'Max length last name is 16' }),
  );
}
