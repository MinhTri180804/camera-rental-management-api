import { normalizedName } from '@common/utils';
import { DeliveryInformationEntity } from '@modules/delivery-information/domain/entities';
import { IDeliveryInformationRepository } from '@modules/delivery-information/domain/ports/repositories';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types, UpdateQuery } from 'mongoose';
import { DeliveryInformationMapper } from '../mapper';
import {
  DeliveryInformationDocument,
  DeliveryInformationSchemaClass,
} from '../schema';

@Injectable()
export class DeliveryInformationRepositoryImpl implements IDeliveryInformationRepository {
  constructor(
    @InjectModel(DeliveryInformationSchemaClass.name)
    private readonly _deliveryInformationModel: Model<DeliveryInformationDocument>,
  ) {}

  async create(
    data: Omit<
      DeliveryInformationEntity,
      'id' | 'createdAt' | 'updatedAt' | 'addressTextFull'
    >,
  ): Promise<DeliveryInformationEntity> {
    const deliveryInformationDoc =
      DeliveryInformationMapper.toPersistence(data);

    const createdDoc = await this._deliveryInformationModel.create(
      deliveryInformationDoc,
    );
    return DeliveryInformationMapper.toDomain(createdDoc);
  }

  async findAllByUserId({
    userId,
    search,
  }: {
    userId: string;
    search?: string;
  }): Promise<DeliveryInformationEntity[]> {
    const filter: QueryFilter<DeliveryInformationDocument> = {
      user_id: new Types.ObjectId(userId),
    };
    if (search) {
      filter.normalized_name = {
        $regex: `.*${search}*`,
        $options: 'i',
      };
    }
    const deliveriesInformationDoc = await this._deliveryInformationModel
      .find(filter)
      .sort({ createdAt: 1 });

    return deliveriesInformationDoc.map((deliveryInformation) =>
      DeliveryInformationMapper.toDomain(deliveryInformation),
    );
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    await this._deliveryInformationModel.deleteOne({
      $and: [
        { _id: new Types.ObjectId(id) },
        { user_id: new Types.ObjectId(userId) },
      ],
    });
    return;
  }

  async update({
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
  }): Promise<DeliveryInformationEntity | null> {
    const updateQuery: UpdateQuery<DeliveryInformationDocument> = {};

    if (data.name) {
      updateQuery.name = data.name;
      updateQuery.normalized_name = normalizedName(data.name);
    }
    if (data.fullNameRecipient)
      updateQuery.fullname_recipient = data.fullNameRecipient;
    if (data.phoneRecipient) updateQuery.phone_recipient = data.phoneRecipient;
    if (data.address) {
      if (data.address.province)
        updateQuery['address.province'] = {
          code: data.address.province.code,
          name: data.address.province.name,
          division_type: data.address.province.divisionType,
        };

      if (data.address.ward)
        updateQuery['address.ward'] = {
          code: data.address.ward.code,
          name: data.address.ward.name,
          division_type: data.address.ward.divisionType,
          province_code: data.address.ward.provinceCode,
        };

      if (data.address.street)
        updateQuery['address.street'] = data.address.street;
    }
    const result = await this._deliveryInformationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(deliveryInformationId),
        user_id: new Types.ObjectId(userId),
      },
      updateQuery,
      {
        new: true,
      },
    );

    if (!result) return null;

    return DeliveryInformationMapper.toDomain(result);
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<DeliveryInformationEntity | null> {
    const result = await this._deliveryInformationModel.findOne({
      _id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(userId),
    });

    if (!result) return null;

    return DeliveryInformationMapper.toDomain(result);
  }
}
