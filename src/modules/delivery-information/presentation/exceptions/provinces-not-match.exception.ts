import { ValidationRequestException } from '@shared/presentation';

export class ProvincesNotMatchException extends ValidationRequestException {
  constructor({
    provinceNameInput,
    provinceNameDatabase,
  }: {
    provinceNameInput: string;
    provinceNameDatabase: string;
  }) {
    super(
      [
        {
          field: 'province.name',
          message: [
            `Province name not match: ${provinceNameInput} != ${provinceNameDatabase}`,
          ],
        },
      ],
      'Provinces not match',
    );
  }
}
