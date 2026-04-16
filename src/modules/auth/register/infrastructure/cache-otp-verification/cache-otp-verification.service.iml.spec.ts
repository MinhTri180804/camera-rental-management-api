/* eslint-disable @typescript-eslint/unbound-method */
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  ICacheOtpEmailVerificationService,
} from '@modules/auth/register/domain/ports/cache-otp-email-verification.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CACHE_SERVICE_TOKEN,
  ICacheService,
} from '@shared/domain/ports/cache.service';
import { CacheOTPVerificationServiceImpl } from './cache-otp-verification.service.iml';

describe('CacheOtpVerificationServiceIml', () => {
  let service: ICacheOtpEmailVerificationService;
  let cacheService: jest.Mocked<ICacheService>;

  const email = 'test@example.com';
  const otp = '123123';

  beforeEach(async () => {
    const cacheServiceMock = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      ttl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheOTPVerificationServiceImpl,
        {
          provide: CACHE_SERVICE_TOKEN,
          useValue: cacheServiceMock,
        },
      ],
    }).compile();

    service = module.get<ICacheOtpEmailVerificationService>(
      CacheOTPVerificationServiceImpl,
    );
    cacheService = module.get(CACHE_SERVICE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('should set OTP in cache', async () => {
      const result = await service.set(email, otp);

      // First call: set OTP
      // Second call: set countdown resend of this otp
      expect(cacheService.set).toHaveBeenCalledTimes(2);
      expect(cacheService.set).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
        otp,
        service.expiresTimeSeconds,
      );
      expect(cacheService.set).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
        '1',
        service.countdownSeconds,
      );
      expect(result.expiresAt).toBeGreaterThan(Date.now());
      expect(result.resendAvailableAt).toBeGreaterThan(Date.now());
    });
  });

  describe('get', () => {
    it('should return cache OTP from email verification', async () => {
      const OTP_CACHE_VALUE_MOCK = 'otp-hashed';
      cacheService.get.mockResolvedValue(OTP_CACHE_VALUE_MOCK);

      const result = await service.get(email);

      expect(result).toEqual(OTP_CACHE_VALUE_MOCK);
      expect(cacheService.get).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
    });

    it('should return null when cache OTP not found', async () => {
      cacheService.get.mockResolvedValue(null);

      const result = await service.get(email);

      expect(result).toBeNull();
      expect(cacheService.get).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
    });
  });

  describe('delete', () => {
    it('should delete cache otp and countdown', async () => {
      await service.delete(email);

      expect(cacheService.delete).toHaveBeenCalledTimes(2);
      expect(cacheService.delete).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(cacheService.delete).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
    });
  });

  describe('getKey', () => {
    it('should return key with this prefix', () => {
      const result = service.getKey(email);
      expect(result).toBe(`${service.prefix}:${email}`);
    });
  });

  describe('getCountdown', () => {
    it('should return CAN_RESEND status when ttl is null', async () => {
      cacheService.ttl.mockResolvedValue(null);

      const result = await service.getCountdown(email);

      expect(cacheService.ttl).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
      expect(result).toEqual({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.CAN_RESEND,
        countdown: null,
      });
    });

    it('should return WAIT status when ttl have number value', async () => {
      const TTL_COUNTDOWN_MOCKED = 1000;
      cacheService.ttl.mockResolvedValue(TTL_COUNTDOWN_MOCKED);

      const result = await service.getCountdown(email);

      expect(cacheService.ttl).toHaveBeenCalledWith(
        `${service.prefix}:${email}:${service.countdownPrefix}`,
      );
      expect(result).toEqual({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT,
        countdown: TTL_COUNTDOWN_MOCKED,
      });
    });
  });

  describe('isExist', () => {
    it('should return true when cache exists', async () => {
      cacheService.exists.mockResolvedValue(true);

      const result = await service.isExist(email);

      expect(cacheService.exists).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBe(true);
    });

    it('should return false when cache not exists', async () => {
      cacheService.exists.mockResolvedValue(false);

      const result = await service.isExist(email);

      expect(cacheService.exists).toHaveBeenCalledWith(
        `${service.prefix}:${email}`,
      );
      expect(result).toBe(false);
    });
  });
});
