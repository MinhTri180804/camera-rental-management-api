import {
  IMailQueueRegisterService,
  MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  ICacheOtpEmailVerificationService,
  IOtpEmailVerificationService,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain/port/user.repository';
import {
  NotfoundOrExpiredOtpException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';
import { Test, TestingModule } from '@nestjs/testing';
import { ResendEmailVerificationOtpDTO } from '../../dto/resend-email-verification-otp.dto';
import { ResendEmailVerificationOtpUseCase } from './resend-email-verification-otp.usecase';

describe('ResendEmailVerificationOTPUsecase', () => {
  let usecase: ResendEmailVerificationOtpUseCase;
  let userRepository: jest.Mocked<Pick<IUserRepository, 'isExistByEmail'>>;
  let cacheOtpEmailVerification: jest.Mocked<
    Pick<ICacheOtpEmailVerificationService, 'getCountdown' | 'isExist' | 'set'>
  >;
  let otpEmailVerificationService: jest.Mocked<
    Pick<IOtpEmailVerificationService, 'generate' | 'hash'>
  >;
  let mailQueueRegisterService: jest.Mocked<
    Pick<IMailQueueRegisterService, 'resendOtpEmailVerification'>
  >;

  const dto: ResendEmailVerificationOtpDTO = {
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const userRepositoryMocked = {
      isExistByEmail: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<boolean>
      >,
    };

    const cacheOtpEmailVerificationMocked = {
      getCountdown: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<{
          status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS;
          countdown: number | null;
        }>
      >,

      isExist: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<boolean>
      >,

      set: jest.fn() as jest.MockedFunction<
        (email: string, otpHashed: string) => Promise<void>
      >,
    };

    const otpEmailVerificationServiceMocked = {
      generate: jest.fn() as jest.Mocked<() => string>,
      hash: jest.fn() as jest.Mocked<(otp: string) => string>,
    };

    const mailQueueRegisterServiceMocked = {
      resendOtpEmailVerification: jest.fn() as jest.Mocked<
        (email: string, otp: string, expiresAt: number) => Promise<void>
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendEmailVerificationOtpUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: cacheOtpEmailVerificationMocked,
        },
        {
          provide: OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: otpEmailVerificationServiceMocked,
        },
        {
          provide: MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
          useValue: mailQueueRegisterServiceMocked,
        },
      ],
    }).compile();

    usecase = module.get(ResendEmailVerificationOtpUseCase);
    userRepository = module.get(USER_REPOSITORY_TOKEN);
    cacheOtpEmailVerification = module.get(
      CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    otpEmailVerificationService = module.get(
      OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    mailQueueRegisterService = module.get(MAIL_QUEUE_REGISTER_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should resend OTP email verification', async () => {
      const OTP_MOCK = '123123';
      const OTP_HASHED_MOCK = 'hashed-otp';
      userRepository.isExistByEmail.mockResolvedValue(false);
      cacheOtpEmailVerification.isExist.mockResolvedValue(true);
      cacheOtpEmailVerification.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
      cacheOtpEmailVerification.set.mockResolvedValue({
        expiresAt: Date.now(),
        resendAvailableAt: Date.now() + 60000,
      });
      otpEmailVerificationService.generate.mockReturnValue(OTP_MOCK);
      otpEmailVerificationService.hash.mockReturnValue(OTP_HASHED_MOCK);

      await usecase.execute(dto);

      expect(otpEmailVerificationService.generate).toHaveBeenCalled();
      expect(otpEmailVerificationService.hash).toHaveBeenCalledWith(OTP_MOCK);
      expect(cacheOtpEmailVerification.set).toHaveBeenCalledWith(
        dto.email,
        OTP_HASHED_MOCK,
      );
      expect(
        mailQueueRegisterService.resendOtpEmailVerification,
      ).toHaveBeenCalled();
    });

    it("should don't resend OTP email verification when user exist", async () => {
      userRepository.isExistByEmail.mockResolvedValue(true);

      await usecase.execute(dto);

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(
        mailQueueRegisterService.resendOtpEmailVerification,
      ).not.toHaveBeenCalled();
    });

    it("should don't resend OTP email verification and throw error NotfoundOrExpiredOtpException when old expired or not found in cache", async () => {
      userRepository.isExistByEmail.mockResolvedValue(false);
      cacheOtpEmailVerification.isExist.mockResolvedValue(false);

      await expect(usecase.execute(dto)).rejects.toThrow(
        NotfoundOrExpiredOtpException,
      );

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailVerification.isExist).toHaveBeenCalledWith(dto.email);
      expect(
        mailQueueRegisterService.resendOtpEmailVerification,
      ).not.toHaveBeenCalled();
    });

    it("should don't resend OTP email verification and throw error OtpResendTooEarlyException when countdown not expired", async () => {
      userRepository.isExistByEmail.mockResolvedValue(false);
      cacheOtpEmailVerification.isExist.mockResolvedValue(true);
      cacheOtpEmailVerification.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT,
        countdown: 60,
      });

      await expect(usecase.execute(dto)).rejects.toThrow(
        OtpResendTooEarlyException,
      );

      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailVerification.isExist).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailVerification.getCountdown).toHaveBeenCalledWith(
        dto.email,
      );
      expect(
        mailQueueRegisterService.resendOtpEmailVerification,
      ).not.toHaveBeenCalled();
    });
  });
});
