type Props = {
  otp: string;
  email: string;
  expiresAt: number;
};

export const SendEmailForgotPasswordOtpTemplate = ({
  otp,
  email,
  expiresAt,
}: Props) => {
  return (
    <div>
      <h1>Send Email Forgot Password OTP</h1>
      <p>Your OTP code is: {otp}</p>
      <p>Email: {email}</p>
      <p>
        Expires at:{' '}
        {Intl.DateTimeFormat('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(expiresAt)}
      </p>
    </div>
  );
};
