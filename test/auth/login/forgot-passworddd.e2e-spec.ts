/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { hashPassword } from '@common/utils/hash-password.util';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  ICacheOtpEmailForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_NAME,
} from '@modules/auth/forgot-password/domain';
import { getQueueToken } from '@nestjs/bullmq';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_SERVICE_TOKEN, ICacheService } from '@shared/domain';
import { UserDocument, UserSchemaClass } from '@shared/infrastructure';
import { Connection, Model } from 'mongoose';
import { AppModule } from '../../../src/app.module';
import request from 'supertest';
import { clearDatabase, setupApp } from '../../utils';
import { ForgotPasswordMailQueueFake } from '../../fakes/forgot-password-mail-queue.fake';
import { ValidationRequestException } from '@shared/presentation';
import {
  InvalidOrExpiredOtpException,
  OtpCountDownNotExpiredException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';

describe('ForgotPasswordController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;
  let cacheOtpForgotPasswordService: ICacheOtpEmailForgotPasswordService;
  let fakeQueue: ForgotPasswordMailQueueFake;
  let moduleRef: TestingModule;
  let connection: Connection;
  let cacheService: ICacheService;

  const userMocked = {
    email: 'test@example.com',
    password: 'testPassword@123',
  };

  beforeAll(async () => {
    fakeQueue = new ForgotPasswordMailQueueFake();
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getQueueToken(MAIL_QUEUE_FORGOT_PASSWORD_NAME))
      .useValue(fakeQueue)
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    userModel = moduleRef.get(getModelToken(UserSchemaClass.name));
    cacheOtpForgotPasswordService = moduleRef.get(
      CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
    );
    connection = moduleRef.get(getConnectionToken());
    cacheService = moduleRef.get(CACHE_SERVICE_TOKEN);
  });

  afterAll(async () => {
    await clearDatabase(connection);
    await cacheService.reset();
    fakeQueue.clear();

    if (app) await app.close();
  });

  beforeEach(async () => {
    const passwordHashed = await hashPassword(userMocked.password);
    await userModel.create({
      email: userMocked.email,
      password: passwordHashed,
      two_factor_enabled: false,
    });
  });

  afterEach(async () => {
    await clearDatabase(connection);
    await cacheService.reset();
    fakeQueue.clear();
  });

  describe('Auth Forgot Password Api', () => {
    it('should return 200 for send email forgot password successfully', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: userMocked.email,
        })
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

      const otpCache = await cacheOtpForgotPasswordService.get(
        userMocked.email,
      );
      const otpForgotPasswordCountdown =
        await cacheOtpForgotPasswordService.getCountdown(userMocked.email);

      expect(otpCache).toBeDefined();
      expect(otpForgotPasswordCountdown).toBeDefined();
      expect(fakeQueue.jobs.length).toBe(1);
      expect(fakeQueue.jobs[0].data.email).toBe(userMocked.email);
    });

    it('should return 400 for request body is invalid', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'test.com' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((req) => {
          expect(req.body).toMatchObject({
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

    it("should return 200 but don't send email forgot password because email is not exist in users", async () => {
      const emailNotFoundMocked = 'emailNotFound@example.com';
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: emailNotFoundMocked })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              // 🔒 Security: prevent user enumeration.
              // Always return a "fake" resendAvailableAt when user exist
              // to make the response indistinguishable from a valid flow.
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      const otp = await cacheOtpForgotPasswordService.get(emailNotFoundMocked);

      expect(otp).toBeNull();
      expect(fakeQueue.jobs.length).toBe(0);
    });

    it('should return 429 for spam send forgot password when countdown is not expired', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: userMocked.email })
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

      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: userMocked.email,
        })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              message: expect.any(String) as string,
              code: OtpCountDownNotExpiredException.ERROR_CODE,
              details: {
                countdown: expect.any(Number) as number,
              },
            },
          });
        });

      expect(fakeQueue.jobs.length).toBe(1);
    });
  });

  describe('Auth Resend Forgot Password Api', () => {
    it('should return 200 for resend email forgot password', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: userMocked.email,
        })
        .expect(HttpStatus.OK);

      // Simulator countdown of otp expired
      const cacheKey = cacheOtpForgotPasswordService.getKey(userMocked.email);
      await cacheService.delete(
        `${cacheKey}:${cacheOtpForgotPasswordService.countdownPrefix}`,
      );

      await request(app.getHttpServer())
        .post('/auth/forgot-password/resend')
        .send({
          email: userMocked.email,
        })
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

      const otpHashed = await cacheOtpForgotPasswordService.get(
        userMocked.email,
      );

      expect(otpHashed).toBeDefined();
      expect(fakeQueue.jobs.length).toBe(2);
      expect(fakeQueue.jobs[0].data.otp).not.toBe(fakeQueue.jobs[1].data.otp);
      expect(fakeQueue.jobs[1].data.email).toBe(userMocked.email);
    });

    it('should return 404 for not call api send before call api resend forgot password', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password/resend')
        .send({ email: userMocked.email })
        .expect(HttpStatus.NOT_FOUND);

      const otp = await cacheOtpForgotPasswordService.get(userMocked.email);

      expect(fakeQueue.jobs.length).toBe(0);
      expect(otp).toBeNull();
    });

    it('should return 200 but not resend forgot password because user is not exist by email', async () => {
      const emailNotFoundMocked = 'emailNotFound@example.com';
      await request(app.getHttpServer())
        .post('/auth/forgot-password/resend')
        .send({ email: emailNotFoundMocked })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              // 🔒 Security: prevent user enumeration.
              // Always return a "fake" resendAvailableAt when user exist
              // to make the response indistinguishable from a valid flow.
              resendAvailableAt: expect.any(Number) as number,
            },
          });
        });

      expect(fakeQueue.jobs.length).toBe(0);
    });

    it('should return 429 for resend otp too early and countdown not expired', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: userMocked.email })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/forgot-password/resend')
        .send({ email: userMocked.email })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              code: OtpResendTooEarlyException.ERROR_CODE,
              message: expect.any(String) as string,
              details: {
                remainingMs: expect.any(Number) as number,
              },
            },
          });
        });

      expect(fakeQueue.jobs.length).toBe(1);
    });
  });

  describe('Auth Reset Password Api', () => {
    it('should reset password successfully', async () => {
      const emailRegister = userMocked.email;
      const newPasswordMocked = 'newPassword@123';
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: emailRegister,
        })
        .expect(HttpStatus.OK);

      const otpResetPassword = fakeQueue.jobs[0].data.otp;
      expect(otpResetPassword).toBeDefined();

      const user = await userModel.findOne({ email: emailRegister });
      const oldPassword = user?.password;

      await request(app.getHttpServer())
        .post('/auth/forgot-password/reset-password')
        .send({
          email: emailRegister,
          otp: otpResetPassword,
          password: newPasswordMocked,
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: null,
          });
        });

      const userAfterResetPassword = await userModel.findOne({
        email: emailRegister,
      });
      const isExistOtpResetPassword =
        await cacheOtpForgotPasswordService.isExist(emailRegister);
      expect(userAfterResetPassword!.password).not.toBe(oldPassword);
      expect(isExistOtpResetPassword).toBeFalsy();
    });

    it('should return 400 for otp reset password not found or expired', async () => {
      const emailRegister = userMocked.email;

      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/forgot-password/reset-password')
        .send({
          email: emailRegister,
          otp: '123123',
          password: 'newPassword@123',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              code: InvalidOrExpiredOtpException.ERROR_CODE,
              message: expect.any(String) as string,
            },
          });
        });
    });

    it('should return 400 for password is invalid', async () => {
      const emailRegister = userMocked.email;

      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: emailRegister })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/forgot-password/reset-password')
        .send({
          email: emailRegister,
          otp: '123123',
          password: '123',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              code: ValidationRequestException.ERROR_CODE,
              message: expect.any(String) as string,
              details: [
                {
                  field: 'password',
                  message: [expect.any(String)],
                },
              ],
            },
          });
        });
    });
  });
});
