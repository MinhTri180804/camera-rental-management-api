import { secondToMs } from '@common/utils/time.util';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  ICacheOtpEmailForgotPasswordService,
} from '@modules/auth/forgot-password/domain';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_SERVICE_TOKEN, type ICacheService } from '@shared/domain/ports';

@Injectable()
export class CacheOtpForgotPasswordServiceIml implements ICacheOtpEmailForgotPasswordService {
  private readonly _EXPIRES_TIME_SECOND = 300; // 5 Minutes;
  private readonly _COUNTDOWN_SECOND = 60; // 1 minute;
  private readonly _PREFIX = 'otp:forgot-password';
  private readonly _COUNTDOWN_PREFIX = 'countdown';

  constructor(
    @Inject(CACHE_SERVICE_TOKEN) private readonly _cacheService: ICacheService,
  ) {}

  get expiresTimeSeconds(): number {
    return this._EXPIRES_TIME_SECOND;
  }

  get countdownSeconds(): number {
    return this._COUNTDOWN_SECOND;
  }

  get prefix() {
    return this._PREFIX;
  }

  get countdownPrefix() {
    return this._COUNTDOWN_PREFIX;
  }

  getKey(email: string): string {
    return `otp:forgot-password:${email}`;
  }

  async set(
    email: string,
    otp: string,
  ): Promise<{ expiresAt: number; resendAvailableAt: number }> {
    const key = this.getKey(email);
    await this._cacheService.set(key, otp, this.expiresTimeSeconds);
    await this._cacheService.set(
      `${key}:countdown`,
      '1',
      this.countdownSeconds,
    );

    return {
      expiresAt: Date.now() + secondToMs(this._EXPIRES_TIME_SECOND),
      resendAvailableAt: Date.now() + secondToMs(this._COUNTDOWN_SECOND),
    };
  }

  async get(email: string): Promise<string | null> {
    const key = this.getKey(email);
    const otp = await this._cacheService.get<string>(key);
    if (!otp) return null;
    return otp;
  }

  async delete(email: string): Promise<void> {
    const key = this.getKey(email);
    await this._cacheService.delete(key);
    await this._cacheService.delete(`${key}:countdown`);
  }

  async getCountdown(email: string): Promise<{
    status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS;
    countdown: number | null;
  }> {
    const key = this.getKey(email);
    const value = await this._cacheService.ttl(`${key}:countdown`);

    if (value === null)
      return {
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      };

    return {
      status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT,
      countdown: value,
    };
  }

  async isExist(email: string): Promise<boolean> {
    const key = this.getKey(email);
    const value = await this._cacheService.exists(key);
    return value;
  }
}
