import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

const DEFAULT_MESSAGE =
  'Password must be at least 8 characters long and include uppercase, lowercase, number and special character';

export function IsPasswordPattern(message: string = DEFAULT_MESSAGE) {
  return applyDecorators(
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message,
      },
    ),
    IsString(),
  );
}
