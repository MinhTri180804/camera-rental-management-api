import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { DeliveryInformationNotFoundException } from '@modules/delivery-information/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { id: string; userId: string };

@Injectable()
export class GetMeDeliveryInformationByIdUseCase {
  constructor(
    @Inject(DELIVERY_INFORMATION_REPOSITORY)
    private readonly _deliveryInformationRepository: IDeliveryInformationRepository,
  ) {}

  async execute({ id, userId }: ExecuteParams) {
    const deliveryInformation =
      await this._deliveryInformationRepository.findByIdAndUserId(id, userId);

    if (!deliveryInformation) {
      throw new DeliveryInformationNotFoundException();
    }

    return deliveryInformation;
  }
}
