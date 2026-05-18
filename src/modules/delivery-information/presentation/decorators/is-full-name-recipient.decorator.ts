import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export function IsFullNameRecipient() {
  return applyDecorators(
    IsString(),
    MinLength(3, {
      message: 'Full name must be at least 3 characters long',
    }),
    MaxLength(50, {
      message: 'Full name must be at most 50 characters long',
    }),
  );
}
