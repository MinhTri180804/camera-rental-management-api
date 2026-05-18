import {
  IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileDTO } from '../dto';
import { CreateProfileUseCase } from './create-profile.usecase';
import { DomainException } from '@shared/presentation';

describe('CreateProfileUseCase', () => {
  let usecase: CreateProfileUseCase;
  let profileRepository: jest.Mocked<
    Pick<IProfileRepository, 'create' | 'profileByUserIdIsExist'>
  >;

  beforeAll(async () => {
    const profileRepositoryMock = {
      create: jest.fn() as jest.MockedFunction<IProfileRepository['create']>,
      profileByUserIdIsExist: jest.fn() as jest.MockedFunction<
        IProfileRepository['profileByUserIdIsExist']
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PROFILE_REPOSITORY_TOKEN,
          useValue: profileRepositoryMock,
        },
        CreateProfileUseCase,
      ],
    }).compile();

    usecase = module.get(CreateProfileUseCase);
    profileRepository = module.get(PROFILE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Execute', () => {
    it('should create a profile | no avatarUrl and avatarPublicId', async () => {
      const userIdMocked = '123456789012345678901234';
      const dto: CreateProfileDTO = {
        firstName: 'John',
        lastName: 'Doe',
      };
      profileRepository.profileByUserIdIsExist.mockResolvedValue(false);
      profileRepository.create.mockResolvedValue({
        ...dto,
        userId: userIdMocked,
        id: '123456789012345678901234',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await usecase.execute({
        userId: userIdMocked,
        ...dto,
      });

      expect(result).toEqual({
        userId: userIdMocked,
        id: expect.any(String) as string,
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatar: null,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });

      expect(profileRepository.profileByUserIdIsExist).toHaveBeenCalledWith(
        userIdMocked,
      );
    });

    it('should throw an error if profile already exists', async () => {
      const userIdMocked = '123456789012345678901234';
      const dto: CreateProfileDTO = {
        firstName: 'John',
        lastName: 'Doe',
      };
      profileRepository.profileByUserIdIsExist.mockResolvedValue(true);

      await expect(
        usecase.execute({
          userId: userIdMocked,
          ...dto,
        }),
      ).rejects.toBeInstanceOf(DomainException);

      expect(profileRepository.create).not.toHaveBeenCalled();
    });
  });
});
