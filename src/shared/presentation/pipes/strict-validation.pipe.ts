import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ValidationRequestException } from '../exceptions/validation.exception';
import { cleanObject } from '@common/utils/clean-object.util';
import { RequestBodyEmptyException } from '../exceptions';

export class StrictValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (error) => {
        const detailsError = error.map((errorValue) => ({
          field: errorValue.property,
          message: Object.values(errorValue.constraints || {}),
        }));

        return new ValidationRequestException(detailsError);
      },
    });
  }

  async transform(value: object, metadata: ArgumentMetadata) {
    const transformed = (await super.transform(value, metadata)) as object;

    if (
      !transformed ||
      typeof transformed !== 'object' ||
      Array.isArray(transformed)
    )
      return transformed as unknown[];

    const transformClean = cleanObject({ object: transformed });

    if (Object.keys(transformClean).length === 0) {
      throw new RequestBodyEmptyException('Request body cannot be empty');
    }

    return transformed;
  }
}
