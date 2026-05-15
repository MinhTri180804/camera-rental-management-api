import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateDeliveryInformationDTO } from '../dto';
import {
  DeliveryInformationNotFoundException,
  ProvincesNotFoundException,
  ProvincesNotMatchException,
  WardsNotFoundException,
  WardsNotMatchException,
} from '@modules/delivery-information/presentation/exceptions';
import {
  type IProvincesReader,
  type IWardsReader,
  PROVINCES_READER,
  WARDS_READER,
} from '@modules/delivery-information/domain/ports/readers';

type ExecuteParams = {
  dto: UpdateDeliveryInformationDTO;
  userId: string;
  deliveryInformationId: string;
};

@Injectable()
export class UpdateMeDeliveryInformationUseCase {
  constructor(
    @Inject(DELIVERY_INFORMATION_REPOSITORY)
    private readonly _deliveryInformationRepository: IDeliveryInformationRepository,

    @Inject(PROVINCES_READER)
    private readonly _provincesReader: IProvincesReader,

    @Inject(WARDS_READER)
    private readonly _wardsReader: IWardsReader,
  ) {}

  async execute({ deliveryInformationId, dto, userId }: ExecuteParams) {
    if (dto.address?.province) {
      const province = await this._provincesReader.findByCode(
        dto.address.province.code,
      );

      if (!province) {
        throw new ProvincesNotFoundException();
      }

      if (province.name !== dto.address.province.name) {
        throw new ProvincesNotMatchException({
          provinceNameDatabase: province.name,
          provinceNameInput: dto.address.province.name,
        });
      }
    }

    if (dto.address?.ward) {
      const ward = await this._wardsReader.findByCodeAndProvinceCode(
        dto.address.ward.code,
        dto.address.province.code,
      );

      if (!ward) {
        throw new WardsNotFoundException();
      }

      if (ward.name !== dto.address.ward.name) {
        throw new WardsNotMatchException({
          wardNameInput: dto.address.ward.name,
          wardNameDatabase: ward.name,
        });
      }
    }

    const newDeliveryInformation =
      await this._deliveryInformationRepository.update({
        deliveryInformationId,
        userId,
        data: {
          address: dto.address,
          fullNameRecipient: dto.fullNameRecipient,
          name: dto.name,
          phoneRecipient: dto.phoneRecipient,
        },
      });

    if (!newDeliveryInformation) {
      throw new DeliveryInformationNotFoundException();
    }

    return newDeliveryInformation;
  }
}
