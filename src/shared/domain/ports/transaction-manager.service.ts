import { ClientSession } from 'mongoose';

export interface ITransactionManagerService {
  runInTransaction<T>(
    fn: (context: ITransactionContext) => Promise<T>,
  ): Promise<T>;
}

export interface ITransactionContext {
  session: ClientSession;
}

export const TRANSACTION_MANAGER_SERVICE = Symbol(
  'TRANSACTION_MANAGER_SERVICE',
);
