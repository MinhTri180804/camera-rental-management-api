import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileUseCase } from '../application/use-case';
import { CreateProfileDTO } from '../application/dto';
import { CreateProfileController } from './create-profile.controller';
import { ProfileIsExistsException } from './exceptions';

describe('CreateProfileController', () => {
  let createProfileController: CreateProfileController;
  let createProfileUseCase: jest.Mocked<CreateProfileUseCase>;

  beforeAll(async () => {
    const createProfileUseCaseMocked = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProfileController],
      providers: [
        { provide: CreateProfileUseCase, useValue: createProfileUseCaseMocked },
      ],
    }).compile();

    createProfileController = module.get(CreateProfileController);
    createProfileUseCase = module.get(CreateProfileUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return 200 when create profile successfully', async () => {
    const dto: CreateProfileDTO = {
      firstName: 'John',
      lastName: 'Doe',
    };

    createProfileUseCase.execute.mockResolvedValue({
      id: '1',
      firstName: dto.firstName,
      lastName: dto.lastName,
      userId: '1',
      avatarUrl: null,
      avatarPublicId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createProfileController.execute(dto, '1');

    expect(result.data).toEqual({
      id: '1',
      firstName: dto.firstName,
      lastName: dto.lastName,
      userId: '1',
      avatarUrl: null,
      avatarPublicId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should return 409 conflict when userId exists profile', async () => {
    const dto: CreateProfileDTO = {
      firstName: 'John',
      lastName: 'Doe',
    };

    createProfileUseCase.execute.mockRejectedValue(
      new ProfileIsExistsException(),
    );

    await expect(
      createProfileController.execute(dto, '1'),
    ).rejects.toBeInstanceOf(ProfileIsExistsException);
  });
});
