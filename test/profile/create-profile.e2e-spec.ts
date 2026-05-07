/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { hashPassword } from '@common/utils/hash-password.util';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ProfileDocument,
  ProfileSchemaClass,
  UserDocument,
  UserSchemaClass,
} from '@shared/infrastructure';
import { Connection, Model, Types } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { clearDatabase, setupApp } from '../utils';
import { ValidationRequestException } from '@shared/presentation';

describe('CreateProfileController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let profileModel: Model<ProfileDocument>;
  let userModel: Model<UserDocument>;
  let connection: Connection;

  const USER_MOCK = {
    email: 'mock@example.com',
    password: 'mockPassword@123',
    userId: null,
  } as { email: string; password: string; userId: null | string };

  let ACCESS_TOKEN: string | null = null;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    profileModel = moduleRef.get<Model<ProfileDocument>>(
      getModelToken(ProfileSchemaClass.name),
    );
    userModel = moduleRef.get<Model<UserDocument>>(
      getModelToken(UserSchemaClass.name),
    );

    connection = moduleRef.get(getConnectionToken());
  });

  beforeEach(async () => {
    const hashedPassword = await hashPassword(USER_MOCK.password);
    const user = await userModel.create({
      email: USER_MOCK.email,
      password: hashedPassword,
      two_factor_enabled: false,
    });
    USER_MOCK.userId = user._id.toString();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: USER_MOCK.email,
        password: USER_MOCK.password,
      });

    const { accessToken } = loginResponse.body.data as {
      accessToken: string;
    };
    ACCESS_TOKEN = accessToken;
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

  describe('Profile Create Api', () => {
    const CREATE_DATA_MOCK = {
      firstName: 'First Name Mock',
      lastName: 'Last Name Mock',
    };

    it('should create profile successfully no include avatar', async () => {
      await request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          firstName: CREATE_DATA_MOCK.firstName,
          lastName: CREATE_DATA_MOCK.lastName,
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: true,
            data: {
              id: expect.any(String) as string,
              firstName: CREATE_DATA_MOCK.firstName,
              lastName: CREATE_DATA_MOCK.lastName,
              avatarUrl: null,
              avatarPublicId: null,
            },
            message: expect.any(String) as string,
          });
        });

      const profile = await profileModel.findOne({
        userId: USER_MOCK.userId,
      });
      expect(profile).toBeDefined();
    });

    // TODO: implement case create profile successfully with avatar

    it('should return 209 conflict when user profile is exits', async () => {
      await profileModel.create({
        user_id: new Types.ObjectId(USER_MOCK.userId as string),
        first_name: CREATE_DATA_MOCK.firstName,
        last_name: CREATE_DATA_MOCK.lastName,
      });

      await request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          firstName: CREATE_DATA_MOCK.firstName,
          lastName: CREATE_DATA_MOCK.lastName,
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should return 400 bad request when field request body validation (lastName)', async () => {
      await request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          firstName: 'First Name',
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
                  field: 'lastName',
                  message: [expect.any(String) as string],
                },
              ],
            },
          });
        });
    });

    it('should return 400 bad request when field request body validation (firstName)', async () => {
      await request(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          lastName: 'Last Name',
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
                  field: 'firstName',
                  message: [expect.any(String) as string],
                },
              ],
            },
          });
        });
    });
  });
});
