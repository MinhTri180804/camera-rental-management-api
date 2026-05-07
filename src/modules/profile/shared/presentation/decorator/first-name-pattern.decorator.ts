import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsFirstNamePattern() {
  return applyDecorators(
    IsString(),
    MinLength(2, { message: 'Min length first name is 2' }),
    MaxLength(16, { message: 'Max length first name is 16' }),
  );
}
