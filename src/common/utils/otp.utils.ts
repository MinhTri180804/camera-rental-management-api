import { randomInt, createHash } from 'crypto';

export function generateOTP(length: number = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return randomInt(min, max).toString();
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

export function verifyOtp(otp: string, otpHashed: string): boolean {
  return hashOtp(otp) === otpHashed;
}
