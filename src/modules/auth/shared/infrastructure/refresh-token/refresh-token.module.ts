import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenFactory } from './refresh-token.factory';
import { JWT_REFRESH_TOKEN_SERVICE } from '@modules/auth/shared/domain/port/refresh-token.service';
import { JwtRefreshTokenServiceImpl } from './refresh-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useClass: JwtRefreshTokenFactory,
    }),
  ],
  providers: [
    {
      provide: JWT_REFRESH_TOKEN_SERVICE,
      useClass: JwtRefreshTokenServiceImpl,
    },
  ],
  exports: [JWT_REFRESH_TOKEN_SERVICE],
})
export class JwtRefreshTokenModule {}
