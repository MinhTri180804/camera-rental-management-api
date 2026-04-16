/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  ICacheOtpEmailVerificationService,
  MAIL_QUEUE_REGISTER_NAME,
} from '@modules/auth/register/domain';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_SERVICE_TOKEN, ICacheService } from '@shared/domain';
import { UserDocument, UserSchemaClass } from '@shared/infrastructure';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { clearDatabase, setupApp } from '../../utils';
import {
  NotfoundOrExpiredOtpException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';
import { ValidationRequestException } from '@shared/presentation';
import { getQueueToken } from '@nestjs/bullmq';
import { FakeRegisterMailQueue } from '../../fakes/register-mail-queue.fake';
import { JOB_NAME } from '@modules/auth/register/infrastructure/mail-queue/job-name.constants';

describe('AuthRegisterController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let userModel: Model<UserDocument>;
  let connection: Connection;
  let cacheOtpEmailVerificationService: ICacheOtpEmailVerificationService;
  let cacheService: ICacheService;
  let fakeQueue: FakeRegisterMailQueue;

  beforeAll(async () => {
    fakeQueue = new FakeRegisterMailQueue();
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getQueueToken(MAIL_QUEUE_REGISTER_NAME))
      .useValue(fakeQueue)
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    userModel = moduleRef.get<Model<UserDocument>>(
      getModelToken(UserSchemaClass.name),
    );

    connection = moduleRef.get(getConnectionToken());
    cacheOtpEmailVerificationService = moduleRef.get(
      CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
    );
    cacheService = moduleRef.get(CACHE_SERVICE_TOKEN);
  });

  afterEach(async () => {
    await clearDatabase(connection);
    await cacheService.reset();
    fakeQueue.clear();
  });

  afterAll(async () => {
    await clearDatabase(connection);
    await cacheService.reset();
    fakeQueue.clear();
    if (app) {
      await app.close();
    }
  });

  describe('Auth Send Otp Verification Email Api', () => {
    it('should return 200 success for auth register endpoint', async () => {
      const emailRegister = 'mock@example.com';
      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({
          email: emailRegister,
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: { resendAvailableAt: expect.any(Number) as number },
          });
        });

      const isExistsOtp =
        await cacheOtpEmailVerificationService.isExist('mock@example.com');
      const countdown =
        await cacheOtpEmailVerificationService.getCountdown('mock@example.com');

      // Otp verification email exists in cache
      expect(isExistsOtp).toBeTruthy();
      expect(countdown).toEqual({
        status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT,
        countdown: expect.any(Number) as number,
      });
      expect(fakeQueue.jobs.length).toBe(1);
      expect(fakeQueue.jobs[0].name).toBe(JOB_NAME.SEND_OTP_EMAIL_VERIFICATION);
      expect(fakeQueue.jobs[0].data.otp).toBeDefined();
      expect(fakeQueue.jobs[0].data.email).toBe(emailRegister);
    });

    it("should return 200 success but don't execute send email verification otp when user already exists", async () => {
      // Create a user first
      await userModel.create({
        email: 'mock@example.com',
        password: 'password123',
      });

      // Try to send OTP - should not send email (user already exists)
      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({
          email: 'mock@example.com',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            // 🔒 Security: prevent user enumeration.
            // Always return a "fake" resendAvailableAt when user exist
            // to make the response indistinguishable from a valid flow.
            data: { resendAvailableAt: expect.any(Number) as number },
          });
        });

      // Verify no OTP was generated
      const isExistsOtp =
        await cacheOtpEmailVerificationService.isExist('mock@example.com');

      expect(isExistsOtp).toBeFalsy();
      expect(fakeQueue.jobs.length).toBe(0);
    });

    it('should return 429 for countdown verify otp not expired', async () => {
      const emailRegister = 'test@example.com';

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      const countdownData =
        await cacheOtpEmailVerificationService.getCountdown(emailRegister);

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: OtpResendTooEarlyException.ERROR_CODE,
              details: {
                remainingMs: countdownData.countdown,
              },
            },
          });
        });
    });

    it('should return 200 success then wait for countdown', async () => {
      const emailRegister = 'test@example.com';

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK);

      const {
        email: oldEmail,
        otp: oldOtp,
        expiresAt: oldExpiresAt,
      } = fakeQueue.jobs[0].data;

      const { countdown } =
        await cacheOtpEmailVerificationService.getCountdown(emailRegister);

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: OtpResendTooEarlyException.ERROR_CODE,
              details: {
                remainingMs: countdown,
              },
            },
          });
        });

      // Simulator countdown expired and this countdown resend removed in cache
      const countdownKey =
        cacheOtpEmailVerificationService.getKey(emailRegister);
      await cacheService.delete(
        `${countdownKey}:${cacheOtpEmailVerificationService.countdownPrefix}`,
      );

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      const {
        email: newEmail,
        otp: newOtp,
        expiresAt: newExpiresAt,
      } = fakeQueue.jobs[1].data;

      expect(fakeQueue.jobs.length).toBe(2);
      expect(newOtp).not.toBe(oldOtp);
      expect(newExpiresAt).not.toBe(oldExpiresAt);
      expect(newEmail).toBe(oldEmail);
    });

    it('should return 400 for request body invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: 'wrongEmail' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: ValidationRequestException.ERROR_CODE,
              details: [
                {
                  field: 'email',
                  message: [expect.any(String)],
                },
              ],
            },
          });
        });
    });
  });

  describe('Auth Resend Otp Verification Email Api', () => {
    it('should return success message for auth resend otp verification email endpoint', async () => {
      const emailRegister = 'test@example.com';

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      const { otp: oldOtp, email: oldEmail } = fakeQueue.jobs[0].data;

      // Simulator countdown expired and this countdown resend removed in cache
      const keyCache = cacheOtpEmailVerificationService.getKey(emailRegister);
      const countdownKey = `${keyCache}:${cacheOtpEmailVerificationService.countdownPrefix}`;
      await cacheService.delete(countdownKey);

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp/resend')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      const isCountdownExists = await cacheService.get(countdownKey);
      const isOtpExistsInCache = await cacheService.exists(keyCache);
      const { otp: newOtp, email: newEmail } = fakeQueue.jobs[1].data;

      expect(isCountdownExists).toBeTruthy();
      expect(isOtpExistsInCache).toBeTruthy();
      expect(fakeQueue.jobs.length).toBe(2);
      expect(newOtp).not.toBe(oldOtp);
      expect(newEmail).toBe(oldEmail);
      expect(newEmail).toBe(emailRegister);
      expect(oldEmail).toBe(emailRegister);
    });

    it("should don't resend for otp old not exists in cache (not call api send email first)", async () => {
      const emailRegister = 'test@example.com';

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp/resend')
        .send({ email: emailRegister })
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: NotfoundOrExpiredOtpException.ERROR_CODE,
            },
          });
        });
    });

    it("should don't resend for countdown of otp not expired", async () => {
      const emailRegister = 'test@example.com';
      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp')
        .send({
          email: emailRegister,
        })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp/resend')
        .send({ email: emailRegister })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: OtpResendTooEarlyException.ERROR_CODE,
              details: {
                remainingMs: expect.any(Number) as number,
              },
            },
          });
        });

      expect(fakeQueue.jobs.length).toBe(1);
    });

    it("should don't resend for request body invalid", async () => {
      await request(app.getHttpServer())
        .post('/auth/register/send-email-verification-otp/resend')
        .send({ email: 'wrong' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: ValidationRequestException.ERROR_CODE,
              details: [
                {
                  field: 'email',
                  message: [expect.any(String)],
                },
              ],
            },
          });
        });
    });
  });
});
