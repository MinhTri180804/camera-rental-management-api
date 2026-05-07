/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import {
  CACHE_SERVICE_TOKEN,
  ICacheService,
} from '@shared/domain/ports/cache.service';
import { CacheOtpForgotPasswordServiceIml } from './cache-otp-forgot-password.service.iml';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  ICacheOtpEmailForgotPasswordService,
} from '@modules/auth/forgot-password/domain/port/cache-otp-email-forgot-password.service';

describe('CacheOtpForgotPasswordService', () => {
  let service: ICacheOtpEmailForgotPasswordService;
  let cacheService: jest.Mocked<ICacheService>;

  const email = 'test@example.com';
  const otp = '123456';

  beforeEach(async () => {
    const cacheServiceMocked = {
      set: jest.fn() as jest.MockedFunction<typeof cacheService.set>,
      get: jest.fn() as jest.MockedFunction<typeof cacheService.get>,
      delete: jest.fn() as jest.MockedFunction<typeof cacheService.delete>,
      ttl: jest.fn() as jest.MockedFunction<typeof cacheService.ttl>,
      exists: jest.fn() as jest.MockedFunction<typeof cacheService.exists>,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheOtpForgotPasswordServiceIml,
        {
          provide: CACHE_SERVICE_TOKEN,
          useValue: cacheServiceMocked,
        },
      ],
    }).compile();

    service = module.get(CacheOtpForgotPasswordServiceIml);
    cacheService = module.get(CACHE_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return null when OTP does not exists', async () => {
      cacheService.get.mockResolvedValue(null);

      const result = await service.get(email);

      expect(cacheService.get).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBeNull();
    });

    it('should return otp value', async () => {
      const OTP_RETURN_MOCKED = '123123';
      cacheService.get.mockResolvedValue(OTP_RETURN_MOCKED);

      const result = await service.get(email);

      expect(cacheService.get).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBe(OTP_RETURN_MOCKED);
    });
  });

  describe('set', () => {
    it('should set OTP for email', async () => {
      const result = await service.set(email, otp);

      expect(cacheService.set).toHaveBeenCalledTimes(2);
      expect(cacheService.set).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
        otp,
        service.expiresTimeSeconds,
      );
      expect(cacheService.set).toHaveBeenLastCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
        '1',
        service.countdownSeconds,
      );
      expect(result.expiresAt).toBeGreaterThan(Date.now());
      expect(result.resendAvailableAt).toBeGreaterThan(Date.now());
    });
  });

  describe('getKey', () => {
    it('should return the correct key', () => {
      const result = service.getKey(email);
      expect(result).toBe(`${service.prefix}:${email}`);
    });
  });

  describe('delete', () => {
    it('should delete OTP for email', async () => {
      await service.delete(email);

      // First delete cache otp
      // Second delete countdown of cache otp
      expect(cacheService.delete).toHaveBeenCalledTimes(2);
      expect(cacheService.delete).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(cacheService.delete).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
    });
  });

  describe('getCountdown', () => {
    it('should return CAN_RESEND when ttl is null', async () => {
      cacheService.ttl.mockResolvedValue(null);

      const result = await service.getCountdown(email);

      expect(cacheService.ttl).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
      expect(result).toEqual({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
    });

    it('should return WAIT when ttl is number value', async () => {
      cacheService.ttl.mockResolvedValue(300);

      const result = await service.getCountdown(email);

      expect(cacheService.ttl).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
      expect(result).toEqual({
        status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT,
        countdown: 300,
      });
    });
  });

  describe('isExist', () => {
    it('should return true when OTP exists', async () => {
      cacheService.exists.mockResolvedValue(true);

      const result = await service.isExist(email);

      expect(cacheService.exists).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBe(true);
    });

    it('should return false when OTP does not exist', async () => {
      cacheService.exists.mockResolvedValue(false);

      const result = await service.isExist(email);

      expect(cacheService.exists).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBe(false);
    });
  });
});
