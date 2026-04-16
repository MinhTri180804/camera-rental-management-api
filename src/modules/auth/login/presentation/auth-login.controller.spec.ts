import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '../application';
import { AuthLoginController } from './auth-login.controller';
import { SingleDataResponse } from '@shared/presentation';
import { EmailOrPasswordInvalidException } from '@modules/auth/shared/presentation';

describe('AuthLoginController', () => {
  let authController: AuthLoginController;

  const loginUsecaseMocked = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthLoginController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: loginUsecaseMocked,
        },
      ],
    }).compile();

    authController = module.get<AuthLoginController>(AuthLoginController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const dto = { email: 'test@example.com', password: '123123Tri@' };

      loginUsecaseMocked.execute.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authController.login(dto);

      expect(loginUsecaseMocked.execute).toHaveBeenCalledWith(dto);
      expect(result.data).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(result).toBeInstanceOf(SingleDataResponse);
    });

    it('should throw error when email or password invalid', async () => {
      const dto = { email: 'test@example.com', password: '123123Tri@' };

      loginUsecaseMocked.execute.mockRejectedValue(
        new EmailOrPasswordInvalidException(),
      );

      await expect(authController.login(dto)).rejects.toBeInstanceOf(
        EmailOrPasswordInvalidException,
      );
    });
  });
});
