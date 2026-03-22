export interface IOtpService {
  readonly length: number;

  generate(): Promise<string> | string;
  hash(otp: string): string;
  verify(otp: string, hashedOtp: string): Promise<boolean> | boolean;
}
