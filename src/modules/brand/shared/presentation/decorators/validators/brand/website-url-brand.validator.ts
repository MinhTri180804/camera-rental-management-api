import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsUrl } from 'class-validator';

export function IsWebsiteUrlPattern() {
  const MESSAGE = 'Website URL is invalid';
  return applyDecorators(
    IsUrl(
      { require_protocol: true, protocols: ['http', 'https'] },
      { message: MESSAGE },
    ),
    Transform(({ value }: { value: string | undefined }) =>
      value ? value.trim() : value,
    ),
  );
}
