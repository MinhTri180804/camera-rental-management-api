export type SendOTPEmailForgotPasswordJobData = {
  email: string;
  otp: string;
  expiresAt: number;
};

export type ResendOTPEmailForgotPasswordJobData = {
  email: string;
  otp: string;
  expiresAt: number;
};
