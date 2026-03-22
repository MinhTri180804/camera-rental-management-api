import { applyDecorators } from '@nestjs/common';
import { IsEmail } from 'class-validator';

const DEFAULT_MESSAGE = 'Email is invalid';

/**
 * Note: This custom decorator reduces code duplication and makes it easier to manage validation rules for email format.
 * Since the same field in DTOs of this module will use this decorator,
 * avoid duplicating the decorator definition for the same field email.
 */
export function EmailValidator(message: string = DEFAULT_MESSAGE) {
  return applyDecorators(IsEmail({}, { message }));
}
