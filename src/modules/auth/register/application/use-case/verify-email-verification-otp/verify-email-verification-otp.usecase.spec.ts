import { hashPassword as hashPasswordUtil } from '@common/utils/hash-password.util';
import {
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  ICacheOtpEmailVerificationService,
} from '@modules/auth/register/domain/ports/cache-otp-email-verification.service';
import {
  IJwtService,
  JWT_SERVICE_TOKEN,
} from '@modules/auth/shared/domain/port/jwt.service';
import {
  IOtpEmailVerificationService,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain/ports/otp-email-verification.service';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain/port/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyEmailVerificationOtpDTO } from '../../dto/verify-email-verification-otp.dto';
import { VerifyEmailVerificationOtpUseCase } from './verify-email-verification-otp.usecase';
import { InvalidOrExpiredOtpException } from '@modules/auth/shared/presentation/exception/invalid-or-expired-otp.exception';

jest.mock('@common/utils/hash-password.util', () => ({
  hashPassword: jest.fn() as jest.MockedFunction<typeof hashPasswordUtil>,
}));

describe('VerifyEmailVerificationOtpUseCase', () => {
  let usecase: VerifyEmailVerificationOtpUseCase;
  let userRepository: jest.Mocked<Pick<IUserRepository, 'create'>>;
  let cacheOtpEmailVerificationService: jest.Mocked<
    Pick<ICacheOtpEmailVerificationService, 'delete' | 'get'>
  >;

  let otpEmailVerificationService: jest.Mocked<
    Pick<IOtpEmailVerificationService, 'verify'>
  >;
  let jwtService: jest.Mocked<
    Pick<IJwtService, 'signAccessToken' | 'signRefreshToken'>
  >;

  const hashPassword = hashPasswordUtil as jest.MockedFunction<
    typeof hashPasswordUtil
  >;

  const mockDTO: VerifyEmailVerificationOtpDTO = {
    email: 'test@example.com',
    otp: '123456',
    password: 'password123',
  };

  beforeEach(async () => {
    const userRepositoryMocked = {
      create: jest.fn() as jest.MockedFunction<IUserRepository['create']>,
    };

    const cacheOtpEmailVerificationServiceMocked = {
      get: jest.fn() as jest.MockedFunction<
        ICacheOtpEmailVerificationService['get']
      >,
      delete: jest.fn() as jest.MockedFunction<
        ICacheOtpEmailVerificationService['delete']
      >,
    };

    const otpEmailVerificationServiceMocked = {
      verify: jest.fn() as jest.MockedFunction<
        IOtpEmailVerificationService['verify']
      >,
    };

    const jwtServiceMocked: jest.Mocked<
      Pick<IJwtService, 'signAccessToken' | 'signRefreshToken'>
    > = {
      signAccessToken: jest.fn() as jest.MockedFunction<
        IJwtService['signAccessToken']
      >,
      signRefreshToken: jest.fn() as jest.MockedFunction<
        IJwtService['signRefreshToken']
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyEmailVerificationOtpUseCase,
        {
          provide: CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: cacheOtpEmailVerificationServiceMocked,
        },
        {
          provide: OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
          useValue: otpEmailVerificationServiceMocked,
        },
        {
          provide: JWT_SERVICE_TOKEN,
          useValue: jwtServiceMocked,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
      ],
    }).compile();

    usecase = module.get<VerifyEmailVerificationOtpUseCase>(
      VerifyEmailVerificationOtpUseCase,
    );
    userRepository = module.get(USER_REPOSITORY_TOKEN);
    cacheOtpEmailVerificationService = module.get(
      CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    otpEmailVerificationService = module.get(
      OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    jwtService = module.get(JWT_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should verify email verification otp correct', async () => {
      const PASSWORD_HASHED = 'passwordHashed';
      const OTP_HASHED = 'hashedOTP';
      const ACCESS_TOKEN = 'access-token';
      const REFRESH_TOKEN = 'refresh-token';
      const USER_ID = '12312313';

      cacheOtpEmailVerificationService.get.mockResolvedValue(OTP_HASHED);
      otpEmailVerificationService.verify.mockResolvedValue(true);
      hashPassword.mockResolvedValue(PASSWORD_HASHED);
      jwtService.signAccessToken.mockReturnValue(ACCESS_TOKEN);
      jwtService.signRefreshToken.mockReturnValue(REFRESH_TOKEN);
      userRepository.create.mockResolvedValue({
        id: USER_ID,
        email: mockDTO.email,
        password: PASSWORD_HASHED,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await usecase.execute(mockDTO);

      // Method get of cacheOtpEmailVerificationService execute
      expect(cacheOtpEmailVerificationService.get).toHaveBeenCalledTimes(1);
      expect(cacheOtpEmailVerificationService.get).toHaveBeenCalledWith(
        mockDTO.email,
      );

      // Method verify of otpEmailVerificationService execute
      expect(otpEmailVerificationService.verify).toHaveBeenCalledTimes(1);
      expect(otpEmailVerificationService.verify).toHaveBeenCalledWith(
        mockDTO.otp,
        OTP_HASHED,
      );

      // Method hashPassword execute
      expect(hashPassword).toHaveBeenCalledTimes(1);
      expect(hashPassword).toHaveBeenCalledWith(mockDTO.password);

      // Method create of userRepository execute
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: mockDTO.email,
        password: PASSWORD_HASHED,
        twoFactorEnabled: false,
      });

      // Method delete of cacheOtpEmailVerificationService execute
      expect(cacheOtpEmailVerificationService.delete).toHaveBeenCalledTimes(1);
      expect(cacheOtpEmailVerificationService.delete).toHaveBeenCalledWith(
        mockDTO.email,
      );

      // Method signAccessToken of jwtService execute
      expect(jwtService.signAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtService.signAccessToken).toHaveBeenCalledWith({
        userId: USER_ID,
        email: mockDTO.email,
      });

      // Method signRefreshToken of jwtService execute
      expect(jwtService.signRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.signRefreshToken).toHaveBeenCalledWith({
        userId: USER_ID,
        email: mockDTO.email,
      });

      expect(result).toEqual({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      });
    });
    it('should verify email verification otp incorrect', async () => {
      // Arrange
      const OTP_HASHED = 'hashedOTP';

      cacheOtpEmailVerificationService.get.mockResolvedValue(OTP_HASHED);
      otpEmailVerificationService.verify.mockResolvedValue(false);

      // Act
      await expect(usecase.execute(mockDTO)).rejects.toThrow(
        InvalidOrExpiredOtpException,
      );

      // Assert
      expect(cacheOtpEmailVerificationService.get).toHaveBeenCalledWith(
        mockDTO.email,
      );

      expect(otpEmailVerificationService.verify).toHaveBeenCalledWith(
        mockDTO.otp,
        OTP_HASHED,
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidOrExpiredOtpException when otp is not found or expired', async () => {
      cacheOtpEmailVerificationService.get.mockResolvedValue(null);

      await expect(usecase.execute(mockDTO)).rejects.toThrow(
        InvalidOrExpiredOtpException,
      );

      expect(cacheOtpEmailVerificationService.get).toHaveBeenCalledWith(
        mockDTO.email,
      );
      expect(otpEmailVerificationService.verify).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(jwtService.signAccessToken).not.toHaveBeenCalled();
      expect(jwtService.signRefreshToken).not.toHaveBeenCalled();
    });
  });
});
