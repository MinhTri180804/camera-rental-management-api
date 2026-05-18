import { normalizedName } from '@common/utils';
import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { userId: string; search?: string };

@Injectable()
export class GetAllMeDeliveryInformationUseCase {
  constructor(
    @Inject(DELIVERY_INFORMATION_REPOSITORY)
    private readonly _deliveryInformationRepository: IDeliveryInformationRepository,
  ) {}

  async execute({ userId, search }: ExecuteParams) {
    const searchValue = search ? normalizedName(search) : undefined;
    const deliveriesInformation =
      await this._deliveryInformationRepository.findAllByUserId({
        userId,
        search: searchValue,
      });
    return deliveriesInformation;
  }
}
