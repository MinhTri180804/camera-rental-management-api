import { applyDecorators } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { CLASSIFICATION_TYPE } from '../../../constants';

export function IsClassificationTypePattern() {
  const CLASSIFICATION_TYPE_MESSAGE =
    'Classification type must be one of: ' +
    Object.values(CLASSIFICATION_TYPE).join(', ');
  return applyDecorators(
    IsEnum(CLASSIFICATION_TYPE, { message: CLASSIFICATION_TYPE_MESSAGE }),
  );
}
