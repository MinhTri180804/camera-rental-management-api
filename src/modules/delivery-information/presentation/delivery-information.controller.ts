import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateDeliveryInformationUseCase,
  DeleteMeDeliveryInformationUseCase,
  GetAllMeDeliveryInformationUseCase,
  GetMeDeliveryInformationByIdUseCase,
  UpdateMeDeliveryInformationUseCase,
} from '../application/use-case';
import {
  CreateDeliveryInformationDTO,
  UpdateDeliveryInformationDTO,
} from '../application/dto';
import {
  CurrentAccessTokenPayload,
  ResponseMessage,
} from '@shared/presentation/decorator';
import { ListDataResponse, SingleDataResponse } from '@shared/presentation';

@Controller('deliveries-information')
export class DeliveryInformationController {
  constructor(
    private readonly _createDeliveryInformationUseCase: CreateDeliveryInformationUseCase,
    private readonly _getAllMeDeliveryInformationUseCase: GetAllMeDeliveryInformationUseCase,
    private readonly _deleteMeDeliveryInformationUseCase: DeleteMeDeliveryInformationUseCase,
    private readonly _updateMeDeliveryInformationUseCase: UpdateMeDeliveryInformationUseCase,
    private readonly _getMeDeliveryInformationByIdUseCase: GetMeDeliveryInformationByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Create delivery information successfully')
  async create(
    @Body() dto: CreateDeliveryInformationDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const deliveryInformation =
      await this._createDeliveryInformationUseCase.execute({
        userId,
        ...dto,
      });

    return new SingleDataResponse(deliveryInformation);
  }

  @Get('me')
  @HttpCode(200)
  @ResponseMessage('Get all delivery information successfully')
  async getAllMe(
    @CurrentAccessTokenPayload('sub') userId: string,
    @Query('search') search?: string,
  ) {
    const hasSearch = search ? search.trim().length > 0 : false;
    const deliveriesInformation =
      await this._getAllMeDeliveryInformationUseCase.execute({
        userId,
        search: hasSearch && search ? search.trim() : undefined,
      });

    return new ListDataResponse({
      data: deliveriesInformation,
      total: deliveriesInformation.length,
      page: 1,
      limit: deliveriesInformation.length,
    });
  }

  @Delete('me/:id')
  @HttpCode(200)
  @ResponseMessage('Delete delivery information successfully')
  async delete(
    @Param('id') id: string,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    await this._deleteMeDeliveryInformationUseCase.execute({ id, userId });
    return new SingleDataResponse(null);
  }

  @Patch('me/:id')
  @HttpCode(200)
  @ResponseMessage('Update delivery information successfully')
  async update(
    @Body() dto: UpdateDeliveryInformationDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
    @Param('id') id: string,
  ) {
    const newDeliveryInformation =
      await this._updateMeDeliveryInformationUseCase.execute({
        dto,
        deliveryInformationId: id,
        userId,
      });

    return new SingleDataResponse(newDeliveryInformation);
  }

  @Get('me/:id')
  @HttpCode(200)
  @ResponseMessage('Get delivery information by id successfully')
  async getMeById(
    @Param('id') id: string,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const deliveryInformation =
      await this._getMeDeliveryInformationByIdUseCase.execute({
        id,
        userId,
      });

    return new SingleDataResponse(deliveryInformation);
  }
}
