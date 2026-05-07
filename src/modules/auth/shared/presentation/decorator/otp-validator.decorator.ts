import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsOtpPattern() {
  return applyDecorators(
    IsString(),
    Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' }),
  );
}
