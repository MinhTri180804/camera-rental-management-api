import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchemaModel } from '../shared/infrastructure/persistence/schema';
import { MediaModule } from '@modules/media/media.module';
import { JwtAccessTokenModule } from '@shared/infrastructure';
import { MEDIA_READER } from '../shared/domain/ports/reader';
import { MediaReaderImpl } from '../shared/infrastructure/reader';
import { CATEGORY_REPOSITORY } from '../shared/domain/ports';
import { CategoryRepositoryImpl } from '../shared/infrastructure/persistence/repository/category.repository.iml';
import { CreateCategoryUseCase } from './application/use-case/create';
import { AdminCategoryController } from './presentation/admin-category.controller';
import { GetAllCategoriesUseCase } from './application/use-case/get-all';
import { UpdateCategoryUseCase } from './application/use-case/update/update-category.usecase';
import { ChangeParentCategoryUseCase } from './application/use-case/change-parent';
import { GetDetailsCategoryUseCase } from './application/use-case/get-details';
import { TRANSACTION_MANAGER_SERVICE } from '@shared/domain';
import { MongoTransactionManagerServiceImpl } from '@shared/infrastructure/transaction-manager';

@Module({
  imports: [
    MongooseModule.forFeature([CategoriesSchemaModel]),
    MediaModule,
    JwtAccessTokenModule,
  ],
  providers: [
    {
      provide: MEDIA_READER,
      useClass: MediaReaderImpl,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: TRANSACTION_MANAGER_SERVICE,
      useClass: MongoTransactionManagerServiceImpl,
    },
    CreateCategoryUseCase,
    GetAllCategoriesUseCase,
    UpdateCategoryUseCase,
    ChangeParentCategoryUseCase,
    GetDetailsCategoryUseCase,
  ],
  controllers: [AdminCategoryController],
  exports: [MongooseModule],
})
export class AdminCategoryModule {}
