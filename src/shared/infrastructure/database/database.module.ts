import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBFactory } from './mongodb/mongodb.factory';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoDBFactory,
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
