import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessTokenFactory } from './access-token.factory';
import { JwtAccessTokenStrategy } from './access-token.strategy';
import { JwtAccessTokenGuard } from './access-token.guard';
import { JWT_ACCESS_TOKEN_SERVICE } from '@shared/domain/ports/access-token.service';
import { JwtAccessTokenServiceIml } from './access-token.service';

@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useClass: JwtAccessTokenFactory,
    }),
  ],
  providers: [
    JwtAccessTokenStrategy,
    JwtAccessTokenGuard,
    {
      provide: JWT_ACCESS_TOKEN_SERVICE,
      useClass: JwtAccessTokenServiceIml,
    },
  ],
  exports: [
    JwtAccessTokenStrategy,
    JwtAccessTokenGuard,
    JWT_ACCESS_TOKEN_SERVICE,
  ],
})
export class JwtAccessTokenModule {}
