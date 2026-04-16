import { secondToMs } from '@common/utils/time.util';

import { Inject, Injectable } from '@nestjs/common';
import { CACHE_SERVICE_TOKEN, type ICacheService } from '@shared/domain/ports';
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  type ICacheOtpEmailVerificationService,
} from '../../domain';

@Injectable()
export class CacheOTPVerificationServiceImpl implements ICacheOtpEmailVerificationService {
  private readonly _EXPIRES_TIME_SECONDS = 300; // 5 minutes
  private readonly _COUNTDOWN_SECONDS = 60; // 1 minute
  private readonly _PREFIX = 'otp:verification-email';
  private readonly _COUNTDOWN_PREFIX = 'countdown';

  constructor(
    @Inject(CACHE_SERVICE_TOKEN) private readonly _cacheService: ICacheService,
  ) {}

  get expiresTimeSeconds(): number {
    return this._EXPIRES_TIME_SECONDS;
  }

  get countdownSeconds(): number {
    return this._COUNTDOWN_SECONDS;
  }

  get prefix(): string {
    return this._PREFIX;
  }

  get countdownPrefix(): string {
    return this._COUNTDOWN_PREFIX;
  }

  getKey(email: string): string {
    return `${this._PREFIX}:${email}`;
  }

  async isExist(email: string): Promise<boolean> {
    const key = this.getKey(email);
    const value = await this._cacheService.exists(key);
    return value;
  }

  /**
   * Set the OTP for verification email.
   *
   * @param {string} email - The email address.
   * @param {string} otp - The OTP.
   * @return {Promise<{ expiresAt: number; resendAvailableAt: number; }>} The expiration time and resend available time in millisecond.
   */
  async set(
    email: string,
    otp: string,
  ): Promise<{
    /**
     * The expiration time in millisecond.
     */
    expiresAt: number;
    /**
     * The resend available time in millisecond.
     */
    resendAvailableAt: number;
  }> {
    const key = this.getKey(email);
    await this._cacheService.set(key, otp, this._EXPIRES_TIME_SECONDS);
    await this._cacheService.set(
      `${key}:${this._COUNTDOWN_PREFIX}`,
      '1',
      this._COUNTDOWN_SECONDS,
    );
    return {
      expiresAt: Date.now() + secondToMs(this._EXPIRES_TIME_SECONDS),
      resendAvailableAt: Date.now() + secondToMs(this._COUNTDOWN_SECONDS),
    };
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

    if (value === null)
      return {
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      };

    return {
      status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT,
      countdown: value,
    };
  }
}
