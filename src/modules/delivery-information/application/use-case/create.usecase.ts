import {
  type IProvincesReader,
  type IWardsReader,
  PROVINCES_READER,
  WARDS_READER,
} from '@modules/delivery-information/domain/ports/readers';
import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { CreateDeliveryInformationDTO } from '../dto';
import {
  ProvincesNotFoundException,
  ProvincesNotMatchException,
  WardsNotFoundException,
  WardsNotMatchException,
} from '@modules/delivery-information/presentation/exceptions';
import { normalizedName } from '@common/utils';

type ExecuteParams = { userId: string } & CreateDeliveryInformationDTO;

@Injectable()
export class CreateDeliveryInformationUseCase {
  constructor(
    @Inject(DELIVERY_INFORMATION_REPOSITORY)
    private readonly _deliveryInformationRepository: IDeliveryInformationRepository,

    @Inject(PROVINCES_READER)
    private readonly _provincesReader: IProvincesReader,

    @Inject(WARDS_READER)
    private readonly _wardsReader: IWardsReader,
  ) {}

  async execute(params: ExecuteParams) {
    const { name, fullNameRecipient, phoneRecipient, address } = params;

    const provinces = await this._provincesReader.findByCode(
      address.province.code,
    );

    if (!provinces) {
      throw new ProvincesNotFoundException();
    }

    if (provinces.name !== address.province.name) {
      throw new ProvincesNotMatchException({
        provinceNameInput: address.province.name,
        provinceNameDatabase: provinces.name,
      });
    }

    const wards = await this._wardsReader.findByCodeAndProvinceCode(
      address.ward.code,
      address.province.code,
    );

    if (!wards) {
      throw new WardsNotFoundException();
    }

    if (wards.name !== address.ward.name) {
      throw new WardsNotMatchException({
        wardNameInput: address.ward.name,
        wardNameDatabase: wards.name,
      });
    }

    const deliveryInformation =
      await this._deliveryInformationRepository.create({
        userId: params.userId,
        name,
        fullNameRecipient,
        phoneRecipient,
        address: {
          province: address.province,
          ward: address.ward,
          street: address.street,
        },
        normalizedName: normalizedName(name),
      });

    return deliveryInformation;
  }
}
