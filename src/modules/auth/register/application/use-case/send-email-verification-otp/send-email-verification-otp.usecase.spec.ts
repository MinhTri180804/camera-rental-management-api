import {
  IMailQueueRegisterService,
  MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
} from '@modules/auth/register/domain';
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  ICacheOtpEmailVerificationService,
} from '@modules/auth/register/domain/ports/cache-otp-email-verification.service';
import {
  IOtpEmailVerificationService,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain/ports/otp-email-verification.service';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain/port/user.repository';
import { OtpResendTooEarlyException } from '@modules/auth/shared/presentation';
import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailVerificationOTPUseCase } from './send-email-verification-otp.usecase';

describe('SendEmailVerificationOtpUseCase', () => {
  let usecase: SendEmailVerificationOTPUseCase;
  let userRepository: jest.Mocked<Pick<IUserRepository, 'isExistByEmail'>>;
  let mailQueueService: jest.Mocked<
    Pick<IMailQueueRegisterService, 'sendOTPEmailVerification'>
  >;
  let otpEmailVerificationService: jest.Mocked<
    Pick<IOtpEmailVerificationService, 'generate' | 'hash'>
  >;
  let cacheOtpEmailVerificationService: jest.Mocked<
    Pick<ICacheOtpEmailVerificationService, 'getCountdown' | 'set'>
  >;

  beforeEach(async () => {
    const userRepositoryMocked: Pick<IUserRepository, 'isExistByEmail'> = {
      isExistByEmail: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<boolean>
      >,
    };

    const mailQueueServiceMocked: Pick<
      IMailQueueRegisterService,
      'sendOTPEmailVerification'
    > = {
      sendOTPEmailVerification: jest.fn() as jest.MockedFunction<
        ({
          email,
          otp,
          expiresAt,
        }: {
          email: string;
          otp: string;
          expiresAt: number;
        }) => Promise<void>
      >,
    };

    const otpEmailVerificationServiceMocked: Pick<
      IOtpEmailVerificationService,
      'generate' | 'hash'
    > = {
      generate: jest.fn() as jest.MockedFunction<() => string>,
      hash: jest.fn() as jest.MockedFunction<(otp: string) => string>,
    };

    const cacheOtpEmailVerificationServiceMocked: Pick<
      ICacheOtpEmailVerificationService,
      'getCountdown' | 'set'
    > = {
      getCountdown: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<{
          status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS;
          countdown: number | null;
        }>
      >,

      set: jest.fn() as jest.MockedFunction<
        (
          email: string,
          otp: string,
        ) => Promise<{ expiresAt: number; resendAvailableAt: number }>
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailVerificationOTPUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
          useValue: mailQueueServiceMocked,
        },
        {
          provide: CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: cacheOtpEmailVerificationServiceMocked,
        },
        {
          provide: OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: otpEmailVerificationServiceMocked,
        },
      ],
    }).compile();

    usecase = module.get<SendEmailVerificationOTPUseCase>(
      SendEmailVerificationOTPUseCase,
    );

    userRepository = module.get(USER_REPOSITORY_TOKEN);
    mailQueueService = module.get(MAIL_QUEUE_REGISTER_SERVICE_TOKEN);
    otpEmailVerificationService = module.get(
      OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    cacheOtpEmailVerificationService = module.get(
      CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should send OTP email verification', async () => {
      const emailRegister = 'test@gamil.com';
      const otp = '123123';
      const otpHashed = 'hashedOTP';

      userRepository.isExistByEmail.mockResolvedValue(false);
      cacheOtpEmailVerificationService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
      cacheOtpEmailVerificationService.set.mockResolvedValue({
        expiresAt: 1234567890,
        resendAvailableAt: 1234567890,
      });

      otpEmailVerificationService.generate.mockReturnValue(otp);
      otpEmailVerificationService.hash.mockReturnValue(otpHashed);

      await usecase.execute({
        email: emailRegister,
      });

      // Method isExistByEmail of useRepository execute
      expect(userRepository.isExistByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(emailRegister);

      // Method getCountdown of cacheOtpEmailVerificationService execute
      expect(
        cacheOtpEmailVerificationService.getCountdown,
      ).toHaveBeenCalledTimes(1);
      expect(
        cacheOtpEmailVerificationService.getCountdown,
      ).toHaveBeenCalledWith(emailRegister);

      // Method sendOTPEmailVerification of mailQueueService execute
      expect(mailQueueService.sendOTPEmailVerification).toHaveBeenCalledTimes(
        1,
      );

      // Method generate of otpEmailVerificationService execute
      expect(otpEmailVerificationService.generate).toHaveBeenCalledTimes(1);

      //   Method hash of otpEmailVerificationService execute
      expect(otpEmailVerificationService.hash).toHaveReturnedTimes(1);

      // Method set of cacheOtpEmailVerificationService execute
      expect(cacheOtpEmailVerificationService.set).toHaveBeenCalledTimes(1);
      expect(cacheOtpEmailVerificationService.set).toHaveBeenCalledWith(
        emailRegister,
        otpHashed,
      );
    });

    it("should don't send OTP email verification when email exists", async () => {
      userRepository.isExistByEmail.mockResolvedValue(true);

      await usecase.execute({
        email: 'test@gamil.com',
      });

      // Method isExistByEmail of useRepository execute
      expect(userRepository.isExistByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(
        'test@gamil.com',
      );

      // Method getCountdown of cacheOtpEmailVerificationService not execute
      expect(
        cacheOtpEmailVerificationService.getCountdown,
      ).not.toHaveBeenCalled();

      // Method sendOTPEmailVerification of mailQueueService not execute
      expect(mailQueueService.sendOTPEmailVerification).not.toHaveBeenCalled();

      // Method generate of otpEmailVerificationService not execute
      expect(otpEmailVerificationService.generate).not.toHaveBeenCalled();

      // Method hash of otpEmailVerificationService not execute
      expect(otpEmailVerificationService.hash).not.toHaveBeenCalled();

      // Method set of cacheOtpEmailVerificationService not execute
      expect(cacheOtpEmailVerificationService.set).not.toHaveBeenCalled();
    });

    it('Should throw OtpResendTooEarlyException when countdown not expired', async () => {
      const countdownMockValue = Date.now() + 300 * 1000;
      const mockedEmail = 'test@gamil.com';

      userRepository.isExistByEmail.mockResolvedValue(false);
      cacheOtpEmailVerificationService.getCountdown.mockResolvedValue({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT,
        countdown: countdownMockValue,
      });

      await expect(
        usecase.execute({
          email: mockedEmail,
        }),
      ).rejects.toThrow(OtpResendTooEarlyException);

      // Method isExistByEmail of useRepository not execute
      expect(userRepository.isExistByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.isExistByEmail).toHaveBeenCalledWith(mockedEmail);

      // Method getCountdown of cacheOtpEmailVerificationService execute
      expect(
        cacheOtpEmailVerificationService.getCountdown,
      ).toHaveBeenCalledTimes(1);
      expect(
        cacheOtpEmailVerificationService.getCountdown,
      ).toHaveBeenCalledWith(mockedEmail);

      // Method sendOTPEmailVerification of mailQueueService not execute
      expect(mailQueueService.sendOTPEmailVerification).not.toHaveBeenCalled();

      // Method generate of otpEmailVerificationService not execute
      expect(otpEmailVerificationService.generate).not.toHaveBeenCalled();

      // Method hash of otpEmailVerificationService not execute
      expect(otpEmailVerificationService.hash).not.toHaveBeenCalled();

      // Method set of cacheOtpEmailVerificationService not execute
      expect(cacheOtpEmailVerificationService.set).not.toHaveBeenCalled();
    });
  });
});
