import {
  IMailQueueForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  ICacheOtpEmailForgotPasswordService,
} from '@modules/auth/forgot-password/domain/port/cache-otp-email-forgot-password.service';
import {
  IOtpEmailForgotPasswordService,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain/port/otp-email-forgot-password.service';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain/port/user.repository';
import { OtpCountDownNotExpiredException } from '@modules/auth/shared/presentation/exception/otp-count-down-not-expired.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordUseCase } from './forgot-password.usecase';

describe('ForgotPasswordUseCase', () => {
  let usecase: ForgotPasswordUseCase;
  let userRepository: jest.Mocked<Pick<IUserRepository, 'isExistByEmail'>>;
  let queueMailService: jest.Mocked<
    Pick<IMailQueueForgotPasswordService, 'sendOTPEmailForgotPassword'>
  >;
  let cacheOtpForgotPasswordService: jest.Mocked<
    Pick<ICacheOtpEmailForgotPasswordService, 'set' | 'getCountdown'>
  >;
  let otpEmailForgotPasswordService: jest.Mocked<
    Pick<IOtpEmailForgotPasswordService, 'generate' | 'hash'>
  >;

  const dto = {
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const queueMailServiceMocked = {
      sendOTPEmailForgotPassword: jest.fn() as jest.MockedFunction<
        IMailQueueForgotPasswordService['sendOTPEmailForgotPassword']
      >,
    };

    const userRepositoryMocked = {
      isExistByEmail: jest.fn() as jest.MockedFunction<
        IUserRepository['isExistByEmail']
      >,
    };

    const cacheOtpForgotPasswordServiceMocked = {
      set: jest.fn() as jest.MockedFunction<
        ICacheOtpEmailForgotPasswordService['set']
      >,
      getCountdown: jest.fn() as jest.MockedFunction<
        ICacheOtpEmailForgotPasswordService['getCountdown']
      >,
    };
    const otpEmailForgotPasswordServiceMocked = {
      generate: jest.fn() as jest.MockedFunction<
        IOtpEmailForgotPasswordService['generate']
      >,
      hash: jest.fn() as jest.MockedFunction<
        IOtpEmailForgotPasswordService['hash']
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: queueMailServiceMocked,
        },
        {
          provide: OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: otpEmailForgotPasswordServiceMocked,
        },
        {
          provide: CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: cacheOtpForgotPasswordServiceMocked,
        },
      ],
    }).compile();

    usecase = module.get<ForgotPasswordUseCase>(ForgotPasswordUseCase);
    otpEmailForgotPasswordService = module.get<
      jest.Mocked<Pick<IOtpEmailForgotPasswordService, 'generate' | 'hash'>>
    >(OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN);
    cacheOtpForgotPasswordService = module.get<
      jest.Mocked<
        Pick<ICacheOtpEmailForgotPasswordService, 'set' | 'getCountdown'>
      >
    >(CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN);
    queueMailService = module.get<
      jest.Mocked<
        Pick<IMailQueueForgotPasswordService, 'sendOTPEmailForgotPassword'>
      >
    >(MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN);
    userRepository = module.get<
      jest.Mocked<Pick<IUserRepository, 'isExistByEmail'>>
    >(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should generate OTP and send email', async () => {
      const MOCKED_EXPIRES_AT = 100000;
      const MOCKED_RESEND_AVAILABLE_AT = 200000;
      const MOCKED_OTP_GENERATE = '123123';
      const MOCKED_OTP_HASHED = 'otp-hashed';
      userRepository.isExistByEmail.mockResolvedValue(true);
      cacheOtpForgotPasswordService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
      otpEmailForgotPasswordService.generate.mockReturnValue(
        MOCKED_OTP_GENERATE,
      );
      otpEmailForgotPasswordService.hash.mockReturnValue(MOCKED_OTP_HASHED);
      cacheOtpForgotPasswordService.set.mockResolvedValue({
        expiresAt: MOCKED_EXPIRES_AT,
        resendAvailableAt: MOCKED_RESEND_AVAILABLE_AT,
      });

      const result = await usecase.execute(dto);

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpForgotPasswordService.getCountdown).toHaveBeenCalledWith(
        dto.email,
      );
      expect(otpEmailForgotPasswordService.generate).toHaveBeenCalled();
      expect(otpEmailForgotPasswordService.hash).toHaveBeenCalled();
      expect(cacheOtpForgotPasswordService.set).toHaveBeenCalledWith(
        dto.email,
        MOCKED_OTP_HASHED,
      );
      expect(queueMailService.sendOTPEmailForgotPassword).toHaveBeenCalledWith({
        email: dto.email,
        otp: MOCKED_OTP_GENERATE,
        expiresAt: MOCKED_EXPIRES_AT,
      });
      expect(result).toEqual({
        resendAvailableAt: MOCKED_RESEND_AVAILABLE_AT,
      });
    });

    it("should don't generate OTP and send email because user by email is not exists", async () => {
      userRepository.isExistByEmail.mockResolvedValue(false);

      const result = await usecase.execute(dto);

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpForgotPasswordService.getCountdown).not.toHaveBeenCalled();
      expect(otpEmailForgotPasswordService.generate).not.toHaveBeenCalled();
      expect(otpEmailForgotPasswordService.hash).not.toHaveBeenCalled();
      expect(cacheOtpForgotPasswordService.set).not.toHaveBeenCalled();
      expect(
        queueMailService.sendOTPEmailForgotPassword,
      ).not.toHaveBeenCalled();
      expect(result.resendAvailableAt).toBeDefined();
    });

    it("should don't generate OTP and send email because countdown otp is not expired", async () => {
      userRepository.isExistByEmail.mockResolvedValue(true);
      cacheOtpForgotPasswordService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT,
        countdown: 10,
      });

      await expect(usecase.execute(dto)).rejects.toThrow(
        OtpCountDownNotExpiredException,
      );

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpForgotPasswordService.getCountdown).toHaveBeenCalledWith(
        dto.email,
      );
      expect(otpEmailForgotPasswordService.generate).not.toHaveBeenCalled();
      expect(otpEmailForgotPasswordService.hash).not.toHaveBeenCalled();
      expect(cacheOtpForgotPasswordService.set).not.toHaveBeenCalled();
      expect(
        queueMailService.sendOTPEmailForgotPassword,
      ).not.toHaveBeenCalled();
    });
  });
});
