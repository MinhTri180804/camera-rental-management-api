export const JOB_NAME = {
  SEND_OTP_EMAIL_VERIFICATION: 'send-otp-email-verification',
  RESEND_OTP_EMAIL_VERIFICATION: 'resend-otp-email-verification',
} as const;

export type JobName = (typeof JOB_NAME)[keyof typeof JOB_NAME];
