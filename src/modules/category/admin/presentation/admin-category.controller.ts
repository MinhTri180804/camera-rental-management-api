import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ChangeParentCategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../application/dto';
import { CreateCategoryUseCase } from '../application/use-case/create';
import {
  CurrentAccessTokenPayload,
  ListDataResponse,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';
import { GetAllCategoriesUseCase } from '../application/use-case/get-all';
import { GetAllCategoriesQuery } from '../application/query';
import { UpdateCategoryUseCase } from '../application/use-case/update/update-category.usecase';
import { ChangeParentCategoryUseCase } from '../application/use-case/change-parent';
import { GetDetailsCategoryUseCase } from '../application/use-case/get-details';

@Controller('admin/categories')
export class AdminCategoryController {
  constructor(
    private readonly _createCategoryUseCase: CreateCategoryUseCase,
    private readonly _getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly _updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly _changeParentCategoryUseCase: ChangeParentCategoryUseCase,
    private readonly _getDetailsCategoryUseCase: GetDetailsCategoryUseCase,
  ) {}

  @Post('')
  @ResponseMessage('Create category successfully')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentAccessTokenPayload('sub') userId: string,
    @Body() dto: CreateCategoryDTO,
  ) {
    const category = await this._createCategoryUseCase.execute({ dto, userId });
    return new SingleDataResponse(category);
  }

  @Get('')
  @ResponseMessage('Get all categories successfully')
  @HttpCode(HttpStatus.OK)
  async getAllCategories(@Query() query: GetAllCategoriesQuery) {
    const { data, total } = await this._getAllCategoriesUseCase.execute({
      query,
    });

    return new ListDataResponse({
      data,
      total,
      page: query.page,
      limit: query.limit,
    });
  }

  @Patch(':id')
  @ResponseMessage('Updated category successfully')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDTO) {
    const category = await this._updateCategoryUseCase.execute({ dto, id });

    return new SingleDataResponse(category);
  }

  @Patch('change-parent/:id')
  @ResponseMessage('Change Parent category successfully')
  @HttpCode(HttpStatus.OK)
  async changeParent(
    @Param('id') id: string,
    @Body() dto: ChangeParentCategoryDTO,
  ) {
    const data = await this._changeParentCategoryUseCase.execute({
      id,
      dto,
    });

    return new SingleDataResponse(data);
  }

  @Get(':id')
  @ResponseMessage('Get details category successfully')
  @HttpCode(HttpStatus.OK)
  async getDetails(@Param('id') id: string) {
    const category = await this._getDetailsCategoryUseCase.execute({ id });
    return new SingleDataResponse(category);
  }
}
