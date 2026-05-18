import { DeliveryInformationEntity } from '@modules/delivery-information/domain/entities';
import {
  type DeliveryInformationDocument,
  DeliveryInformationSchemaClass,
} from '../schema';
import { Types } from 'mongoose';

export class DeliveryInformationMapper {
  static toDomain(
    deliveryInformationDocument: DeliveryInformationDocument,
  ): DeliveryInformationEntity {
    const deliveryInformation = new DeliveryInformationEntity();
    deliveryInformation.id = deliveryInformationDocument._id.toString();
    deliveryInformation.address = {
      province: {
        code: deliveryInformationDocument.address.province.code,
        name: deliveryInformationDocument.address.province.name,
        divisionType:
          deliveryInformationDocument.address.province.division_type,
      },
      ward: {
        code: deliveryInformationDocument.address.ward.code,
        name: deliveryInformationDocument.address.ward.name,
        divisionType: deliveryInformationDocument.address.ward.division_type,
        provinceCode: deliveryInformationDocument.address.ward.province_code,
      },
      street: deliveryInformationDocument.address.street,
    };
    deliveryInformation.userId = deliveryInformationDocument.user_id.toString();
    deliveryInformation.name = deliveryInformationDocument.name;
    deliveryInformation.fullNameRecipient =
      deliveryInformationDocument.fullname_recipient;
    deliveryInformation.phoneRecipient =
      deliveryInformationDocument.phone_recipient;
    deliveryInformation.addressTextFull = `${deliveryInformationDocument.address.street}, ${deliveryInformationDocument.address.ward.name}, ${deliveryInformationDocument.address.province.name}`;
    deliveryInformation.normalizedName =
      deliveryInformationDocument.normalized_name;
    deliveryInformation.updatedAt = deliveryInformationDocument.updatedAt;
    deliveryInformation.createdAt = deliveryInformationDocument.createdAt;
    return deliveryInformation;
  }

  static toPersistence(
    data: Omit<
      DeliveryInformationEntity,
      'id' | 'createdAt' | 'updatedAt' | 'addressTextFull'
    >,
  ): Omit<DeliveryInformationSchemaClass, 'created_at' | 'updated_at'> {
    return {
      user_id: new Types.ObjectId(data.userId),
      name: data.name,
      normalized_name: data.normalizedName,
      fullname_recipient: data.fullNameRecipient,
      phone_recipient: data.phoneRecipient,
      address: {
        province: {
          code: data.address.province.code,
          name: data.address.province.name,
          division_type: data.address.province.divisionType,
        },
        ward: {
          code: data.address.ward.code,
          name: data.address.ward.name,
          division_type: data.address.ward.divisionType,
          province_code: data.address.ward.provinceCode,
        },
        street: data.address.street,
      },
    };
  }
}
