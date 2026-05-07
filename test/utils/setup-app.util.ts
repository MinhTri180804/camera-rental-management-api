import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAccessTokenGuard } from '@shared/infrastructure';
import {
  GlobalExceptionFilter,
  ResponseInterceptor,
  StrictValidationPipe,
} from '@shared/presentation';
import { DomainExceptionFilter } from '@shared/presentation/filters/domain-exception.filter';
import { ValidationExceptionFilter } from '@shared/presentation/filters/validation-exception.filter';

export function setupApp(app: INestApplication) {
  const reflector = new Reflector();

  app.useGlobalPipes(new StrictValidationPipe());
  app.useGlobalGuards(new JwtAccessTokenGuard(reflector));
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new DomainExceptionFilter(),
    new ValidationExceptionFilter(),
  );
}
