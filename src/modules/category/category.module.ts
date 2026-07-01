import { Module } from '@nestjs/common';
import { AdminCategoryModule } from './admin/admin-category.module';

@Module({
  imports: [AdminCategoryModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class CategoryModule {}
