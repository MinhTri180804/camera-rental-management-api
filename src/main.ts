import { NestFactory, Reflector } from '@nestjs/core';
import { JwtAccessTokenGuard } from '@shared/infrastructure/jwt/access-token/access-token.guard';
import { GlobalExceptionFilter } from '@shared/presentation/filters/global-exception.filter';
import { ResponseInterceptor } from '@shared/presentation/interceptors/response.interceptor';
import { StrictValidationPipe } from '@shared/presentation/pipes/strict-validation.pipe';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from '@shared/presentation/filters/domain-exception.filter';
import { ValidationExceptionFilter } from '@shared/presentation/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = new Reflector();

  app.useGlobalPipes(new StrictValidationPipe());
  app.useGlobalGuards(new JwtAccessTokenGuard(reflector));

  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new DomainExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
