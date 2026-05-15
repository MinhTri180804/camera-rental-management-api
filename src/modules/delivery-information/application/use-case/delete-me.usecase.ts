import {
  DELIVERY_INFORMATION_REPOSITORY,
  type IDeliveryInformationRepository,
} from '@modules/delivery-information/domain/ports/repositories';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = {
  id: string;
  userId: string;
};

@Injectable()
export class DeleteMeDeliveryInformationUseCase {
  constructor(
    @Inject(DELIVERY_INFORMATION_REPOSITORY)
    private readonly _deliveryInformationRepository: IDeliveryInformationRepository,
  ) {}

  async execute({ id, userId }: ExecuteParams): Promise<void> {
    await this._deliveryInformationRepository.delete({ id, userId });
    return;
  }
}
