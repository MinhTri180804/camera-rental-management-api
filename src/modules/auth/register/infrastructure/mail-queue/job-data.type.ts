export type SendOTPEmailVerificationJobData = {
  otp: string;
  email: string;
  expiresAt: number;
};

export type ResendOTPEmailVerificationJobData = {
  otp: string;
  email: string;
  expiresAt: number;
};
