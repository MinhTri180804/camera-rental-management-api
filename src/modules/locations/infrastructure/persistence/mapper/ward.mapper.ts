import { WardEntity } from '@modules/locations/domain/entities';
import { WardsDocument, WardsSchemaClass } from '../schema';

export class WardMapper {
  static toDomain(ward: WardsDocument): WardEntity {
    const entity = new WardEntity();
    entity.id = ward._id.toString();
    entity.code = ward.code;
    entity.name = ward.name;
    entity.normalizedName = ward.normalized_name;
    entity.codeName = ward.code_name;
    entity.divisionType = ward.division_type;
    entity.provinceCode = ward.province_code;
    return entity;
  }

  static toPersistence(ward: WardEntity): Omit<WardsSchemaClass, '_id'> {
    const document: Omit<WardsSchemaClass, '_id'> = {
      code: ward.code,
      name: ward.name,
      normalized_name: ward.normalizedName,
      code_name: ward.codeName,
      division_type: ward.divisionType,
      province_code: ward.provinceCode,
    };
    return document;
  }
}
