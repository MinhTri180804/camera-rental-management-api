import { Module } from '@nestjs/common';
import { AuthRegisterModule } from './register/auth-register.module';
import { AuthLoginModule } from './login/auth-login.module';
import { AuthForgotPasswordModule } from './forgot-password/forgot-password.module';

@Module({
  imports: [AuthRegisterModule, AuthLoginModule, AuthForgotPasswordModule],
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule {}
