import { Injectable } from '@nestjs/common';

@Injectable()
export class MockMailProcessor {
  // Empty mock processor that doesn't extend WorkerHost
  // This prevents worker creation in tests
  process(_job: any): void {
    // Do nothing in tests

    void _job;
  }
}
