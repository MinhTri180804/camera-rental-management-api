/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ResendEmailVerificationOtpDTO,
  ResendEmailVerificationOtpUseCase,
  SendEmailVerificationOtpDTO,
  SendEmailVerificationOTPUseCase,
  VerifyEmailVerificationOtpDTO,
  VerifyEmailVerificationOtpUseCase,
} from '../application';
import { AuthRegisterController } from './auth-register.controller';
import {
  InvalidOrExpiredOtpException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';

describe('AuthRegisterController', () => {
  let authRegisterController: AuthRegisterController;

  const sendEmailVerificationOTPUseCaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (dto: SendEmailVerificationOtpDTO) => Promise<{
        resendAvailableAt: number | undefined;
      }>
    >,
  };

  const resendEmailVerificationOTPUseCaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (
        dto: ResendEmailVerificationOtpDTO,
      ) => Promise<{ resendAvailableAt: number | undefined }>
    >,
  };

  const verifyEmailVerificationOTPUseCaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (
        dto: VerifyEmailVerificationOtpDTO,
      ) => Promise<{ accessToken: string; refreshToken: string }>
    >,
  };

  const RESEND_AVAILABLE_TIME_MOCKED = Date.now() * 1000;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRegisterController],
      providers: [
        {
          provide: SendEmailVerificationOTPUseCase,
          useValue: sendEmailVerificationOTPUseCaseMocked,
        },
        {
          provide: ResendEmailVerificationOtpUseCase,
          useValue: resendEmailVerificationOTPUseCaseMocked,
        },
        {
          provide: VerifyEmailVerificationOtpUseCase,
          useValue: verifyEmailVerificationOTPUseCaseMocked,
        },
      ],
    }).compile();

    authRegisterController = module.get(AuthRegisterController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SendEmailVerificationOTP', () => {
    it('should return resendAvailableAt', async () => {
      const dto: SendEmailVerificationOtpDTO = {
        email: 'test@example.com',
      };

      sendEmailVerificationOTPUseCaseMocked.execute.mockResolvedValue({
        resendAvailableAt: Date.now() + 60000,
      });

      const result = await authRegisterController.sendEmailVerificationOtp(dto);

      expect(result).toEqual({
        data: {
          resendAvailableAt: expect.any(Number),
        },
      });
      expect(
        sendEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });

    it('should throw OtpResendTooEarlyException when resend but countdown not expired', async () => {
      const dto: SendEmailVerificationOtpDTO = { email: 'test@example.com' };

      sendEmailVerificationOTPUseCaseMocked.execute.mockRejectedValue(
        new OtpResendTooEarlyException(undefined, RESEND_AVAILABLE_TIME_MOCKED),
      );

      await expect(
        authRegisterController.sendEmailVerificationOtp(dto),
      ).rejects.toBeInstanceOf(OtpResendTooEarlyException);

      expect(
        sendEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });
  });

  describe('ResendEmailVerificationOTP', () => {
    it('should return resendAvailableAt', async () => {
      const dto: ResendEmailVerificationOtpDTO = {
        email: 'test@example.com',
      };

      resendEmailVerificationOTPUseCaseMocked.execute.mockResolvedValue({
        resendAvailableAt: RESEND_AVAILABLE_TIME_MOCKED,
      });

      const result =
        await authRegisterController.resendEmailVerificationOtp(dto);

      expect(result.data).toEqual({
        resendAvailableAt: RESEND_AVAILABLE_TIME_MOCKED,
      });
      expect(
        resendEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });

    it('should throw OtpResendTooEarlyException when resend but countdown not expired', async () => {
      const dto: ResendEmailVerificationOtpDTO = {
        email: 'test@example.com',
      };

      resendEmailVerificationOTPUseCaseMocked.execute.mockRejectedValue(
        new OtpResendTooEarlyException(undefined, RESEND_AVAILABLE_TIME_MOCKED),
      );

      await expect(
        authRegisterController.resendEmailVerificationOtp(dto),
      ).rejects.toBeInstanceOf(OtpResendTooEarlyException);

      expect(
        resendEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });
  });

  describe('VerifyEmailVerificationOTP', () => {
    it('should return access token and refresh token', async () => {
      const dto: VerifyEmailVerificationOtpDTO = {
        email: 'test@example.com',
        otp: '123456',
        password: '123123@Test',
      };

      verifyEmailVerificationOTPUseCaseMocked.execute.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result =
        await authRegisterController.verifyEmailVerificationOtp(dto);

      expect(result.data).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(
        verifyEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });

    it('should throw InvalidOrExpiredOtpException when otp verify email invalid or not correct', async () => {
      const dto: VerifyEmailVerificationOtpDTO = {
        email: 'test@example.com',
        otp: '123456',
        password: '123123@Test',
      };

      verifyEmailVerificationOTPUseCaseMocked.execute.mockRejectedValue(
        new InvalidOrExpiredOtpException(),
      );

      await expect(
        authRegisterController.verifyEmailVerificationOtp(dto),
      ).rejects.toBeInstanceOf(InvalidOrExpiredOtpException);

      expect(
        verifyEmailVerificationOTPUseCaseMocked.execute,
      ).toHaveBeenCalledWith(dto);
    });
  });
});
