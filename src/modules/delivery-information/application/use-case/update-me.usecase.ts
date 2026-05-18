import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateDeliveryInformationDTO } from '../dto';
import {
  CurrentWardNoExistsInNewProvinceException,
  DeliveryInformationNotFoundException,
  NewWardNoExistsInCurrentProvinceException,
  ProvincesNotFoundException,
  ProvincesNotMatchException,
  WardNotFoundInProvinceException,
  WardsNotFoundException,
  WardsNotMatchException,
} from '@modules/delivery-information/presentation/exceptions';
import {
  type IProvincesReader,
  type IWardsReader,
  PROVINCES_READER,
  WARDS_READER,
} from '@modules/delivery-information/domain/ports/readers';
import { DeliveryInformationEntity } from '@modules/delivery-information/domain/entities';
import { WardUnitDTO } from '../dto/ward-unit.dto';
import { ProvinceUnitDTO } from '../dto/province-unit.dto';

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
    const hasUpdateAddress = !!dto.address;

    if (hasUpdateAddress) {
      await this._handleAddressUpdateCase({
        address: dto.address,
        deliveryInformationId,
        userId,
      });
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

  private async _handleAddressUpdateCase({
    address,
    deliveryInformationId,
    userId,
  }: {
    address: UpdateDeliveryInformationDTO['address'];
    deliveryInformationId: string;
    userId: string;
  }): Promise<void> {
    const hasProvince = !!address?.province;
    const hasWard = !!address?.ward;

    if (hasProvince && hasWard) {
      return await this._validateProvinceAndWard({
        ward: address.ward!,
        province: address.province!,
      });
    }

    // Case update only province
    if (hasProvince) {
      return await this._validateProvince({
        deliveryInformationId,
        province: address.province!,
        userId,
      });
    }

    if (hasWard) {
      return await this._validateWard({
        deliveryInformationId,
        ward: address.ward!,
        userId,
      });
    }

    return;
  }

  private async _getDeliveryInformation({
    deliveryInformationId,
    userId,
  }: {
    deliveryInformationId: string;
    userId: string;
  }): Promise<DeliveryInformationEntity> {
    const deliveryInformation =
      await this._deliveryInformationRepository.findByIdAndUserId(
        deliveryInformationId,
        userId,
      );

    if (!deliveryInformation) throw new DeliveryInformationNotFoundException();

    return deliveryInformation;
  }

  private async _validateProvinceAndWard({
    ward,
    province,
  }: {
    ward: WardUnitDTO;
    province: ProvinceUnitDTO;
  }): Promise<void> {
    if (ward.provinceCode !== province.code)
      throw new WardNotFoundInProvinceException({
        provinceCode: province.code,
      });

    const provinceEntity = await this._provincesReader.findByCode(
      province.code,
    );

    if (!provinceEntity) throw new ProvincesNotFoundException();

    if (provinceEntity.name !== province.name)
      throw new ProvincesNotMatchException({
        provinceNameDatabase: provinceEntity.name,
        provinceNameInput: province.name,
      });

    const wardEntity = await this._wardsReader.findByCodeAndProvinceCode({
      provinceCode: province.code,
      code: ward.code,
    });

    if (!wardEntity)
      throw new WardNotFoundInProvinceException({
        provinceCode: ward.provinceCode,
      });

    if (wardEntity.name !== ward.name)
      throw new WardsNotMatchException({
        wardNameDatabase: wardEntity.name,
        wardNameInput: ward.name,
      });

    if (wardEntity.provinceCode !== province.code)
      throw new WardNotFoundInProvinceException({
        provinceCode: province.code,
      });

    return;
  }

  private async _validateProvince({
    deliveryInformationId,
    province,
    userId,
  }: {
    deliveryInformationId: string;
    province: ProvinceUnitDTO;
    userId: string;
  }): Promise<void> {
    const provinceEntity = await this._provincesReader.findByCode(
      province.code,
    );

    if (!provinceEntity) throw new ProvincesNotFoundException();

    if (provinceEntity.name !== province.name)
      throw new ProvincesNotMatchException({
        provinceNameDatabase: provinceEntity.name,
        provinceNameInput: province.name,
      });

    const deliveryInformation = await this._getDeliveryInformation({
      deliveryInformationId,
      userId,
    });

    if (deliveryInformation.address.ward.provinceCode !== province.code) {
      throw new CurrentWardNoExistsInNewProvinceException();
    }

    return;
  }

  private async _validateWard({
    deliveryInformationId,
    ward,
    userId,
  }: {
    deliveryInformationId: string;
    ward: WardUnitDTO;
    userId: string;
  }): Promise<void> {
    const wardEntity = await this._wardsReader.findByCodeAndProvinceCode({
      code: ward.code,
      provinceCode: ward.provinceCode,
    });

    if (!wardEntity) throw new WardsNotFoundException();

    if (wardEntity.name !== ward.name)
      throw new WardsNotMatchException({
        wardNameDatabase: wardEntity.name,
        wardNameInput: ward.name,
      });

    const deliveryInformation = await this._getDeliveryInformation({
      deliveryInformationId,
      userId,
    });

    if (deliveryInformation.address.province.code !== ward.provinceCode)
      throw new NewWardNoExistsInCurrentProvinceException();

    return;
  }
}
