import { ProvinceEntity } from '@modules/delivery-information/domain/entities';
import { ProvincesDocument } from '@modules/locations/infrastructure/persistence/schema';

export class ProvinceMapper {
  static toDomain(provinceDocument: ProvincesDocument): ProvinceEntity {
    const entity = new ProvinceEntity();
    entity.code = provinceDocument.code;
    entity.name = provinceDocument.name;
    return entity;
  }
}
