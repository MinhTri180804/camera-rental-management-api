import { ValidationRequestException } from '@shared/presentation';

export class WardsNotFoundException extends ValidationRequestException {
  constructor() {
    super(
      [
        {
          field: 'ward.code',
          message: ['Ward code or province code not found'],
        },
        {
          field: 'ward.provinceCode',
          message: ['Ward code or province code not found'],
        },
      ],
      'Wards not found',
    );
  }
}
