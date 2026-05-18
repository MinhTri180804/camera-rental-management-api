import { DeliveryInformationEntity } from '../../entities';

export interface IDeliveryInformationRepository {
  create(
    data: Omit<
      DeliveryInformationEntity,
      'id' | 'createdAt' | 'updatedAt' | 'addressTextFull'
    >,
  ): Promise<DeliveryInformationEntity>;

  findAllByUserId({
    userId,
    search,
  }: {
    userId: string;
    search?: string;
  }): Promise<DeliveryInformationEntity[]>;

  delete({ id, userId }: { id: string; userId: string }): Promise<void>;

  update({
    data,
    deliveryInformationId,
    userId,
  }: {
    data: {
      address?: Partial<DeliveryInformationEntity['address']>;
      name?: string;
      fullNameRecipient?: string;
      phoneRecipient?: string;
    };
    deliveryInformationId: string;
    userId: string;
  }): Promise<DeliveryInformationEntity | null>;

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeliveryInformationEntity | null>;
}

export const DELIVERY_INFORMATION_REPOSITORY = Symbol(
  'DELIVERY_INFORMATION_REPOSITORY',
);
