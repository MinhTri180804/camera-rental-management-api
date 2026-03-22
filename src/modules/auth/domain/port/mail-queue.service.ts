export interface IQueueMailService {
  sendOTPEmailVerification(
    email: string,
    otp: string,
    // ExpiresAt is timestamp in milliseconds
    expiresAt: number,
  ): Promise<void>;
}
