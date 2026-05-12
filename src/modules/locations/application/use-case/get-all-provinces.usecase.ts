import { normalizedName } from '@common/utils';
import {
  type IProvincesRepository,
  PROVINCES_REPOSITORY,
} from '@modules/locations/domain/ports';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = {
  search?: string;
};

@Injectable()
export class GetAllProvincesUseCase {
  constructor(
    @Inject(PROVINCES_REPOSITORY)
    private readonly _provincesRepository: IProvincesRepository,
  ) {}

  async execute({ search }: ExecuteParams) {
    const searchValue = search ? normalizedName(search) : undefined;
    return this._provincesRepository.findAllByNormalizedNames(searchValue);
  }
}
