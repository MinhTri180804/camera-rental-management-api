import { InjectConnection } from '@nestjs/mongoose';
import {
  ITransactionContext,
  ITransactionManagerService,
} from '@shared/domain';
import { ClientSession, Connection } from 'mongoose';

export class MongoTransactionContext implements ITransactionContext {
  constructor(public readonly session: ClientSession) {}
}

export class MongoTransactionManagerServiceImpl implements ITransactionManagerService {
  constructor(@InjectConnection() private readonly _connection: Connection) {}

  async runInTransaction<T>(
    fn: (context: ITransactionContext) => Promise<T>,
  ): Promise<T> {
    const session = await this._connection.startSession();

    try {
      let result: T;
      await session.withTransaction(async () => {
        result = await fn(new MongoTransactionContext(session));
      });
      return result!;
    } finally {
      await session.endSession();
    }
  }
}
