import { DynamicModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

export class TestQueueModule {
  static forRoot(): DynamicModule {
    return {
      module: TestQueueModule,
      imports: [
        // Minimal BullMQ config for tests
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
      providers: [],
      exports: [],
    };
  }

  static registerQueue(name: string): DynamicModule {
    return {
      module: TestQueueModule,
      imports: [
        BullModule.registerQueue({
          name,
        }),
      ],
    };
  }
}
