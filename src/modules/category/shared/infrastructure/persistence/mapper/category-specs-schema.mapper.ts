import {
  BooleanSpecSchemaDto,
  RangeSpecSchemaDto,
  SelectSpecSchemaDto,
  TextSpecSchemaDto,
} from '@modules/category/shared/application/dto/category/spec-schema.dto';
import {
  BooleanSpecSchemaEntity,
  RangeSpecSchemaEntity,
  SelectSpecSchemaEntity,
  TextSpecSchemaEntity,
} from '@modules/category/shared/domain/entities/category';

export class CategorySpecsSchemaMapper {
  static toEntity(
    dto: (
      | SelectSpecSchemaDto
      | RangeSpecSchemaDto
      | BooleanSpecSchemaDto
      | TextSpecSchemaDto
    )[],
  ): (
    | SelectSpecSchemaEntity
    | RangeSpecSchemaEntity
    | BooleanSpecSchemaEntity
    | TextSpecSchemaEntity
  )[] {
    return dto.map((item) => {
      switch (item.type) {
        case 'select': {
          const entity = new SelectSpecSchemaEntity();
          entity.key = item.key;
          entity.label = item.label;
          entity.unit = item.unit;
          entity.filterable = item.filterable;
          entity.compareEnabled = item.compareEnabled;
          entity.sortOrder = item.sortOrder;
          entity.type = item.type;
          entity.filterType = item.filterType;
          entity.options = item.options;
          entity.multiple = item.multiple;
          return entity;
        }

        case 'range': {
          const rangeEntity = new RangeSpecSchemaEntity();
          rangeEntity.key = item.key;
          rangeEntity.label = item.label;
          rangeEntity.unit = item.unit;
          rangeEntity.filterable = item.filterable;
          rangeEntity.compareEnabled = item.compareEnabled;
          rangeEntity.sortOrder = item.sortOrder;
          rangeEntity.type = item.type;
          rangeEntity.filterType = item.filterType;
          rangeEntity.min = item.min;
          rangeEntity.max = item.max;
          rangeEntity.step = item.step;
          return rangeEntity;
        }

        case 'boolean': {
          const booleanEntity = new BooleanSpecSchemaEntity();
          booleanEntity.key = item.key;
          booleanEntity.label = item.label;
          booleanEntity.unit = item.unit;
          booleanEntity.filterable = item.filterable;
          booleanEntity.compareEnabled = item.compareEnabled;
          booleanEntity.sortOrder = item.sortOrder;
          booleanEntity.type = item.type;
          booleanEntity.filterType = item.filterType;
          return booleanEntity;
        }

        case 'text': {
          const textEntity = new TextSpecSchemaEntity();
          textEntity.key = item.key;
          textEntity.label = item.label;
          textEntity.unit = item.unit;
          textEntity.filterable = item.filterable;
          textEntity.compareEnabled = item.compareEnabled;
          textEntity.sortOrder = item.sortOrder;
          textEntity.type = item.type;
          textEntity.options = item.options;
          return textEntity;
        }

        default:
          throw new Error('Invalid spec schema type');
      }
    });
  }
}
