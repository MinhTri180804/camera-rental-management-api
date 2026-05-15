import { WardEntity } from '@modules/delivery-information/domain/entities';
import { WardsDocument } from '@modules/locations/infrastructure/persistence/schema';

export class WardMapper {
  static toDomain(wardDocument: WardsDocument): WardEntity {
    const ward = new WardEntity();
    ward.code = wardDocument.code;
    ward.name = wardDocument.name;
    return ward;
  }
}
