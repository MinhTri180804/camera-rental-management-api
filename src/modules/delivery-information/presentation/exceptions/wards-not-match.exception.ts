import { ValidationRequestException } from '@shared/presentation';

export class WardsNotMatchException extends ValidationRequestException {
  constructor({
    wardNameInput,
    wardNameDatabase,
  }: {
    wardNameInput: string;
    wardNameDatabase: string;
  }) {
    super(
      [
        {
          field: 'ward.name',
          message: [
            `Ward name not match: ${wardNameInput} != ${wardNameDatabase}`,
          ],
        },
      ],
      'Wards not match',
    );
  }
}
