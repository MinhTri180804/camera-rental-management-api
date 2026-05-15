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
    data: Partial<
      Omit<
        DeliveryInformationEntity,
        '_id' | 'createdAt' | 'updatedAt' | 'userId'
      >
    >;
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
