import { ProvinceEntity } from '@modules/locations/domain/entities';
import { ProvincesDocument, ProvincesSchemaClass } from '../schema';

export class ProvinceMapper {
  static toDomain(province: ProvincesDocument): ProvinceEntity {
    const entity = new ProvinceEntity();
    entity.id = province._id.toString();
    entity.code = province.code;
    entity.name = province.name;
    entity.normalizedName = province.normalized_name;
    entity.codeName = province.code_name;
    entity.phoneCode = province.phone_code;
    entity.divisionType = province.division_type;
    return entity;
  }

  static toPersistence(province: ProvinceEntity): ProvincesSchemaClass {
    const document: ProvincesSchemaClass = {
      code: province.code,
      name: province.name,
      normalized_name: province.normalizedName,
      code_name: province.codeName,
      phone_code: province.phoneCode,
      division_type: province.divisionType,
    };
    return document;
  }
}
