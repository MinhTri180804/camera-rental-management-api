/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Queue } from 'bullmq';
import { MailQueueServiceIml } from './mail-queue.service.iml';
import { JOB_NAME } from './job-name.constants';

describe('MailQueueServiceIml', () => {
  let service: MailQueueServiceIml;
  let queueMock: jest.Mocked<Queue>;

  beforeEach(() => {
    queueMock = {
      add: jest.fn(),
    } as any;

    service = new MailQueueServiceIml(queueMock);
  });

  it('should add SEND OTP job to queue', async () => {
    await service.sendOTPEmailForgotPassword({
      email: 'test@gmail.com',
      otp: '123456',
      expiresAt: 123456789,
    });

    expect(queueMock.add).toHaveBeenCalledWith(
      JOB_NAME.SEND_OTP_EMAIL_FORGOT_PASSWORD,
      {
        email: 'test@gmail.com',
        otp: '123456',
        expiresAt: 123456789,
      },
    );
  });

  it('should add RESEND OTP job to queue', async () => {
    await service.resendOTPEmailForgotPassword({
      email: 'test@gmail.com',
      otp: '654321',
      expiresAt: 987654321,
    });

    expect(queueMock.add).toHaveBeenCalledWith(
      JOB_NAME.RESEND_OTP_EMAIL_FORGOT_PASSWORD,
      {
        email: 'test@gmail.com',
        otp: '654321',
        expiresAt: 987654321,
      },
    );
  });
});
