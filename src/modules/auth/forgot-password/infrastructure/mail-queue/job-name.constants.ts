export const JOB_NAME = {
  SEND_OTP_EMAIL_FORGOT_PASSWORD: 'send-otp-email-forgot-password',
  RESEND_OTP_EMAIL_FORGOT_PASSWORD: 'resend-otp-email-forgot-password',
} as const;

export type JobName = (typeof JOB_NAME)[keyof typeof JOB_NAME];
