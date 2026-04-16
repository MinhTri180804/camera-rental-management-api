import { Heading, Html, Link, Text } from '@react-email/components';

interface Props {
  otp: string;
  email: string;
  expiresAt: number;
}

export function VerificationEmailTemplate({ otp, email, expiresAt }: Props) {
  return (
    <Html>
      <Heading>Verify Email</Heading>
      <Text>Please verify your email</Text>
      <Text>OTP: {otp}</Text>
      <Text>Email: {email}</Text>
      <Text>
        Expires at:{' '}
        {Intl.DateTimeFormat('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(expiresAt)}
      </Text>
      <Link href="localhost:8080" target="_blank">
        Verify Email
      </Link>
    </Html>
  );
}
