import { ValidationRequestException } from '@shared/presentation';

export class ProvincesNotFoundException extends ValidationRequestException {
  constructor() {
    super(
      [
        {
          field: 'province.code',
          message: ['Province not found'],
        },
      ],
      'Provinces not found',
    );
  }
}
