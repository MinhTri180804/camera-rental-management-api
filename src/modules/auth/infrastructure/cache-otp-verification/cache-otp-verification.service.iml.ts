import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  ICacheOtpEmailVerificationService,
} from '@modules/auth/domain/port/cache-otp-email-verification.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  CACHE_SERVICE_TOKEN,
  type ICacheService,
} from '@shared/domain/ports/cache.service';

@Injectable()
export class CacheOTPVerificationServiceImpl implements ICacheOtpEmailVerificationService {
  private readonly _EXPIRES_TIME_SECONDS = 300; // 5 minutes
  private readonly _COUNTDOWN_SECONDS = 60; // 1 minute

  public readonly purpose = 'verification-email'; // Purpose of the OTP

  constructor(
    @Inject(CACHE_SERVICE_TOKEN) private readonly _cacheService: ICacheService,
  ) {}

  get expiresTimeSeconds(): number {
    return this._EXPIRES_TIME_SECONDS;
  }

  get countdownSeconds(): number {
    return this._COUNTDOWN_SECONDS;
  }

  getKey(email: string): string {
    return `otp:${this.purpose}:${email}`;
  }

  async isExist(email: string): Promise<boolean> {
    const key = this.getKey(email);
    const value = await this._cacheService.exists(key);
    return value;
  }

  async set(email: string, otp: string): Promise<void> {
    const key = this.getKey(email);
    await this._cacheService.set(key, otp, this._EXPIRES_TIME_SECONDS);
    await this._cacheService.set(
      `${key}:countdown`,
      '1',
      this._COUNTDOWN_SECONDS,
    );
    return;
  }

  async get(email: string): Promise<string | null> {
    const key = this.getKey(email);
    const value = await this._cacheService.get<string>(key);
    if (!value) return null;
    return value;
  }

  async delete(email: string): Promise<void> {
    const key = this.getKey(email);
    await this._cacheService.delete(key);
    await this._cacheService.delete(`${key}:countdown`);
    return;
  }

  async getCountdown(email: string): Promise<{
    status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS;
    countdown: number | null;
  }> {
    const key = this.getKey(email);
    const value = await this._cacheService.ttl(`${key}:countdown`);

    if (value === undefined)
      return {
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.NOT_FOUND,
        countdown: null,
      };

    if (value === -2)
      return {
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.NOT_FOUND,
        countdown: null,
      };

    if (value === -1) {
      return {
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.NO_EXPIRE,
        countdown: null,
      };
    }

    return {
      status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.OK,
      countdown: value,
    };
  }
}
