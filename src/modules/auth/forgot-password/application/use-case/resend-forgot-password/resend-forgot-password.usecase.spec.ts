/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  IMailQueueForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  ICacheOtpEmailForgotPasswordService,
  IOtpEmailForgotPasswordService,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import {
  OtpResendTooEarlyException,
  NotfoundOrExpiredOtpException,
} from '@modules/auth/shared/presentation';
import { Test, TestingModule } from '@nestjs/testing';
import { ResendOtpForgotPasswordDTO } from '../../dto/resend-forgot-password-dto';
import { ResendForgotPasswordUseCase } from '../resend-forgot-password/resend-forgot-password.usecase';

describe('ResendForgotPasswordUseCase', () => {
  let usecase: ResendForgotPasswordUseCase;
  let userRepository: jest.Mocked<Pick<IUserRepository, 'isExistByEmail'>>;
  let queueMailService: jest.Mocked<
    Pick<IMailQueueForgotPasswordService, 'resendOTPEmailForgotPassword'>
  >;
  let otpEmailForgotPasswordService: jest.Mocked<
    Pick<IOtpEmailForgotPasswordService, 'generate' | 'hash'>
  >;
  let cacheOtpEmailForgotPasswordService: jest.Mocked<
    Pick<
      ICacheOtpEmailForgotPasswordService,
      'isExist' | 'getCountdown' | 'set'
    >
  >;

  const dto: ResendOtpForgotPasswordDTO = {
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const userRepositoryMocked = {
      isExistByEmail: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<boolean>
      >,
    };

    const queueMailForgotPasswordServiceMocked = {
      resendOTPEmailForgotPassword: jest.fn() as jest.MockedFunction<
        (email: string, otp: string, expiresAt: Date) => Promise<void>
      >,
    };

    const otpEmailForgotPasswordServiceMocked = {
      generate: jest.fn() as jest.MockedFunction<() => string>,
      hash: jest.fn() as jest.MockedFunction<(otp: string) => string>,
    };

    const cacheOtpEmailForgotPasswordServiceMocked = {
      isExist: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<boolean>
      >,
      getCountdown: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<{
          status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS;
          countdown: number | null;
        }>
      >,
      set: jest.fn() as jest.MockedFunction<
        (email: string, otpHashed: string) => Promise<{ expiresAt: Date }>
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendForgotPasswordUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: cacheOtpEmailForgotPasswordServiceMocked,
        },
        {
          provide: OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: otpEmailForgotPasswordServiceMocked,
        },
        {
          provide: MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: queueMailForgotPasswordServiceMocked,
        },
      ],
    }).compile();

    usecase = module.get<ResendForgotPasswordUseCase>(
      ResendForgotPasswordUseCase,
    );
    userRepository = module.get(USER_REPOSITORY_TOKEN);
    queueMailService = module.get(MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN);
    otpEmailForgotPasswordService = module.get(
      OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
    );
    cacheOtpEmailForgotPasswordService = module.get(
      CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should resend forgot password otp successfully', async () => {
      const OTP_MOCKED = '123123';
      const OTP_HASHED_MOCKED = 'otp-hashed';
      const RESEND_AVAILABLE_AT_MOCK = 10000;

      userRepository.isExistByEmail.mockResolvedValue(true);
      cacheOtpEmailForgotPasswordService.isExist.mockResolvedValue(true);
      cacheOtpEmailForgotPasswordService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
      otpEmailForgotPasswordService.generate.mockReturnValue(OTP_MOCKED);
      otpEmailForgotPasswordService.hash.mockReturnValue(OTP_HASHED_MOCKED);
      cacheOtpEmailForgotPasswordService.set.mockResolvedValue({
        expiresAt: Date.now() + 60000,
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });

      const result = await usecase.execute(dto);

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.isExist).toHaveBeenCalledWith(
        dto.email,
      );
      expect(
        cacheOtpEmailForgotPasswordService.getCountdown,
      ).toHaveBeenCalledWith(dto.email);
      expect(otpEmailForgotPasswordService.generate).toHaveBeenCalled();
      expect(otpEmailForgotPasswordService.hash).toHaveBeenCalledWith(
        OTP_MOCKED,
      );
      expect(cacheOtpEmailForgotPasswordService.set).toHaveBeenCalledWith(
        dto.email,
        OTP_HASHED_MOCKED,
      );
      expect(
        queueMailService.resendOTPEmailForgotPassword,
      ).toHaveBeenCalledWith({
        email: dto.email,
        otp: OTP_MOCKED,
        expiresAt: expect.any(Number),
      });
      expect(result).toEqual({
        resendAvailableAt: RESEND_AVAILABLE_AT_MOCK,
      });
    });

    it("should don't resend forgot password otp when user not exists", async () => {
      userRepository.isExistByEmail.mockResolvedValue(false);

      const result = await usecase.execute(dto);

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.isExist).not.toHaveBeenCalled();
      expect(
        cacheOtpEmailForgotPasswordService.getCountdown,
      ).not.toHaveBeenCalled();
      expect(cacheOtpEmailForgotPasswordService.set).not.toHaveBeenCalled();
      expect(
        queueMailService.resendOTPEmailForgotPassword,
      ).not.toHaveBeenCalled();
      expect(result.resendAvailableAt).toBeDefined();
    });

    it("should don't resend forgot password otp and throw NotfoundOrExpiredOtpException when otp not exists in cache or expired", async () => {
      userRepository.isExistByEmail.mockResolvedValue(true);
      cacheOtpEmailForgotPasswordService.isExist.mockResolvedValue(false);

      await expect(usecase.execute(dto)).rejects.toThrow(
        NotfoundOrExpiredOtpException,
      );

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.isExist).toHaveBeenCalledWith(
        dto.email,
      );
      expect(
        cacheOtpEmailForgotPasswordService.getCountdown,
      ).not.toHaveBeenCalled();
      expect(cacheOtpEmailForgotPasswordService.set).not.toHaveBeenCalled();
      expect(
        queueMailService.resendOTPEmailForgotPassword,
      ).not.toHaveBeenCalled();
    });

    it("should don't resend forgot password otp and throw OtpResendTooEarlyException when otp resend too early when countdown is not OK", async () => {
      userRepository.isExistByEmail.mockResolvedValue(true);
      cacheOtpEmailForgotPasswordService.isExist.mockResolvedValue(true);
      cacheOtpEmailForgotPasswordService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT,
        countdown: 60,
      });

      await expect(usecase.execute(dto)).rejects.toThrow(
        OtpResendTooEarlyException,
      );

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.isExist).toHaveBeenCalledWith(
        dto.email,
      );
      expect(
        cacheOtpEmailForgotPasswordService.getCountdown,
      ).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.set).not.toHaveBeenCalled();
      expect(
        queueMailService.resendOTPEmailForgotPassword,
      ).not.toHaveBeenCalled();
    });
  });
});
