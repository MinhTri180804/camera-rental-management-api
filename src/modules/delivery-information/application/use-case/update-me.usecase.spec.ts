import {
  DELIVERY_INFORMATION_REPOSITORY,
  IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { UpdateMeDeliveryInformationUseCase } from './update-me.usecase';
import {
  IProvincesReader,
  IWardsReader,
  PROVINCES_READER,
  WARDS_READER,
} from '@modules/delivery-information/domain/ports/readers';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDeliveryInformationDTO } from '../dto';
import {
  CurrentWardNoExistsInNewProvinceException,
  NewWardNoExistsInCurrentProvinceException,
  ProvincesNotFoundException,
  ProvincesNotMatchException,
  WardNotFoundInProvinceException,
} from '@modules/delivery-information/presentation/exceptions';

describe('UpdateMeDeliveryInformationUseCase', () => {
  let useCase: UpdateMeDeliveryInformationUseCase;
  let deliveryInformationRepository: jest.Mocked<
    Pick<IDeliveryInformationRepository, 'update' | 'findByIdAndUserId'>
  >;
  let provincesReader: jest.Mocked<Pick<IProvincesReader, 'findByCode'>>;
  let wardsReader: jest.Mocked<
    Pick<IWardsReader, 'findByCode' | 'findByCodeAndProvinceCode'>
  >;

  const dto: UpdateDeliveryInformationDTO = {
    name: 'John Doe',
    fullNameRecipient: 'John Doe',
    phoneRecipient: '0123456789',
    address: {
      province: {
        code: 111,
        name: 'Hà Nội',
        divisionType: 'Thành phố',
      },

      ward: {
        code: 111,
        name: 'Phường 1',
        divisionType: 'Phường',
        provinceCode: 111,
      },
    },
  };

  beforeAll(async () => {
    deliveryInformationRepository = {
      update: jest.fn() as jest.MockedFunction<
        IDeliveryInformationRepository['update']
      >,
      findByIdAndUserId: jest.fn() as jest.MockedFunction<
        IDeliveryInformationRepository['findByIdAndUserId']
      >,
    };
    provincesReader = {
      findByCode: jest.fn() as jest.MockedFunction<
        IProvincesReader['findByCode']
      >,
    };
    wardsReader = {
      findByCode: jest.fn() as jest.MockedFunction<IWardsReader['findByCode']>,
      findByCodeAndProvinceCode: jest.fn() as jest.MockedFunction<
        IWardsReader['findByCodeAndProvinceCode']
      >,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeDeliveryInformationUseCase,
        {
          provide: DELIVERY_INFORMATION_REPOSITORY,
          useValue: deliveryInformationRepository,
        },
        {
          provide: PROVINCES_READER,
          useValue: provincesReader,
        },
        {
          provide: WARDS_READER,
          useValue: wardsReader,
        },
      ],
    }).compile();

    useCase = module.get(UpdateMeDeliveryInformationUseCase);
    deliveryInformationRepository = module.get(DELIVERY_INFORMATION_REPOSITORY);
    provincesReader = module.get(PROVINCES_READER);
    wardsReader = module.get(WARDS_READER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Execute', () => {
    it('should update delivery information successfully', async () => {
      provincesReader.findByCode.mockResolvedValue({
        code: 111,
        name: 'Hà Nội',
      });
      wardsReader.findByCodeAndProvinceCode.mockResolvedValue({
        code: 111,
        name: 'Phường 1',
        provinceCode: 111,
      });

      deliveryInformationRepository.update.mockResolvedValue({
        id: '1',
        userId: '1',
        name: 'John Doe',
        fullNameRecipient: 'John Doe',
        phoneRecipient: '0123456789',
        normalizedName: 'john doe',
        address: {
          province: {
            code: 111,
            name: 'Hà Nội',
            divisionType: 'Thành phố',
          },
          ward: {
            code: 111,
            name: 'Phường 1',
            provinceCode: 111,
            divisionType: 'Phường',
          },
          street: '123 Street',
        },
        addressTextFull: '123 Street, Phường 1, Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await useCase.execute({ userId: '1', deliveryInformationId: '1', dto });
    });

    it('should return error when province not found', async () => {
      const dto: UpdateDeliveryInformationDTO = {
        address: {
          province: {
            code: 111,
            name: 'Hà Nội',
            divisionType: 'Thành phố',
          },
        },
      };

      provincesReader.findByCode.mockResolvedValue(null);

      await expect(
        useCase.execute({ userId: '1', deliveryInformationId: '1', dto }),
      ).rejects.toThrow(ProvincesNotFoundException);
    });

    it('should return error when province name in dto not match with province name in database', async () => {
      const dto: UpdateDeliveryInformationDTO = {
        address: {
          province: {
            code: 111,
            name: 'Hà Nội',
            divisionType: 'Thành phố',
          },
        },
      };

      const provinceEntity = {
        code: 111,
        name: 'Hồ Chí Minh',
        divisionType: 'Thành phố',
      };

      provincesReader.findByCode.mockResolvedValue(provinceEntity);

      await expect(
        useCase.execute({ userId: '1', deliveryInformationId: '1', dto }),
      ).rejects.toThrow(ProvincesNotMatchException);
    });

    it('should return error when current ward not found in new province updating', async () => {
      const dto: UpdateDeliveryInformationDTO = {
        address: {
          province: {
            code: 222,
            name: 'Hồ Chí Minh',
            divisionType: 'Thành phố',
          },
        },
      };

      deliveryInformationRepository.findByIdAndUserId.mockResolvedValue({
        id: '1',
        userId: '1',
        name: 'testing',
        normalizedName: 'testing',
        fullNameRecipient: 'testing',
        phoneRecipient: '0123456789',
        address: {
          province: {
            code: 111,
            name: 'Hà Nội',
            divisionType: 'Thành phố',
          },
          ward: {
            code: 111,
            name: 'Phường 1',
            provinceCode: 111,
            divisionType: 'Phường',
          },

          street: '123 Street',
        },
        addressTextFull: '123 Street, Phường 1, Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const provinceEntity = {
        code: 222,
        name: 'Hồ Chí Minh',
        divisionType: 'Thành phố',
      };

      provincesReader.findByCode.mockResolvedValue(provinceEntity);

      await expect(
        useCase.execute({ userId: '1', deliveryInformationId: '1', dto }),
      ).rejects.toThrow(CurrentWardNoExistsInNewProvinceException);
    });

    it('should return error when new ward not found in current province', async () => {
      const dto: UpdateDeliveryInformationDTO = {
        address: {
          ward: {
            code: 222,
            name: 'Phường 2',
            provinceCode: 222,
            divisionType: 'Phường',
          },
        },
      };

      deliveryInformationRepository.findByIdAndUserId.mockResolvedValue({
        id: '1',
        userId: '1',
        name: 'testing',
        normalizedName: 'testing',
        fullNameRecipient: 'Testing',
        phoneRecipient: '0123456789',
        address: {
          province: {
            code: 111,
            name: 'Hà Nội',
            divisionType: 'Thành phố',
          },
          ward: {
            code: 222,
            name: 'Phường 2',
            provinceCode: 111,
            divisionType: 'Phường',
          },
          street: '123 Street',
        },
        addressTextFull: '123 Street, Phường 2, Hà Nội',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      wardsReader.findByCodeAndProvinceCode.mockResolvedValue({
        code: 222,
        name: 'Phường 2',
        provinceCode: 222,
      });

      await expect(
        useCase.execute({ userId: '1', deliveryInformationId: '1', dto }),
      ).rejects.toThrow(NewWardNoExistsInCurrentProvinceException);
    });
  });
});
