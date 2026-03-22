import { IOtpService } from '@shared/domain/ports/otp.service';

/**
 * The `IOtpEmailVerificationService` is a service that handles OTP related operations for email verification.
 * Currently, it extends the `IOtpService` interface, so it inherits all the methods provided by the `IOtpService`.
 * However, if you need to add new methods related to OTP for email verification, you can do so by extending this interface.
 * This interface is designed to be open for extension, so you can always add new methods without modifying the original interface.
 * If add new methods, please add them to this interface and remove the eslint disable comment.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOtpEmailVerificationService extends IOtpService {}

export const OTP_EMAIL_VERIFICATION_SERVICE_TOKEN = Symbol(
  'OTP_EMAIL_VERIFICATION_SERVICE_TOKEN',
);
