/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.usecase';
import {
  IJwtService,
  IUserRepository,
  JWT_SERVICE_TOKEN,
  User,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { comparePassword } from '@common/utils/hash-password.util';
import { LoginDTO } from '../dto';
import {
  DUMP_PASSWORD_HASHED,
  EmailOrPasswordInvalidException,
} from '@modules/auth/shared/presentation';

jest.mock('@common/utils/hash-password.util', () => ({
  comparePassword: jest.fn(),
}));

describe('Login Use Case', () => {
  let usecaseMock: LoginUseCase;
  let jwtServiceMock: jest.Mocked<IJwtService>;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  const comparePasswordMock = comparePassword as jest.Mock;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const loginDTO: LoginDTO = {
    email: 'test@example.com',
    password: 'password@123',
  };

  beforeEach(async () => {
    const jwtServiceMocked: Pick<
      IJwtService,
      'signAccessToken' | 'signRefreshToken'
    > = {
      signAccessToken: jest.fn() as jest.MockedFunction<
        (payload: { userId: string; email: string }) => string
      >,
      signRefreshToken: jest.fn() as jest.MockedFunction<
        (payload: { userId: string; email: string }) => string
      >,
    };

    const userRepositoryMocked: Pick<IUserRepository, 'findByEmail'> = {
      findByEmail: jest.fn() as jest.MockedFunction<
        (email: string) => Promise<User | null>
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepositoryMocked,
        },
        {
          provide: JWT_SERVICE_TOKEN,
          useValue: jwtServiceMocked,
        },
      ],
    }).compile();

    usecaseMock = module.get<LoginUseCase>(LoginUseCase);
    jwtServiceMock = module.get(JWT_SERVICE_TOKEN);
    userRepositoryMock = module.get(USER_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tokens when credentials are valid', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
      jwtServiceMock.signAccessToken.mockReturnValue('access-token');
      jwtServiceMock.signRefreshToken.mockReturnValue('refresh-token');
      comparePasswordMock.mockResolvedValue(true);

      const result = await usecaseMock.execute(loginDTO);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(jwtServiceMock.signAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.signAccessToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });
      expect(jwtServiceMock.signRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.signRefreshToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        loginDTO.email,
      );
      expect(comparePasswordMock).toHaveBeenCalledTimes(1);
      expect(comparePasswordMock).toHaveBeenCalledWith(
        loginDTO.password,
        mockUser.password,
      );
    });

    it('should throw EmailOrPasswordInvalidException and use dump password when credentials are invalid', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      comparePasswordMock.mockResolvedValue(false);

      await expect(usecaseMock.execute(loginDTO)).rejects.toThrow(
        EmailOrPasswordInvalidException,
      );

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        loginDTO.email,
      );

      // ComparePassword called and using dump password avoid timing attack
      expect(comparePasswordMock).toHaveBeenCalledTimes(1);
      expect(comparePasswordMock).toHaveBeenCalledWith(
        loginDTO.password,
        DUMP_PASSWORD_HASHED,
      );
    });

    it('Should throw EmailOrPasswordInvalidException when password is incorrect', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
      comparePasswordMock.mockResolvedValue(false);

      await expect(usecaseMock.execute(loginDTO)).rejects.toThrow(
        EmailOrPasswordInvalidException,
      );

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        loginDTO.email,
      );

      // ComparePassword called and using dump password avoid timing attack
      expect(comparePasswordMock).toHaveBeenCalledTimes(1);
      expect(comparePasswordMock).toHaveBeenCalledWith(
        loginDTO.password,
        mockUser.password,
      );
    });
  });
});
