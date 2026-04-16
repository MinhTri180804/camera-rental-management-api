import { hashPassword as hashPasswordUtil } from '@common/utils/hash-password.util';
import {
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
import { ResetPasswordDTO } from '../../dto/reset-password.dto';
import { User } from '@modules/auth/shared/domain/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordUseCase } from '../reset-password/reset-password.usecase';
import { InvalidOrExpiredOtpException } from '@modules/auth/shared/presentation/exception/invalid-or-expired-otp.exception';
import { DUMP_OTP } from '@modules/auth/shared/presentation/constants/dump-otp.constant';

jest.mock('@common/utils/hash-password.util.ts', () => ({
  hashPassword: jest.fn() as jest.MockedFunction<typeof hashPasswordUtil>,
}));

describe('ResetPasswordUseCase', () => {
  let usecase: ResetPasswordUseCase;
  let userRepository: jest.Mocked<
    Pick<IUserRepository, 'updatePassword' | 'findByEmail'>
  >;

  let otpEmailForgotPasswordService: jest.Mocked<
    Pick<IOtpEmailForgotPasswordService, 'verify'>
  >;
  let cacheOtpEmailForgotPasswordService: jest.Mocked<
    Pick<ICacheOtpEmailForgotPasswordService, 'get' | 'delete'>
  >;

  const hashPassword = hashPasswordUtil as jest.MockedFunction<
    typeof hashPasswordUtil
  >;

  const dto: ResetPasswordDTO = {
    email: 'test@example.com',
    otp: '123456',
    password: 'newPassword123',
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const userRepositoryMocked = {
      findByEmail: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<User | null>
      >,
      updatePassword: jest.fn() as jest.MockedFunction<
        (userId: string, newPassword: string) => Promise<void>
      >,
    };

    const otpEmailForgotPasswordServiceMocked = {
      verify: jest.fn() as jest.MockedFunction<
        (otp: string, hashedOtp: string) => Promise<boolean>
      >,
    };

    const cacheOtpEmailForgotPasswordServiceMocked = {
      get: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<string | null>
      >,
      delete: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<void>
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: otpEmailForgotPasswordServiceMocked,
        },
        {
          provide: CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
          useValue: cacheOtpEmailForgotPasswordServiceMocked,
        },
      ],
    }).compile();

    usecase = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);

    otpEmailForgotPasswordService = module.get<
      jest.Mocked<Pick<IOtpEmailForgotPasswordService, 'verify'>>
    >(OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN);

    cacheOtpEmailForgotPasswordService = module.get<
      jest.Mocked<Pick<ICacheOtpEmailForgotPasswordService, 'get' | 'delete'>>
    >(CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN);

    userRepository = module.get(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should reset password', async () => {
      const OTP_HASHED_MOCK = 'otp-hashed';
      const NEW_PASSWORD_HASHED_MOCK = 'new-password-hashed';
      userRepository.findByEmail.mockResolvedValue(mockUser);
      cacheOtpEmailForgotPasswordService.get.mockResolvedValue(OTP_HASHED_MOCK);
      otpEmailForgotPasswordService.verify.mockResolvedValue(true);
      hashPassword.mockResolvedValue(NEW_PASSWORD_HASHED_MOCK);

      await usecase.execute(dto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.get).toHaveBeenCalledWith(
        dto.email,
      );
      expect(otpEmailForgotPasswordService.verify).toHaveBeenCalledWith(
        dto.otp,
        OTP_HASHED_MOCK,
      );
      expect(hashPassword).toHaveBeenCalledWith(dto.password);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        NEW_PASSWORD_HASHED_MOCK,
      );
      expect(cacheOtpEmailForgotPasswordService.delete).toHaveBeenCalledWith(
        dto.email,
      );
    });

    it("should don't reset password when user not found and don't have otp in cache", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      cacheOtpEmailForgotPasswordService.get.mockResolvedValue(null);

      await expect(usecase.execute(dto)).rejects.toThrow(
        InvalidOrExpiredOtpException,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.get).toHaveBeenCalledWith(
        dto.email,
      );
      expect(otpEmailForgotPasswordService.verify).toHaveBeenCalledWith(
        dto.otp,
        DUMP_OTP,
      );
      expect(hashPassword).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
      expect(cacheOtpEmailForgotPasswordService.delete).not.toHaveBeenCalled();
    });

    it("should don't reset password when otp not match or expired", async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      cacheOtpEmailForgotPasswordService.get.mockResolvedValue(null);

      await expect(usecase.execute(dto)).rejects.toThrow(
        InvalidOrExpiredOtpException,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(cacheOtpEmailForgotPasswordService.get).toHaveBeenCalledWith(
        dto.email,
      );
      expect(otpEmailForgotPasswordService.verify).toHaveBeenCalledWith(
        dto.otp,
        DUMP_OTP,
      );
      expect(hashPassword).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
      expect(cacheOtpEmailForgotPasswordService.delete).not.toHaveBeenCalled();
    });
  });
});
