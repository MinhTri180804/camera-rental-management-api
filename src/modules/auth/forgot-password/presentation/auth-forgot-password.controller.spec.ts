import { InvalidOrExpiredOtpException } from '@modules/auth/shared/presentation';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ForgotPasswordDTO,
  ResendOtpForgotPasswordDTO,
  ResetPasswordDTO,
} from '../application/dto';
import {
  ForgotPasswordUseCase,
  ResendForgotPasswordUseCase,
  ResetPasswordUseCase,
} from '../application/use-case';
import { AuthForgotPasswordController } from './auth-forgot-password.controller';
import { SingleDataResponse } from '@shared/presentation';

describe('AuthForgotPasswordController', () => {
  let authForgotPasswordController: AuthForgotPasswordController;

  const forgotPasswordUsecaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (
        dto: ForgotPasswordDTO,
      ) => Promise<{ resendAvailableAt: number | undefined }>
    >,
  };

  const resendForgotPasswordUseCaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (
        dto: ResendOtpForgotPasswordDTO,
      ) => Promise<{ resendAvailableAt: number | undefined }>
    >,
  };

  const resetPasswordUseCaseMocked = {
    execute: jest.fn() as jest.MockedFunction<
      (dto: ResetPasswordDTO) => Promise<void>
    >,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthForgotPasswordController],
      providers: [
        {
          provide: ForgotPasswordUseCase,
          useValue: forgotPasswordUsecaseMocked,
        },
        {
          provide: ResendForgotPasswordUseCase,
          useValue: resendForgotPasswordUseCaseMocked,
        },
        {
          provide: ResetPasswordUseCase,
          useValue: resetPasswordUseCaseMocked,
        },
      ],
    }).compile();

    authForgotPasswordController = module.get(AuthForgotPasswordController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const RESEND_AVAILABLE_AT_MOCK = Date.now() * 1000;

  describe('forgotPassword', () => {
    it('should return resendAvailableAt', async () => {
      const dto: ForgotPasswordDTO = {
        email: 'test@example.com',
      };

      forgotPasswordUsecaseMocked.execute.mockResolvedValue({
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });

      const result = await authForgotPasswordController.execute(dto);

      expect(forgotPasswordUsecaseMocked.execute).toHaveBeenCalledWith(dto);
      expect(result.data).toEqual({
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });
      expect(result).toBeInstanceOf(SingleDataResponse);
    });

    it("should don't return resendAvailableAt when it's undefined", async () => {
      const dto: ForgotPasswordDTO = {
        email: 'test@example.com',
      };

      forgotPasswordUsecaseMocked.execute.mockResolvedValue({
        resendAvailableAt: undefined,
      });

      const result = await authForgotPasswordController.execute(dto);

      expect(forgotPasswordUsecaseMocked.execute).toHaveBeenCalledWith(dto);
      expect(result.data).toBeNull();
      expect(result).toBeInstanceOf(SingleDataResponse);
    });
  });

  describe('resendForgotPassword', () => {
    it('should return resendAvailableAt', async () => {
      const dto: ResendOtpForgotPasswordDTO = { email: 'test@example.com' };

      resendForgotPasswordUseCaseMocked.execute.mockResolvedValue({
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });

      const result = await authForgotPasswordController.resend(dto);

      expect(resendForgotPasswordUseCaseMocked.execute).toHaveBeenCalledWith(
        dto,
      );
      expect(result.data).toEqual({
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });
      expect(result).toBeInstanceOf(SingleDataResponse);
    });

    it("should don't return resendAvailableAt when it's undefined", async () => {
      const dto: ResendOtpForgotPasswordDTO = { email: 'test@example.com' };

      resendForgotPasswordUseCaseMocked.execute.mockResolvedValue({
        resendAvailableAt: undefined,
      });

      const result = await authForgotPasswordController.resend(dto);

      expect(resendForgotPasswordUseCaseMocked.execute).toHaveBeenCalledWith(
        dto,
      );
      expect(result.data).toBeNull();
      expect(result).toBeInstanceOf(SingleDataResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const dto: ResetPasswordDTO = {
        email: 'test@example.com',
        password: '123123@Tri',
        otp: '123123',
      };

      resetPasswordUseCaseMocked.execute.mockResolvedValue();

      const result = await authForgotPasswordController.resetPassword(dto);

      expect(resetPasswordUseCaseMocked.execute).toHaveBeenCalledWith(dto);
      expect(result.data).toBeNull();
      expect(result).toBeInstanceOf(SingleDataResponse);
    });

    it('should throw InvalidOrExpiredOtpException when reset password failed', async () => {
      const dto: ResetPasswordDTO = {
        email: 'test@example.com',
        password: '123123@Tri',
        otp: '123123',
      };

      resetPasswordUseCaseMocked.execute.mockRejectedValue(
        new InvalidOrExpiredOtpException(),
      );

      await expect(
        authForgotPasswordController.resetPassword(dto),
      ).rejects.toBeInstanceOf(InvalidOrExpiredOtpException);
    });
  });
});
