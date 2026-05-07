import { Injectable } from '@nestjs/common';
import { BaseOtpService } from '@shared/infrastructure';
import crypto, { createHash } from 'crypto';
import { IOtpEmailVerificationService } from '../../domain';

@Injectable()
export class OtpEmailVerificationServiceImpl
  extends BaseOtpService
  implements IOtpEmailVerificationService
{
  readonly length: number = 6;

  constructor() {
    super();
  }

  hash(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  generate(): string {
    const min = 10 ** (this.length - 1);
    const max = 10 ** this.length - 1;
    const otp = crypto.randomInt(min, max + 1).toString();

    return otp;
  }

  verify(otp: string, hashedOtp: string): boolean {
    return this.hash(otp) === hashedOtp;
  }
}
