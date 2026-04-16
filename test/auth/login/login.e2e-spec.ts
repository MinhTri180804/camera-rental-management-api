import { hashPassword } from '@common/utils/hash-password.util';
import { EmailOrPasswordInvalidException } from '@modules/auth/shared/presentation';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument, UserSchemaClass } from '@shared/infrastructure';
import { ValidationRequestException } from '@shared/presentation';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { MockMailProcessor } from '../../mock-mail-processor';
import { clearDatabase, setupApp } from '../../utils';

describe('AuthLoginController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleRef: TestingModule;
  let userModel: Model<UserDocument>;
  let connection: Connection;

  beforeEach(async () => {
    const hashedPassword = await hashPassword('mockPassword@123');
    await userModel.create({
      email: 'mock@example.com',
      password: hashedPassword,
      two_factor_enabled: false,
    });
  });

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('MailProcessor')
      .useClass(MockMailProcessor)
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    userModel = moduleRef.get<Model<UserDocument>>(
      getModelToken(UserSchemaClass.name),
    );

    connection = moduleRef.get(getConnectionToken());
  });

  afterEach(async () => {
    await clearDatabase(connection);
  });

  afterAll(async () => {
    await clearDatabase(connection);
    if (app) {
      await app.close();
    }
  });

  describe('Auth Login Api', () => {
    it('should return access token and refresh token for auth login endpoint', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'mock@example.com',
          password: 'mockPassword@123',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            message: expect.any(String) as string,
            data: {
              accessToken: expect.any(String) as string,
              refreshToken: expect.any(String) as string,
            },
          });
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'mock@example.com',
          password: 'wrongPassword@123',
        })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            error: {
              code: EmailOrPasswordInvalidException.ERROR_CODE,
              message: EmailOrPasswordInvalidException.DEFAULT_MESSAGE,
              details: {
                email: expect.any(String) as string,
                password: expect.any(String) as string,
              },
            },
          });
        });
    });
    it('should return 400 when email is invalid', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'mockPassword@123',
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
                  field: 'email',
                  message: [expect.any(String)],
                },
              ],
            },
          });
        });
    });

    it('should return 400 when password is invalid', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'mock@example.com',
          password: 'mockPassword',
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

    it('should return 400 when password and email is invalid', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test.com',
          password: 'password123',
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
                  field: 'email',
                  message: [expect.any(String)],
                },
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
