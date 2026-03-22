import crypto from 'crypto';

export abstract class BaseOtpService {
  protected _safeCompare(otp: string, hashedOtp: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(otp), Buffer.from(hashedOtp));
  }
}
